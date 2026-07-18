import { describe, expect, it } from "vitest";
import { createTask } from "./createTask.js";

describe("createTask", () => {
  it("rejects an empty title", () => {
    const result = createTask({ title: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("TITLE_REQUIRED");
    }
  });

  it("rejects a title longer than 100 characters", () => {
    const result = createTask({ title: "a".repeat(101) });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("TITLE_TOO_LONG");
    }
  });

  it("creates a task with trimmed title", () => {
    const result = createTask({ title: "  Buy milk  " });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.task.title).toBe("Buy milk");
      expect(result.task.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    }
  });
});
