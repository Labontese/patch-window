# Security Review, Patch Window

**Granskare:** Emelies säkerhetsgranskningsagent
**Datum:** 2026-04-16
**Scope:** commit fc46420 samt `D:/hetzner-project` (Traefik, docker-compose, deploy-workflow)

## Executive Summary

Sajten är en statiskt driven publikation utan publika POST-endpoints, så attackytan är smal i sig. Det finns dock en blockerande brist: `next@15.1.8` är sårbar för CVE-2025-55182 (RCE, CVSS 10.0). Den måste fixas innan produktion. Vid sidan av det finns ett par konkreta medelrisker (JSON-LD-utsläpp via frontmatter, `/health` läcker DB-felmeddelanden, Dockerfile HEALTHCHECK pingar fel endpoint). Allt som rör hemligheter, SQL-lagret, dynamiska imports och filsystemsåtkomst ser rimligt ut.

## Critical findings

### C1. Next.js 15.1.8 — okänd RCE-sårbarhet (CVE-2025-55182 / CVE-2025-66478)
- **Fil:** `package.json:20`, `package-lock.json:5222-5223`
- **Konfidens:** hög (bekräftad via Vercels advisory, Oligo Security, NCSC)
- CVE-2025-55182 (CVSS 10.0) är en oautentiserad RCE i React Server Components som drabbar Next.js App Router. Patchversion för 15.1.x-linjen är 15.1.11. 15.1.8 är sårbar.
- Samma dependency träffas också av CVE-2025-55184 (DoS via preparerad HTTP-request som orsakar oändlig loop i App Router) och CVE-2025-55183 (source code exposure).
- **Åtgärd:** uppgradera till `next@15.1.11` eller senare, bygg om imagen, pusha ny tagg, verifiera att `/health` svarar 200.

### C2. Dockerfile HEALTHCHECK pingar fel endpoint
- **Fil:** `Dockerfile:48-49`
- **Konfidens:** hög
- `HEALTHCHECK` kör `wget -qO- http://localhost:3000/ || exit 1`. Det är inte ett säkerhetsfynd i strikt mening, men det gör att DB-liveness inte verifieras i container-health (Traefik orkestrerar på image-health via `depends_on.service_healthy` i docker-compose när den chain:en används). Under smoke-testet i workflow:en (`.github/workflows/deploy.yml:65`) används däremot `/health`, så CI och produktions-runtime svarar på olika endpoints. Risken är att en trasig DB-anslutning i prod markeras "healthy" av Docker och Watchtower stannar kvar på den sista gröna pullen.
- **Åtgärd:** byt HEALTHCHECK-CMD till `/health`.

## High findings

### H1. `/health` läcker DB-felmeddelande i klartext vid fel
- **Fil:** `app/health/route.ts:19-25`
- **Konfidens:** hög
- Vid DB-fel returneras `err.message` i 503-responsen. `postgres` (porsager/postgres) lägger typiskt användarnamn, databasnamn, hostname eller relationnamn i felmeddelandet ("role \"patchwindow\" does not exist", "no pg_hba.conf entry for host ..., user ..., database ..., SSL off", "column \"xyz\" does not exist"). Endpointen är publik (`/health` är inte skyddad av Authelia i docker-compose-labels) och cachas inte.
- **Exploitvärde:** rekonbara uppgifter om DB-roll, host, schema. Hjälper en angripare att rikta nästa steg (pg_hba-probing, credential stuffing).
- **Åtgärd:** returnera bara `{ status: 'error' }` eller `{ status: 'error', code: err.code }`. Logga hela felet serverside.

### H2. `/health` ej rate-limited eller dolt
- **Fil:** `docker-compose.yml:109` (Traefik-labels för patchwindow)
- **Konfidens:** hög
- Endpointen är publik på `patchwindow.serverdigital.net/health`. Rate-limit-middleware är påsatt globalt (average 100 / burst 50), men eftersom `force-dynamic` tvingar DB-rundtur per request kan en angripare relativt billigt ramma Postgres med `SELECT 1`-queries. 100 req/s average över lång tid är mycket mot en gemensam Postgres som delas med Umami och n8n.
- **Åtgärd:** antingen (a) cacha `/health` 10 sekunder, (b) gör endpointen intern-only genom att lägga den på egen Traefik-router bakom IP-allowlist för uptime-kuma-containern, eller (c) skriv en egen rate-limit-middleware för just `/health` med lägre tak (ex. 10 req/s).

