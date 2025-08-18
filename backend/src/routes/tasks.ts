import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController";

const router = Router();

// GET /tasks
router.get("/", getAllTasks);

// POST /tasks
router.post("/", createTask);

// PUT /tasks/:id
router.put("/:id", updateTask);

// DELETE /tasks/:id
router.delete("/:id", deleteTask);

// PATCH /tasks/:id
router.patch("/:id", toggleTask);

export default router;