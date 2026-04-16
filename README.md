# Patch Window

Tech-journalistik av Daniel Holm. Publiceras på `patchwindow.serverdigital.net`.

Stack: Next.js 15, TypeScript 5, MDX, Drizzle ORM + PostgreSQL, Resend.

## Lokal dev

Förutsättningar: Node 22 LTS, en PostgreSQL-instans.

```bash
# 1. Klona och installera
npm install

# 2. Kopiera och fyll i env-variabler
cp .env.example .env.local
# Redigera .env.local: sätt DATABASE_URL och RESEND_API_KEY

# 3. Kör migrationer
npm run db:migrate

# 4. Starta dev-servern
npm run dev
```

Appen startar på `http://localhost:3000`.

## Miljövariabler

Se `.env.example` för alla variabler med kommentarer. Alla variabler utan default-värde är obligatoriska. Appen kastar ett fel vid start om de saknas.

| Variabel | Krav | Beskrivning |
|---|---|---|
| `DATABASE_URL` | Obligatorisk | PostgreSQL-DSN |
| `RESEND_API_KEY` | Obligatorisk i prod | Resend API-nyckel för mejl |

## Innehåll

MDX-artiklar ligger i `content/articles/`. Pathways i `content/pathways/`.

Filnamnet blir slug: `content/articles/mitt-amne.mdx` ger URL `/hot-take/mitt-amne` (eller `/deep-dive/`, `/brief/` beroende på format).

Se `docs/GETTING-STARTED.md` för hur du skriver och publicerar artiklar.

## Deploy

Se `docs/DEPLOYMENT.md` for att förstå hela deploy-flödet.

Kortversion: push till `main` triggar GitHub Actions som bygger och deployer till Hetzner via SSH.

## Databasschema

Hanteras med Drizzle ORM. Schema i `lib/db/schema.ts`.

```bash
# Generera migrationsfil efter schema-ändring
npm run db:generate

# Kör migrationer mot databasen
npm run db:migrate

# Starta Drizzle Studio (lokal DB-UI)
npm run db:studio
```

## Troubleshooting

**Build misslyckas med "Cannot find module"**
Kör `npm install` och försök igen. Kontrollera att Node-versionen är 22.

**`DATABASE_URL is not set`**
Kopiera `.env.example` till `.env.local` och fyll i rätt DSN.

**`RESEND_API_KEY is not set`**
Sätt nyckeln i `.env.local` lokalt, eller som GitHub Secret (`RESEND_API_KEY`) i produktion.

**MDX-sidor syns inte**
Kontrollera att filen slutar på `.mdx` och ligger i rätt katalog under `content/`.