### H3. JSON-LD-injection via frontmatter kan bryta ut ur `<script>`
- **Fil:** `app/(formats)/{brief,deep-dive,hot-take}/[slug]/page.tsx:99-101`, `app/layout.tsx:89-98`, `app/about/daniel/page.tsx:96`, `components/Breadcrumbs.tsx:47`
- **Konfidens:** medel (exploit kräver push-access till repo-innehåll, men mönstret är en klassisk fotgevär-konstruktion)
- `dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}` där `articleJsonLd.headline`, `description` och `keywords` kommer direkt från MDX-frontmatter. `JSON.stringify` escapar inte `</script>`. En titel som `X </script><script>alert(1)</script>` i `content/articles/**.mdx` kompilerar utan fel och körs som kod på varje sidvisning.
- Hotmodellen: Patch Window är enpersonspublikation och contributorn är Daniel själv, så den realistiska angriparen är en komprometterad GitHub-sesson eller en framtida extern bidragsgivare. Men mönstret bör ändå härdas.
- **Åtgärd:** byt till `JSON.stringify(obj).replace(/</g, '\\u003c')` eller använd `safe-stable-stringify` / `serialize-javascript`. Applicera på alla fyra JSON-LD-ställena.

### H4. Docker image är public på GHCR, "latest" är en rörlig tag
- **Fil:** `.github/workflows/deploy.yml:38-41`, `docker-compose.yml:90`
- **Konfidens:** hög
- Imagen publiceras som `latest`, `<sha>`, och `<date>`. Prod-compose pekar på `latest`. Watchtower pollar nattligen. Om GHCR-repot komprometteras (eller någon med package:write-behörighet pushar en illvillig image med samma tag) så hämtar Watchtower den automatiskt vid nästa cykel, utan signaturverifiering eller digest-pinning.
- **Åtgärd:** pin:a på digest (`ghcr.io/labontese/patch-window@sha256:...`) i prod-compose, eller minst på `<sha>`-taggen, och låt en explicit PR flytta pinningen. Överväg cosign/sigstore-signering i workflow:en.

## Medium / Low findings

### M1. Dynamisk import med template literal körs, men är egentligen en webpack-glob
- **Fil:** `app/(formats)/{format}/[slug]/page.tsx:49-50`, `app/pathway/[slug]/page.tsx:54`
- **Konfidens:** hög
- `await import(\`@/content/articles/brief/${slug}.mdx\`)` utvidgas av webpack till ett context-module som matchar `./*.mdx` under just `content/articles/brief/`. Path traversal via `../` fungerar inte, eftersom webpack bygger upp contextet vid build-tid och en slug som `../deep-dive/foo` inte finns i indexet. Dessutom går slug genom `generateStaticParams()` som hämtar från filsystemet.
- **Ej en sårbarhet**, men värt att veta varför det är säkert. Lägg en kommentar i koden så ingen senare "refaktorerar" till `fs.readFileSync(path.join(base, slug + '.mdx'))` och introducerar en riktig traversal.

### M2. `app/pathway/[slug]/page.tsx` använder fs direkt innan slug valideras
- **Fil:** `app/pathway/[slug]/page.tsx:23-27`
- **Konfidens:** hög
- `generateMetadata` bygger `path.join(process.cwd(), 'content', 'pathways', \`${slug}.mdx\`)` och kör `fs.existsSync` innan whitelist-kontrollen mot `PATHWAYS`. En slug som `../articles/brief/wazuh-5-released` skulle få `existsSync` att returnera `true` och `gray-matter` att läsa filen. Description läcks sedan via metadata. `notFound()`-gatingen ligger först i `PathwayPage` (rad 42), inte i `generateMetadata`.
- Exploitvärde i dag: lågt, alla MDX-filer är redan publika via sina kanoniska URL:er. Men om draft-filer eller privata notes läggs in under `content/` senare blir detta en riktig läcka.
- **Åtgärd:** flytta `PATHWAYS.includes`-kontrollen till början av `generateMetadata` också, eller använd en explicit whitelist-baserad lookup istället för `path.join(slug)`.

