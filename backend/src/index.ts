import express from "express";
import dotenv from "dotenv";
import cors from "cors";        // ✅ importar cors
import tasksRouter from "./routes/tasks";
import app from "./app";        // ✅ importar app


dotenv.config();

const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors());

// Rutas
app.use("/tasks", tasksRouter);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;

