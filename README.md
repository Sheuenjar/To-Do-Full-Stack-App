# To-Do Full Stack App
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)
![Pinia](https://img.shields.io/badge/Pinia-State-yellowgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)


## Description
Full Stack To-Do List application built with Vue.js + Pinia (TypeScript) on the frontend, Node.js + Express (TypeScript) on the backend, and PostgreSQL as the database. Features include adding, editing, deleting, and completing tasks.
 

## Technologies
- **Frontend:** Vue.js, Pinia, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL


## Features
- Add tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed


## Project Structure
/frontend → Vue.js + Pinia application
/backend → Node.js + Express API
/database → SQL scripts for PostgreSQL


## Getting Started
1. Database
- Create a PostgreSQL DB and run the script:
  psql -U your_db_user -d your_db_name -f database/schema.sql

2. Backend
- Change to the backend folder:
  cd backend
- Copy the example env file:
  cp .env.example .env
  (edit `.env` with your credentials)
- Install dependencies and run in dev mode:
  npm install
  npm run dev
- API available at http://localhost:3000/tasks

3. Frontend
- Change to the frontend folder:
  cd frontend
- Install and run:
  npm install
  npm run dev
- The frontend uses the `/api` proxy to `http://localhost:3000` defined in [frontend/vite.config.ts](frontend/vite.config.ts)


## API - Examples PATCH /tasks/:id

The PATCH /api/tasks/:id endpoint accepts an optional body `{ "completed": boolean }`:
- Sending `{ "completed": true }` or `{ "completed": false }` sets that value (idempotent).
- If the `completed` field is omitted (empty body) the backend will toggle the current value (legacy behavior).

Examples:

- Toggle (no body):
  curl -X PATCH http://localhost:3000/tasks/3 -H "Content-Type: application/json" -d "{}"

- Set explicitly:
  curl -X PATCH http://localhost:3000/tasks/3 -H "Content-Type: application/json" -d '{"completed": true}'

The OpenAPI spec is at `backend/openapi.yaml`


## License
MIT License