import type { Task } from "@taskboard/domain";

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  list(): Promise<Task[]>;
}

export class InMemoryTaskRepository implements TaskRepository {
  private readonly items: Task[] = [];

  async save(task: Task): Promise<Task> {
    this.items.push(task);
    return task;
  }

  async list(): Promise<Task[]> {
    return [...this.items];
  }
}
