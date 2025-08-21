import { Request, Response } from "express";
import pool from "../db/connection";
import { z } from "zod";



// Zod schema for creating / editing a task
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});



/**
 * GET /tasks
 */
export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    // Order by newest first (created_at desc), then id desc to be deterministic
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC, id DESC"
    );
    res.json(result.rows);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error fetching tasks" });
  }
};

/**
 * POST /tasks
 */
export const createTask = async (req: Request, res: Response) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.issues });
  }
  const { title, description } = parsed.data;
  const priority = (parsed.data as any).priority ?? 'medium';

  try {
    // Try inserting with priority (if DB has the column)
    const result = await pool.query(
      "INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3) RETURNING *",
      [title, description ?? null, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    // If the column 'priority' doesn't exist in this DB, fallback to insert without it
    if (err && err.code === '42703') {
      try {
        const result = await pool.query(
          "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
          [title, description ?? null]
        );
        res.status(201).json(result.rows[0]);
        return;
      } catch (err2) {
        console.error('Fallback insert failed', err2);
      }
    }
    res.status(500).json({ error: "Error creating task" });
  }
};

/**
 * PUT /tasks/:id
 */
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.issues });
  }
  const { title, description } = parsed.data;
  const priority = (parsed.data as any).priority ?? 'medium';

  try {
    // Try updating with priority (if DB has the column)
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4 RETURNING *",
      [title, description ?? null, priority, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
  console.error(err);
  // Fallback: if priority column missing, try update without it
  if (err && err.code === '42703') {
    try {
      const result = await pool.query(
        "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *",
        [title, description ?? null, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.json(result.rows[0]);
    } catch (err2) {
      console.error('Fallback update failed', err2);
    }
  }
  res.status(500).json({ error: "Error editing task" });
  }
};

/**
 * DELETE /tasks/:id
 */
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted", task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting task" });
  }
};

/**
 * PATCH /tasks/:id (mark completed / toggle if omitted)
 */
export const toggleTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const bodySchema = z.object({
    completed: z.boolean().optional(),
  });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid body", details: parsed.error.issues });
  }
  const { completed } = parsed.data;

  try {
    let result;
    if (typeof completed === "boolean") {
      // If DB has completed_at column, set or clear timestamp accordingly
      try {
        if (completed) {
          result = await pool.query(
            "UPDATE tasks SET completed = $1, completed_at = now() WHERE id = $2 RETURNING *",
            [completed, id]
          );
        } else {
          result = await pool.query(
            "UPDATE tasks SET completed = $1, completed_at = NULL WHERE id = $2 RETURNING *",
            [completed, id]
          );
        }
      } catch (err: any) {
        // If column doesn't exist, fall back to simple update
        if (err && err.code === '42703') {
          result = await pool.query(
            "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
            [completed, id]
          );
        } else {
          throw err
        }
      }
    } else {
      // Toggle: prefer to touch completed_at when toggling
      try {
        // First, fetch current value
        const cur = await pool.query('SELECT completed FROM tasks WHERE id = $1', [id]);
        if (!cur || cur.rows.length === 0) {
          return res.status(404).json({ error: "Task not found" });
        }
        const curCompleted = cur.rows[0].completed as boolean
        if (curCompleted) {
          // currently completed -> uncomplete
          result = await pool.query(
            "UPDATE tasks SET completed = FALSE, completed_at = NULL WHERE id = $1 RETURNING *",
            [id]
          );
        } else {
          // currently not completed -> mark completed with now()
          result = await pool.query(
            "UPDATE tasks SET completed = TRUE, completed_at = now() WHERE id = $1 RETURNING *",
            [id]
          );
        }
      } catch (err: any) {
        if (err && err.code === '42703') {
          // Column missing: fallback to simple toggle
          result = await pool.query(
            "UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *",
            [id]
          );
        } else {
          throw err
        }
      }
    }

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

  res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: "Error updating task status" });
  }
};

