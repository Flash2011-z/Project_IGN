# Project_IGN

Project_IGN is a full-stack game platform with:
- React + Vite frontend
- Node.js + Express backend
- PostgreSQL database (Docker)

## Quick Start

1. Start database

```powershell
cd database
docker-compose up -d
```

2. Configure backend

```powershell
cd ..\backend
Copy-Item .env.example .env
```

3. Install dependencies and run backend

```powershell
cd ..\backend
npm install
npm run dev
```

4. Install dependencies and run frontend

```powershell
cd ..\frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

Backend URL: `http://localhost:4000`

## Admin Setup

Set admin emails in `backend/.env`:

```env
ADMIN_EMAILS=you@example.com
```

If the email already exists in `user_account`, restart backend and that account becomes admin automatically.

## Important Notes

- Database init scripts run only when the DB volume is created for the first time.
- If you changed SQL and want a fresh DB, run:

```powershell
cd database
docker-compose down -v
docker-compose up -d
```