### M3. `lib/db/index.ts` connection-pool är `max: 1`
- **Fil:** `lib/db/index.ts:14`
- **Konfidens:** hög
- Kommentaren säger att det passar ett serverless-läge. Men Next.js med `output: 'standalone'` och `node server.js` i Docker kör en persistent process. Med `max: 1` serialiseras alla requests som rör DB (idag bara `/health`). När du bygger ut `/corrections`-POST eller newsletter-flöden blir detta en instant-botteneck. Ej säkerhet i sig, men rör på DoS-ytan — en angripare kan parka `/health`-requests på den enda connection:en och trycka ut andra requests ur kö.
- **Åtgärd:** höj `max` till 5-10 när persistent server bekräftas, justera tillsammans med Postgres `max_connections`.

### M4. Rate-limit på 100/burst 50 är per-Traefik-instans, inte per-IP
- **Fil:** `hetzner-project/traefik/config/middlewares.yml:15-18`
- **Konfidens:** medel (Traefik-rateLimit har `sourceCriterion.ipStrategy` default till request source IP, men explicit konfig saknas)
- Standardbeteende för Traefik v3 `rateLimit` är faktiskt per klient-IP via `X-Forwarded-For` / RemoteAddr. Middleware:n är alltså OK men ej explicit, och om Traefik byts ut eller en operator missar `ipStrategy` kan den råka bli global. Sätt explicit `sourceCriterion.ipStrategy.depth: 1` och dokumentera antagandet.

### M5. Resend-klient instansieras vid import även om ingen mail skickas
- **Fil:** `lib/resend.ts:3-7`
- **Konfidens:** hög
- Miljövariabel-checken är fail-loud (bra), men klienten byggs vid import. Om hela sajten deployas utan `RESEND_API_KEY` kommer Next.js-processen krascha vid första import från `lib/resend.ts`. Det är ett "medvetet val" enligt kommentaren — men just nu importeras `resend` ingenstans (grep: inga hits utanför filen själv). Säkerhetsmässigt neutralt, men döda koden ökar attackyta om man glömmer den senare med en läckt nyckel.

### L1. Saknade security-headers i app-lagret, CSP saknas helt
- **Fil:** `next.config.mjs`, `traefik/config/middlewares.yml`
- **Konfidens:** hög
- Traefik sätter HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy och nosniff. Bra grundnivå. Men ingen `Content-Security-Policy`, ingen `Cross-Origin-Opener-Policy`, ingen `Cross-Origin-Resource-Policy`. Inline `<script type="application/ld+json">` kräver att CSP isf tillåter `script-src 'self' 'unsafe-inline'` eller nonces. Sajten har inga tredjeparts-scripts än — perfekt läge att slå på en striktCSP innan något läggs till.
- **Åtgärd:** lägg till `contentSecurityPolicy: "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; frame-ancestors 'none'; base-uri 'self'"` i security-headers-middlewaren. Verifiera mot next/font (Google Fonts laddas, bör täckas av `font-src`/`style-src`).

### L2. RSS-feed escapar apostrof som `&apos;` (namngiven XML-entitet, inte i XML 1.0 spec för attribut i alla parsers)
- **Fil:** `app/feed.xml/route.ts:10`
- **Konfidens:** medel
- `&apos;` är en giltig XML-entitet men vissa gamla feed-läsare stumlar på den i `<title>` när de förväntar sig HTML. Inte ett säkerhetsfynd. Escape-rutinen täcker de fem grundläggande XML-tecken:en, vilket är korrekt. Ingen CDATA behövs här eftersom inga kontrollkarakterer släpps igenom.

### L3. Inga CORS-headers
- **Konfidens:** hög
- Inga `Access-Control-*` headers satta någonstans i koden. Korrekt — sajten har inga publika API:er som ska tillåtas cross-origin. Om `/health` i framtiden används av extern monitoring, håll den som `same-origin` och proxya genom serverdigital-domänen istället för att öppna CORS.

