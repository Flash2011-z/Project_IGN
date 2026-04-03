# Project IGN

Project IGN is a premium full-stack game intelligence platform where discovery, community, and commerce converge in one seamless experience.
From high-trust weighted reviews and player verification to wishlist, cart, checkout, and admin moderation, it is engineered as a complete production-style ecosystem, not just a demo app.

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express, JWT auth
- Database: PostgreSQL
- Styling: Custom CSS

## Repository Structure

- frontend: React application
- backend: Express API and auth/business logic
- database: schema, seed, functions, triggers, and docker-compose for Postgres

## Main Features

- User authentication (register/login/me)
- Games listing and game details
- Review system with comments and likes
- Player/Admin/Purchased review badges
- Weighted review scoring logic
- Wishlist and cart flow
- Checkout and order history
- Admin dashboard
- Admin game create/edit/delete
- Admin player badge assign/remove

## System Architecture

Project IGN follows a three-layer architecture:

- Presentation Layer: React pages and reusable UI components in frontend
- Application Layer: Express route handlers and business rules in backend
- Data Layer: PostgreSQL schema, SQL functions, and triggers in database

Core runtime flow:

1. Frontend sends HTTP requests to backend
2. Backend validates auth and role access using JWT
3. Backend runs SQL queries/functions against Postgres
4. Backend returns normalized JSON payloads to frontend
5. Frontend updates UI state and renders user/admin views

## Core Domains

### 1. Auth and Roles

- Registration and login issue JWT tokens
- Role is stored on user records
- Admin role powers protected admin endpoints

### 2. Games and Discovery

- Game list, game detail, hero and featured sections
- Metadata includes genre, platform, publisher, cover, and score

### 3. Reviews and Community

- Users can create, edit, and delete reviews
- Users can like reviews and comment on reviews
- Badges include Admin, Player, and Purchased context

### 4. Commerce

- Wishlist and cart utilities
- Checkout workflow and persisted orders
- Order history for authenticated users

### 5. Admin Operations

- Dashboard overview stats
- Manage games and user-generated content
- Mark or remove player badges for users per game

## Weighted Rating Logic

The project uses weighted review scoring:

- Admin reviews: 1.5x weight
- Player-badged reviews: 1.5x weight
- Standard reviews: 1.0x weight

Implementation is done in SQL functions and triggers so scores remain consistent across list/detail/admin views.

## Data Model Highlights

Important entities:

- user_account: user identity, profile, role
- game: game catalog records and aggregated score
- user_review: user scores and review text
- user_game_player_badge: player badge relationship per user/game
- customer_order and order_item: checkout and purchase history

## API Surface Overview

The backend includes route groups for:

- auth: register, login, me
- games: list, details, reviews, comments
- home: hero, featured, latest reviews
- wishlist and cart
- orders and checkout
- admin: overview, games management, player badges

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+ running locally

Optional:
- Docker Desktop (if you want to start Postgres via docker-compose)

## Environment Setup

1. Backend environment file:

	Copy backend/.env.example to backend/.env and update values.

2. Required backend variables:

- PORT: API port (default 4000)
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- JWT_SECRET
- ADMIN_EMAILS (comma-separated admin emails)

Example:

PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=project_ign
JWT_SECRET=change_me
ADMIN_EMAILS=admin@example.com

## Database Setup

You can use either local Postgres or Docker Postgres.

### Option A: Local Postgres (recommended for quick dev)

1. Create database:

	CREATE DATABASE project_ign;

2. Run SQL files from database folder in this order:

- gamezone_schema.sql
- gamezone_seed.sql
- functions_Procedures.sql
- Triggers.sql

3. If you use weighted review scoring updates, make sure functions_Procedures.sql and Triggers.sql are applied again after changes.

### Option B: Docker Postgres

cd database
docker-compose up -d

Note: initialization scripts run when volume is first created.

## Run the Project

Open two terminals from project root.

Terminal 1 (backend):

cd backend
npm install
npm run dev

Terminal 2 (frontend):

cd frontend
npm install
npm run dev

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## NPM Scripts

Frontend (frontend/package.json):

- npm run dev: start Vite dev server
- npm run build: production build
- npm run lint: lint checks
- npm run preview: preview production build

Backend (backend/package.json):

- npm run dev: start API with nodemon
- npm start: start API with node

## Admin Access

Users whose emails are listed in ADMIN_EMAILS are promoted to admin role at backend startup.

If you change ADMIN_EMAILS, restart backend.

## Common Troubleshooting

1. Frontend cannot fetch API
- Check backend is running on port 4000.
- Confirm frontend uses http://localhost:4000.

2. 401 or 403 on admin routes
- Login with an email present in ADMIN_EMAILS.
- Restart backend after changing ADMIN_EMAILS.

3. SQL-related endpoint errors
- Confirm schema and functions/triggers were applied to the same database set in backend .env.

4. Stale data after SQL updates
- Re-apply updated SQL files.
- Restart backend.

## Notes

- This repository contains module-level READMEs in frontend, backend, and database for focused details.
- Root README is the main onboarding guide.