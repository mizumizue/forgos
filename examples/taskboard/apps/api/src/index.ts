import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { InMemoryTaskRepository } from "./taskRepository.js";

const app = createApp({ tasks: new InMemoryTaskRepository() });
const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, () => {
  console.log(`taskboard api listening on http://localhost:${port}`);
});
