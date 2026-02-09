# Project_IGN

Monorepo with `frontend`, `backend`, and `database` folders.

Quick start:

1. Start database:

```powershell
cd database
docker-compose up -d
```

2. Start backend:

```powershell
cd backend
npm install
npm run env:copy  # or use one of the commands below depending on your shell

# Windows PowerShell
Copy-Item .env.example .env

# Windows CMD
copy .env.example .env

Alternatively on Unix/macOS:
cp .env.example .env
npm run dev
```

3. Initialize the frontend (see `frontend/README.md`).
