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
1. Base de datos
- Crear BD PostgreSQL y ejecutar el script:
  psql -U your_db_user -d your_db_name -f database/schema.sql

2. Backend
- Ir a la carpeta backend:
  cd backend
- Copiar el ejemplo de variables:
  cp .env.example .env
  (editar `.env` con tus credenciales)
- Instalar dependencias y levantar en modo dev:
  npm install
  npm run dev
- API disponible en http://localhost:3000/tasks

3. Frontend
- Ir a la carpeta frontend:
  cd frontend
- Instalar y levantar:
  npm install
  npm run dev
- El frontend usa el proxy `/api` hacia `http://localhost:3000` definido en [frontend/vite.config.ts](frontend/vite.config.ts)


## API - Ejemplos PATCH /tasks/:id

El endpoint PATCH /api/tasks/:id acepta un body opcional `{ "completed": boolean }`:
- Si envías `{ "completed": true }` o `{ "completed": false }` se establece ese valor (idempotente).
- Si no envías el campo `completed` (body vacío) el backend hará toggle del valor actual (comportamiento legacy).

Ejemplos:

- Toggle (sin body):
  curl -X PATCH http://localhost:3000/tasks/3 -H "Content-Type: application/json" -d "{}"

- Set explícito:
  curl -X PATCH http://localhost:3000/tasks/3 -H "Content-Type: application/json" -d '{"completed": true}'

La especificación OpenAPI está en `backend/openapi.yaml`


## License
MIT License