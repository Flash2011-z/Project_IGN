# Backend

## Run Backend

1. Copy environment file

```powershell
cd backend
Copy-Item .env.example .env
```

2. Install dependencies

```powershell
npm install
```

3. Start server

```powershell
npm run dev
```

Backend runs on `http://localhost:4000` by default.

## Environment Variables

`PORT`
: API port. Default is `4000`.

`DATABASE_URL`
: PostgreSQL connection string.

`JWT_SECRET`
: Secret used for JWT signing.

`ADMIN_EMAILS`
: Comma-separated admin emails (auto-promoted to admin role at startup).

Example:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project_ign
JWT_SECRET=super-secret-change-this
ADMIN_EMAILS=admin@example.com
```


