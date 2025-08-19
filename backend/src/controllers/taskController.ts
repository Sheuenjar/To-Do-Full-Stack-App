import { Request, Response } from "express";
import pool from "../db/connection";
import { z } from "zod";



// Schema Zod para crear / editar tarea
const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});



/**
 * GET /tasks
 */
export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    // Order by priority (high -> medium -> low) then by id
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo tareas" });
  }
};

/**
 * POST /tasks
 */
export const createTask = async (req: Request, res: Response) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Body inválido", details: parsed.error.issues });
  }
  const { title, description } = parsed.data;
  const priority = (parsed.data as any).priority ?? 'medium';

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3) RETURNING *",
      [title, description ?? null, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando tarea" });
  }
};

/**
 * PUT /tasks/:id
 */
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Body inválido", details: parsed.error.issues });
  }
  const { title, description } = parsed.data;
  const priority = (parsed.data as any).priority ?? 'medium';

  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4 RETURNING *",
      [title, description ?? null, priority, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error editando tarea" });
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
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json({ message: "Tarea eliminada", task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando tarea" });
  }
};

/**
 * PATCH /tasks/:id (marcar completada / toggle si quieres)
 */
export const toggleTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const bodySchema = z.object({
    completed: z.boolean().optional(),
  });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Body inválido", details: parsed.error.issues });
  }
  const { completed } = parsed.data;

  try {
    let result;
    if (typeof completed === "boolean") {
      result = await pool.query(
        "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
        [completed, id]
      );
    } else {
      result = await pool.query(
        "UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *",
        [id]
      );
    }

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando estado de la tarea" });
  }
};

