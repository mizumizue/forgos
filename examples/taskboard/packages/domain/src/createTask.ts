export type Task = {
  id: string;
  title: string;
};

export type CreateTaskInput = {
  title: string;
};

export type CreateTaskError = "TITLE_REQUIRED" | "TITLE_TOO_LONG";

export type CreateTaskResult =
  | { ok: true; task: Task }
  | { ok: false; error: CreateTaskError };

const MAX_TITLE_LENGTH = 100;

export function createTask(input: CreateTaskInput): CreateTaskResult {
  const title = input.title.trim();
  if (title.length === 0) {
    return { ok: false, error: "TITLE_REQUIRED" };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { ok: false, error: "TITLE_TOO_LONG" };
  }
  return {
    ok: true,
    task: {
      id: crypto.randomUUID(),
      title,
    },
  };
}
