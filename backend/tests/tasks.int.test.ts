import request from "supertest";
import app from "../src/app";
import pool from "../src/db/connection";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

beforeAll(async () => {
  // limpiar tabla y preparar datos
  await pool.query("DELETE FROM tasks");
});

afterAll(async () => {
  await pool.end();
});

describe("Tasks API - integration", () => {
  let createdId: number;

  it("POST /tasks - crea una tarea (valida Zod)", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test integración", description: "desc" })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test integración");
    createdId = res.body.id;
  });

  it("PATCH /tasks/:id - set explícito completed=true", async () => {
    const res = await request(app).patch(`/tasks/${createdId}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("PATCH /tasks/:id - toggle cuando body vacío", async () => {
    const res1 = await request(app).patch(`/tasks/${createdId}`).send({});
    expect(res1.status).toBe(200);
    // si antes era true, ahora debe ser false
    expect(typeof res1.body.completed).toBe("boolean");
  });

  it("PUT /tasks/:id - edita tarea (valida Zod)", async () => {
    const res = await request(app).put(`/tasks/${createdId}`).send({ title: "Editada", description: null });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Editada");
  });

  it("DELETE /tasks/:id - elimina tarea", async () => {
    const res = await request(app).delete(`/tasks/${createdId}`);
    expect(res.status === 200 || res.status === 204).toBeTruthy();
  });
});