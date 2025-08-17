import express from "express";
import dotenv from "dotenv";
import cors from "cors";        // ✅ importar cors
import tasksRouter from "./routes/tasks";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors());

// Rutas
app.use("/tasks", tasksRouter);

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
