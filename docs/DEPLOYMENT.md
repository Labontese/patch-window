# Deployment

Deploy sker via GHCR (GitHub Container Registry). Du pushar kod, GitHub Actions bygger en Docker-image och pushar den till `ghcr.io/labontese/patch-window`. Watchtower på Karins server plockar upp den nya versionen nattetid.

## Flödet

1. Du pushar till `main` i `Labontese/patch-window`
2. GitHub Actions bygger imagen via multi-stage Dockerfile
3. Imagen pushas till GHCR med tre taggar: `latest`, kort SHA (`abc1234`), datum (`20260415`)
4. Watchtower kontrollerar GHCR kl 04:00 varje natt och startar om containern om en ny `latest` finns
5. Vid behov kan du tvinga fram en omedelbar uppdatering (se nedan)

## GitHub Actions-workflowet

Fil: `.github/workflows/deploy.yml`

Steget kräver inga manuellt satta secrets. `GITHUB_TOKEN` är automatiskt och räcker för att pusha till GHCR för ditt eget repo.

Workflowet kör ett smoke test efter bygget: startar containern lokalt i CI och väntar på att health checken slår grönt. Om den inte gör det inom 90 sekunder failar workflowet och imagen pushas inte.

## Secrets och miljövariabler

**Secrets som behövs i repot** (`Settings > Secrets and variables > Actions`):

Inga nya secrets behövs för själva image-pushen.

**Secrets som kan rensas** (användes av den gamla rsync-deployen):

| Secret | Status |
|---|---|
| `DEPLOY_HOST` | Kan tas bort |
| `DEPLOY_SSH_KEY` | Kan tas bort |

**Runtime-secrets på servern** (sätts i `.env` i hetzner-project, aldrig i imagen):

```
PATCHWINDOW_DATABASE_URL=postgresql://patchwindow:dittlosenord@postgres:5432/patchwindow
PATCHWINDOW_RESEND_API_KEY=re_din_nyckel
```

## Image-visibility

Repot `Labontese/patch-window` är public, vilket gör GHCR-imagen public by default efter första pushen. Karins server behöver inte autentisera mot GHCR för att pusha imagen.

Vill du göra imagen private: gå till `github.com/users/labontese/packages/container/patch-window/settings` och byt visibility till Private. Då måste du skapa en PAT med `read:packages`-scope och logga in på servern:

```bash
echo "$PAT" | docker login ghcr.io -u labontese --password-stdin
```

Watchtower läser credentials från `/root/.docker/config.json` automatiskt om den filen finns.

## Första deploy (manuell)

Watchtower hämtar bara uppdateringar till redan körande containers. Första gången måste du starta containern manuellt på servern:

```bash
cd ~/server
docker compose pull patchwindow
docker compose up -d patchwindow
```

Verifiera att den startade:

```bash
docker inspect --format='{{.State.Health.Status}}' patchwindow
# Ska ge: healthy (efter ~40 sekunder)

curl -sSfI https://patchwindow.serverdigital.net | head -1
# Ska ge: HTTP/2 200
```

## Tvinga fram omedelbar uppdatering

Watchtower uppdaterar kl 04:00 nattetid. Vill du deploya en ny image direkt:

```bash
cd ~/server
docker compose pull patchwindow && docker compose up -d patchwindow
```

## Manuella steg (en gång, gäller fortfarande)

### PostgreSQL-databasen

Om databasen inte redan finns, kör via Adminer (`db.serverdigital.net`) eller psql:

```sql
CREATE USER patchwindow WITH PASSWORD 'dittlosenord';
CREATE DATABASE patchwindow OWNER patchwindow;
GRANT ALL PRIVILEGES ON DATABASE patchwindow TO patchwindow;
```

### DNS

Peka `patchwindow.serverdigital.net` mot serverns IP. Traefik hämtar Let's Encrypt-certifikatet automatiskt.

```bash
dig A patchwindow.serverdigital.net
# Ska returnera 37.27.107.71
```

## Rollback

### Via GHCR-taggar

Varje deploy skapar en SHA-taggad image (`ghcr.io/labontese/patch-window:abc1234`). För att rulla tillbaka:

```bash
cd ~/server
# Byt till känd god SHA (hitta den i GitHub Actions-loggen eller GHCR)
docker pull ghcr.io/labontese/patch-window:abc1234
docker tag ghcr.io/labontese/patch-window:abc1234 ghcr.io/labontese/patch-window:latest
docker compose up -d patchwindow
```

### Via GitHub Actions

Gå till `Actions > Build and push image to GHCR`, klicka på en tidigare lyckad körning och tryck "Re-run jobs". Det bygger om och pushar den versionen som `latest`.

## Kända begränsningar

- **Watchtower-delay:** nya deploys syns i produktion senast kl 04:00 nästa dag, om du inte gör en manuell pull.
- **Cold start:** när Watchtower startar om containern med ny image är sajten nere i ~10-20 sekunder (health check-perioden). Traefik returnerar 502 under den tiden.
- **Databasmigrationer:** workflowet kör inga migrationer automatiskt. Om en deploy innehåller schema-ändringar: kör `npm run db:migrate` manuellt mot produktionsdatabasen innan eller efter deploy.
