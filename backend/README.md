# Backend

## Backend

- Main entry: server.js
- Start server: npm start
- Dev mode: npm run dev
- Mock backend (deprecated): mock_index.js


Prerequisites: Node.js (16+), npm, Docker (for database)

Install dependencies and run:

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

Update `DATABASE_URL` in `.env` if needed.


