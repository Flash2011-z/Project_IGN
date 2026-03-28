# Database

Start Postgres (requires Docker):

```powershell
cd database
docker-compose up -d
```

The compose file exposes Postgres on port `5432` and runs full schema/seed initialization on first startup.

If you need a clean re-import of all SQL files:

```powershell
cd database
docker-compose down -v
docker-compose up -d
```
