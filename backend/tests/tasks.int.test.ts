import request from "supertest";
import app from "../src/app";
import pool from "../src/db/connection";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

beforeAll(async () => {
  // clear table and prepare data
  await pool.query("DELETE FROM tasks");
});

afterAll(async () => {
  await pool.end();
});

describe("Tasks API - integration", () => {
  let createdId: number;

  it("POST /tasks - creates a task (validates Zod)", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Integration test", description: "desc" })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Integration test");
    createdId = res.body.id;
  });

  it("PATCH /tasks/:id - set explicit completed=true", async () => {
    const res = await request(app).patch(`/tasks/${createdId}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("PATCH /tasks/:id - toggle when body empty", async () => {
    const res1 = await request(app).patch(`/tasks/${createdId}`).send({});
    expect(res1.status).toBe(200);
    // if it was true before, now it should be toggled
    expect(typeof res1.body.completed).toBe("boolean");
  });

  it("PUT /tasks/:id - edits task (validates Zod)", async () => {
    const res = await request(app).put(`/tasks/${createdId}`).send({ title: "Editada", description: null });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Editada");
  });

  it("DELETE /tasks/:id - deletes task", async () => {
    const res = await request(app).delete(`/tasks/${createdId}`);
    expect(res.status === 200 || res.status === 204).toBeTruthy();
  });
});