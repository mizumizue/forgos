import { FormEvent, useEffect, useState } from "react";

type Task = { id: string; title: string };

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/tasks");
    setTasks(await res.json());
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "FAILED");
      return;
    }
    setTitle("");
    await refresh();
  }

  return (
    <main>
      <h1>Taskboard</h1>
      <form onSubmit={onSubmit}>
        <input
          aria-label="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <button type="submit">Add</button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </main>
  );
}
