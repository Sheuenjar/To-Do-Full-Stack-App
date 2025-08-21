# Frontend — Vue 3 + TypeScript + Vite

This folder contains the client app built with Vue 3, Pinia and Vite. It talks to the backend via a Vite dev server proxy.

Prerequisites
- Node.js 18+ and npm

Development (local)
1. Install dependencies and start the dev server:

```
cd frontend
npm install
npm run dev
```

2. Open the printed dev URL (usually `http://localhost:5173`).

Notes about the backend API
- The frontend calls `/api/tasks` (see `src/services/tasksApi.ts`). Vite is configured to proxy `/api` to `http://localhost:3000` in `vite.config.ts`. Make sure the backend is running on port `3000` (or edit the proxy target).

Build & Preview (production-like)

```
cd frontend
npm run build
npm run preview
```

This produces a production build (`dist/`) that you can serve with any static file server.

Troubleshooting
- If the client cannot reach the API, verify the backend is running and that the proxy target in `vite.config.ts` matches the backend address.
- To call the backend directly (bypassing the dev proxy), update `src/services/tasksApi.ts` to point to the full backend URL (for example `http://localhost:3000/tasks`).
