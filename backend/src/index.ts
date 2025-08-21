import express from "express";
import dotenv from "dotenv";
import cors from "cors";        // ✅ import CORS
import tasksRouter from "./routes/tasks";
import app from "./app";        // ✅ import app

dotenv.config();

const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Routes
app.use("/tasks", tasksRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
