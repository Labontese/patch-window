# Getting started

Den här guiden är för dig, Daniel. Den tar dig från noll till att skriva och publicera en artikel.

## Installera och köra lokalt

Du behöver Node 22 LTS. Kolla version med `node -v`.

```bash
npm install
cp .env.example .env.local
```

Redigera `.env.local`:

```
DATABASE_URL=postgresql://patchwindow:dittlosenord@localhost:5432/patchwindow
RESEND_API_KEY=re_din_nyckel
```

Kör migrationer (skapar `corrections` och `newsletter_subscribers`):

```bash
npm run db:migrate
```

Starta:

```bash
npm run dev
```

Appen finns på `http://localhost:3000`.

## Skriva en artikel

Skapa en `.mdx`-fil i `content/articles/`. Filnamnet blir URL-slug.

Exempel: `content/articles/linux-kernel-6-15.mdx` ger:
- `/hot-take/linux-kernel-6-15`
- `/deep-dive/linux-kernel-6-15`
- `/brief/linux-kernel-6-15`

Vilket format en artikel hör till bestäms av vilken route du länkar till, inte av filens placering. Alla tre format-routes pekar mot samma MDX-fil.

Minimal MDX-artikel:

```mdx
# Linux-kernel 6.15

Kärnteamet släppte 6.15 idag med...
```

Du kan använda alla standardkomponenter (rubriker, listor, kod, tabeller) utan extra konfiguration.

Kodsnuttar med syntax-highlighting:

````mdx
```rust
fn main() {
    println!("Hello from kernel land");
}
```
````

Shiki hanterar highlighting via `rehype-pretty-code`. Temat är `github-dark`.

## Pathways

Pathways är kurerade artikelsamlingar. Skapa dem i `content/pathways/`.

Exempel: `content/pathways/linux-for-devs.mdx` ger `/pathway/linux-for-devs`.

## Publicera

Push till `main`-branchen triggar GitHub Actions. Deploy tar ungefär 2-3 minuter.

Följ statusen under fliken "Actions" i GitHub-repot.
