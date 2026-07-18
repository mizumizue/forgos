import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { InMemoryTaskRepository } from "./taskRepository.js";

describe("POST /tasks", () => {
  it("returns 400 when title is missing", async () => {
    const app = createApp({ tasks: new InMemoryTaskRepository() });
    const res = await app.request("/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "  " }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 201 and the created task", async () => {
    const app = createApp({ tasks: new InMemoryTaskRepository() });
    const res = await app.request("/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Buy milk" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.title).toBe("Buy milk");
    expect(body.id).toEqual(expect.any(String));
  });
});

describe("GET /tasks", () => {
  it("returns created tasks", async () => {
    const app = createApp({ tasks: new InMemoryTaskRepository() });
    await app.request("/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Buy milk" }),
    });
    const res = await app.request("/tasks");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe("Buy milk");
  });
});
