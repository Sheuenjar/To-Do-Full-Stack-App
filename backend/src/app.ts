import express from "express";
import tasksRouter from "./routes/tasks";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", tasksRouter);

export default app;