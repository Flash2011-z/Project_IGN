# Database

Start Postgres (requires Docker):

```powershell
cd database
docker-compose up -d
```

The compose file exposes Postgres on port `5432` and runs `init.sql` on first startup.