### L4. `HEALTHCHECK` i Dockerfile använder `wget`, vilket kräver apt-BusyBox och ger större attachytan minimalt
- **Konfidens:** låg
- `node:22-alpine` har BusyBox `wget` out-of-the-box. Ingen förändring behövs, men det är värt att veta att `wget` inte validerar TLS by default och att man vid en framtida switch till localhost-HTTPS måste byta till `curl -fsSL`.

## Confirmed safe

- **SQL-injektion:** Drizzle ORM används endast via parametriserad `sql\`SELECT 1\`` i `app/health/route.ts:13`. Schema (`lib/db/schema.ts`) deklarerar tabeller via typsäker builder. Ingen rå SQL med interpolation någonstans i kodbasen. Konfidens: hög.
- **Email-spoofing via Resend:** `lib/resend.ts` är oanvänd i kodbasen just nu. Inget mail skickas faktiskt. När det aktiveras, se till att from-adressen är hårdkodad på serversidan och inte hämtas från user-input. Konfidens: hög.
- **XSS via MDX:** `mdx-components.tsx` använder React-komponenter, ingen `dangerouslySetInnerHTML` för brödtext. `<a href>` rel-kontrollen är korrekt för externa länkar. `<img>` tvingar alt-text. Konfidens: hög.
- **Path traversal via slug:** Webpack-context-imports (se M1) skyddar MDX-importen. `getArticleByFormatAndSlug` använder `path.join` men kollar `fs.existsSync` innan läsning och `getSlugs` listar bara faktiska filer, så en angripare kan inte få `../../etc/passwd` att läsas. Konfidens: hög.
- **Secrets i Docker-lager:** Dockerfile `COPY . .` i builder-steget kopierar hela repot, men `.env*` är i `.gitignore` och kommer inte med i git-checkouten. `RESEND_API_KEY` och `DATABASE_URL` sätts som env-vars vid runtime från docker-compose. Inga secrets bakas in i image-lagret. Konfidens: hög.
- **Non-root-användare i container:** Dockerfile rad 34-35 skapar `nextjs:1001`, rad 41 kör `USER nextjs`. Bra. Konfidens: hög.
- **DATABASE_URL / RESEND_API_KEY fail-loud:** `lib/db/index.ts:5-7`, `lib/resend.ts:3-5`, `drizzle.config.ts:3-5` kastar vid saknad variabel. Ingen tyst fallback. Konfidens: hög.
- **GitHub Actions third-party actions:** alla actions är från Docker eller Vercel official-orgs, alla pinnade på major (`@v4`, `@v3`, `@v6`). Ingen `uses: some/random-action@main`. OK men kan härdas genom att pinna på commit-SHA. Konfidens: medel.
- **CSRF:** inga POST-endpoints existerar. Korrigeringsrapportering sker via mailto-länk (`app/corrections/page.tsx`). Ingen CSRF-yta. Konfidens: hög.
- **Open redirects:** ingen route tar `?redirect=` eller liknande. `notFound()` används konsekvent istället för manuell redirect. Konfidens: hög.

## Dependencies scan

`npm audit` kunde inte köras pga sandbox-begränsning, men följande är manuellt verifierat via lockfile mot publika advisories:

| Paket | Version | Status |
|---|---|---|
| next | 15.1.8 | **SÅRBAR** — CVE-2025-55182 (RCE, 10.0), CVE-2025-55183, CVE-2025-55184 (DoS). Patch: 15.1.11. |
| react | 19.0.0 | OK (RSC-patchen finns i next-paketet, inte react). |
| drizzle-orm | 0.44.7 | Ingen känd advisory. |
| postgres | 3.4.9 | Ingen känd advisory. |
| gray-matter | 4.0.3 | Ingen känd advisory. Parse-based, läser bara YAML frontmatter. |
| resend | 4.8.0 | Ingen känd advisory. |
| @next/mdx | 15.1.8 | Följer next-version — uppgradera tillsammans. |
| shiki | 3.x | Ingen känd advisory. |
| rehype-pretty-code | 0.14.x | Ingen känd advisory. |

