# Deployment

Deploys bygger Docker-imagen direkt på servern. Ingen CI/CD, ingen container registry.

## Hur en deploy fungerar

Skriptet `scripts/deploy-patchwindow.sh` i `hetzner-project` kör på servern och gör följande i ordning:

1. Validerar att `PATCHWINDOW_DB_PASSWORD` och `PATCHWINDOW_RESEND_API_KEY` finns
2. Skapar PostgreSQL-användare och databas om de saknas (idempotent)
3. Kör `git pull` i `~/server/sites/patchwindow/`
4. Bygger Docker-imagen lokalt (`patchwindow:local`) via `docker compose build`
5. Kör Drizzle-migrationer i en tillfällig container
6. Startar containern med `docker compose up -d patchwindow`
7. Pollar `http://127.0.0.1:3000/health` tills `{"status":"ok"}` returneras

## Deploya

```bash
ssh deploy@37.27.107.71 -i d:/hetzner-project/.ssh/id_ed25519_hetzner
cd ~/server
bash scripts/deploy-patchwindow.sh
```

Eller kör skriptet direkt från lokalt via SSH:

```bash
ssh deploy@37.27.107.71 -i d:/hetzner-project/.ssh/id_ed25519_hetzner \
  "cd ~/server && bash scripts/deploy-patchwindow.sh"
```

## Miljövariabler

Filen `~/server/.env` på servern. Skriptet läser den automatiskt.

| Variabel | Krav | Beskrivning |
|---|---|---|
| `PATCHWINDOW_DB_PASSWORD` | Obligatorisk | Lösenord till PostgreSQL-användaren `patchwindow` |
| `PATCHWINDOW_RESEND_API_KEY` | Obligatorisk | Resend API-nyckel |
| `PATCHWINDOW_DATABASE_URL` | Valfri | Byggs av skriptet om den saknas |

## Första deployment

Källkoden måste finnas på servern innan skriptet kan köras.

```bash
ssh deploy@37.27.107.71 -i d:/hetzner-project/.ssh/id_ed25519_hetzner

# Klona repot
mkdir -p ~/server/sites
git clone https://github.com/Labontese/patch-window.git ~/server/sites/patchwindow

# Skapa .env om den saknas
nano ~/server/.env
# Lägg till PATCHWINDOW_DB_PASSWORD och PATCHWINDOW_RESEND_API_KEY

# Kör deploy
bash ~/server/scripts/deploy-patchwindow.sh
```

## Rollback

Ta reda på vilket commit du vill gå tillbaka till:

```bash
git -C ~/server/sites/patchwindow log --oneline -10
```

Checka ut den commit:

```bash
git -C ~/server/sites/patchwindow checkout <sha>
```

Kör deploy-skriptet igen:

```bash
bash ~/server/scripts/deploy-patchwindow.sh
```

## Kända begränsningar

- **Ingen zero-downtime.** Containern startar om under deploy. Sajten returnerar 502 i ~10-20 sekunder.
- **Byggtid.** `docker compose build` körs på servern vid varje deploy. Tar 1-3 minuter beroende på ändringar.
- **Manuell deploy.** Det finns inget som triggar deploy automatiskt vid push till `main`.
