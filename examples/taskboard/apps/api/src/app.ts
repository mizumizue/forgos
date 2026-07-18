import { createTask, type Task } from "@taskboard/domain";
import { Hono } from "hono";
import type { TaskRepository } from "./taskRepository.js";

export type AppDeps = {
  tasks: TaskRepository;
};

export function createApp(deps: AppDeps) {
  const app = new Hono();

  app.get("/health", (c) => c.json({ ok: true }));

  app.post("/tasks", async (c) => {
    const body = (await c.req.json().catch(() => null)) as { title?: string } | null;
    const result = createTask({ title: body?.title ?? "" });
    if (!result.ok) {
      return c.json({ error: result.error }, 400);
    }
    const saved = await deps.tasks.save(result.task);
    return c.json(saved, 201);
  });

  app.get("/tasks", async (c) => {
    const tasks: Task[] = await deps.tasks.list();
    return c.json(tasks);
  });

  return app;
}
