# Versions

Fastlagda 2026-04-15 (steg 0). Uppdatera tabellen när en beroende bumpas.

| Paket / runtime | Version | Motivering |
|---|---|---|
| Node.js | 22 LTS | Node 20 når EOL 2026-04-30. Node 22 är aktivt LTS. Docker base: `node:22-alpine`. |
| Next.js | 15.1.8 | Senaste stabila 15.x. App Router, native MDX-stöd via `@next/mdx`. |
| TypeScript | 5.x (`^5.8`) | Strict-läge, `moduleResolution: bundler` för Next.js 15-kompatibilitet. |
| `@next/mdx` | 15.1.8 | Matchar Next.js-versionen exakt. Hanterar `.mdx`-filer som sidor och importer. |
| `rehype-pretty-code` | `^0.14` | Syntax-highlighting med Shiki. Konfigureras som rehype-plugin i `next.config.mjs`. |
| Shiki | `^3.0` | Peer dependency till `rehype-pretty-code`. |
| `remark-gfm` | `^4.0` | GitHub Flavored Markdown i MDX (tabeller, strikethrough, task lists). |
| `next/font` | ingår i Next.js | Self-hosted Google Fonts, noll layout shift, ingen extern DNS-request vid rendering. |
| Resend SDK | `^4.0` (`resend` npm) | Transaktionsmejl (corrections-notiser, framtida newsletter). Daniel har API-nyckeln. |
| Drizzle ORM | `^0.44` | TypeScript-first ORM. Används med `postgres` (porsager) som driver. |
| `postgres` (porsager) | `^3.4` | Lättviktig PostgreSQL-driver. Ingen extra ORM-abstraktion behövs. |
| drizzle-kit | `^0.31` | CLI för schema-migration och Drizzle Studio. |
| BetterAuth | 1.3.x | Dokumenterat, installeras inte ännu. Läggs till när auth-flöde behövs. |
| Docker base | `node:22-alpine` | Minimal yta, matchar Node-versionen. Multi-stage build för liten produktions-image. |

## Dokumentationskällor (Context7, verifierat 2026-04-15)

- Next.js 15.1.8 MDX-konfiguration: `/vercel/next.js/v15.1.8` via Context7
- Drizzle ORM postgres-setup: `/drizzle-team/drizzle-orm-docs` via Context7
- `next.config.mjs` `output: 'standalone'` krävs för Docker multi-stage.
- `drizzle-kit` v0.31 använder `dialect: 'postgresql'` (inte `driver`-nyckeln från äldre versioner).