**Prioritet:** uppgradera Next.js först, resten kan vänta.

Rekommenderat: kör `npm audit --production` på en utvecklarmaskin och `npm outdated` innan varje deploy. Lägg ev. in `dependency-review-action` i GitHub Actions.

## Secrets hygiene

- `.gitignore` täcker `.env`, `.env.local`, `.env.*.local`, `*.pem`. Korrekt.
- `.env.example` innehåller bara platshållare (`changeme`, `re_...`). Korrekt.
- GitHub Actions workflow använder `secrets.DATABASE_URL` för `drizzle-kit migrate`-steget. Secret exponeras i stegets env men logas inte (Drizzle-kit ekar inte URL:en). Steget kör direkt efter build och kör `npm ci --ignore-scripts`, vilket skyddar mot postinstall-hooks som kunde läcka env. **Bra**.
- Smoke-testet sätter `DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"` — tydligt fake, ingen läckage. OK.
- Runtime-secrets för prod sätts på servern som `PATCHWINDOW_DATABASE_URL`, `PATCHWINDOW_RESEND_API_KEY` och mappas in via docker-compose `environment:`. De lever i docker-containerns env-fil, inte i imagen. OK, men se till att den env-filen på servern har permissions `600` och ägs av deploy-usern.
- Stdout-loggning av env: ingen kodpath loggar `process.env.DATABASE_URL` eller `RESEND_API_KEY`. Verifierat med grep. **Bra**.
- Kommentaren i workflow:en nämner att `DEPLOY_HOST` och `DEPLOY_SSH_KEY` "kan rensas". Gör det. Onödiga secrets är onödig läckageyta.

## Recommendations (prioriterade)

1. **Uppgradera next till 15.1.11 eller senare.** Blockerar produktion. Allt annat är sekundärt.
2. **Fixa `/health`:** ta bort `err.message` från responsen, cacha 10 s, och byt Dockerfile HEALTHCHECK till `/health`.
3. **Härda JSON-LD-renderingen:** byt `JSON.stringify(x)` mot `JSON.stringify(x).replace(/</g, '\\u003c')` i alla fem ställena, eller använd `serialize-javascript`.
4. **Flytta PATHWAYS-whitelisten till `generateMetadata`** i `app/pathway/[slug]/page.tsx`.
5. **Pin:a Docker-imagen på digest** i `docker-compose.yml`, ta bort `latest`-taggen från prod. Behåll Watchtower-labels men peka på specifik tagg.
6. **Lägg till CSP** i Traefik `security-headers`-middleware. Använd sajtens nuvarande minimalism som utgångspunkt.
7. **Rensa `DEPLOY_HOST`/`DEPLOY_SSH_KEY`-secrets** från GitHub-repot.
8. **Sätt explicit `sourceCriterion.ipStrategy.depth: 1`** på Traefik rate-limit.
9. **Höj DB-pool `max`** från 1 till 5-10 när `server.js` bekräftas som persistent process.
10. **Signera images** med cosign i workflow:en och verifiera på servern före pull. Kan vänta tills steg 1-5 är gjorda.

## Sources

- [Security Advisory: CVE-2025-66478, Next.js](https://nextjs.org/blog/CVE-2025-66478)
- [Next.js Security Update, December 11, 2025](https://nextjs.org/blog/security-update-2025-12-11)
- [Critical React & Next.js RCE Vulnerability (CVE-2025-55182 / CVE-2025-66478), Oligo Security](https://www.oligo.security/blog/critical-react-next-js-rce-vulnerability-cve-2025-55182-cve-2025-66478-what-you-need-to-know)
- [Vulnerability affecting Next.js web development framework, NCSC](https://www.ncsc.gov.uk/news/vulnerability-affecting-nextjs-web-development-framework)
- [Security Bulletin: CVE-2025-55184 and CVE-2025-55183, Vercel](https://vercel.com/kb/bulletin/security-bulletin-cve-2025-55184-and-cve-2025-55183)
- [RCE in React Server Components, GitHub Security Advisory GHSA-9qr9-h5gf-34mp](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp)
