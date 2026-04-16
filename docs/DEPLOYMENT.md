# Deployment

Första gången du deployer Patch Window till Hetzner behöver du göra några manuella steg.

## Vad som sker automatiskt

Push till `main` triggar `.github/workflows/deploy.yml` som:

1. Installerar beroenden och bygger Next.js
2. Kopierar källkod till Hetzner-servern via SSH
3. Kör `docker compose up -d --build --force-recreate patchwindow` på servern

## Manuella steg (en gång)

### 1. PostgreSQL-databasen

Kör `scripts/init-postgres-dbs.sh` på servern om du inte redan gjort det, eller lägg till dessa rader i skriptet och kör om det:

```sql
CREATE USER patchwindow WITH PASSWORD 'dittlosenord';
CREATE DATABASE patchwindow OWNER patchwindow;
GRANT ALL PRIVILEGES ON DATABASE patchwindow TO patchwindow;
```

Skriptet finns i `d:\hetzner-project\scripts\init-postgres-dbs.sh` och körs automatiskt vid första PostgreSQL-start. Om PostgreSQL redan körs: kör SQL direkt via Adminer (`db.serverdigital.net`) eller psql.

### 2. GitHub Secrets

Gå till ditt patchwindow-repo > Settings > Secrets and variables > Actions > New repository secret.

Lägg till:

| Secret | Värde |
|---|---|
| `DEPLOY_HOST` | IP-adressen till Hetzner-servern (samma som holmdigital använder) |
| `DEPLOY_SSH_KEY` | SSH-privatnyckeln för deploy-användaren (samma som holmdigital) |
| `RESEND_API_KEY` | Din Resend-nyckel (du har den redan) |
| `DATABASE_URL` | `postgresql://patchwindow:<pw>@postgres:5432/patchwindow` |

`DEPLOY_HOST` och `DEPLOY_SSH_KEY` är identiska med dem holmdigital.se använder. Du kan kopiera dem därifrån.

### 3. Docker Compose

Patch Window-servicen är redan tillagd i `d:\hetzner-project\docker-compose.yml`. Den kräver att `PATCHWINDOW_DATABASE_URL` är satt i `.env` på servern.

Lägg till i `.env` på servern:

```
PATCHWINDOW_DATABASE_URL=postgresql://patchwindow:dittlosenord@postgres:5432/patchwindow
PATCHWINDOW_RESEND_API_KEY=re_din_nyckel
```

### 4. DNS

Peka `patchwindow.serverdigital.net` mot serverns IP. Traefik hämtar Let's Encrypt-certifikatet automatiskt vid första request.

Verifiera:

```bash
dig A patchwindow.serverdigital.net
# Ska returnera serverns IP
```

### 5. Första deploy

Trigga manuellt från GitHub Actions > deploy.yml > "Run workflow", eller push en tom commit:

```bash
git commit --allow-empty -m "chore: trigger first deploy"
git push origin main
```

### 6. Verifiera

```bash
curl -sSfI https://patchwindow.serverdigital.net | head -1
# Ska ge: HTTP/2 200
```

Kolla också att security-headers är aktiva:

```bash
curl -sSI https://patchwindow.serverdigital.net | grep -i strict-transport
# Ska ge: strict-transport-security: max-age=31536000; includeSubDomains; preload
```

## Rollback

Om en deploy går fel: gå till GitHub Actions, klicka på en tidigare lyckad workflow-körning och tryck "Re-run jobs". Det återdeployer den versionen.

Eller på servern direkt:

```bash
cd ~/server
docker compose up -d --build --force-recreate patchwindow
# (efter att ha återställt källkod till känd god version)
```
