# Backend — To-Do API (Node.js + TypeScript)

This folder contains the API server implemented with Express and TypeScript. It talks to a PostgreSQL database.

Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

Environment
Copy the example env file and edit the values for your database:

- Rename/copy:
  - Windows (PowerShell): copy .env.example .env
  - macOS/Linux: cp .env.example .env

- The example `.env.example` contains these variables (adjust as needed):

```
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3000
```

NOTE: `DB_PORT` in the example is set to `3000` but typical PostgreSQL uses `5432` — set `DB_PORT=5432` unless you intentionally run Postgres on a different port.

Database setup
1. Create the database using your Postgres admin (psql, pgAdmin, etc.).
2. Run the SQL schema and seed data:

```
psql -U <db_user> -d <db_name> -f ../database/schema.sql
```

Development
1. Install deps and start in watch mode (PowerShell):

```
cd backend
npm install
npm run dev
```

The dev script uses `nodemon` + `ts-node` and will restart on TypeScript source changes. The server listens on the `PORT` in `.env` (default 3000) and exposes routes under `/tasks` (e.g. http://localhost:3000/tasks).

Migrations & Seeding
- There is a convenience script `npm run migrate` that runs small migration/seed scripts:

```
npm run migrate
```

Tests
- Run the backend tests (uses vitest):

```
npm test
```

Build & Production
1. Build TypeScript to JS:

```
npm run build
```

2. Start the built app with Node.js (example):

```
node dist/index.js
```

API reference
- OpenAPI spec: `openapi.yaml`
- Tasks endpoints are under `/tasks`. The frontend uses a proxy and calls `/api/tasks` which rewrites to the backend.

Troubleshooting
- If you see connection errors, confirm `.env` values and that Postgres is listening on the host/port.
- Check logs: the backend prints `Using env:` from `src/env.ts` and will log the listen port at startup.
