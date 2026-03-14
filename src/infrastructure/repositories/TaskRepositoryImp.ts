import { Task } from "../../domain/entities/Tasks";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";

export class TaskRepositoryImp implements TaskRepository {
    private readonly KEY = "tasks";

    findAll(): Task[] {
        const data = localStorage.getItem(this.KEY);
        if (!data) return [];

        const parsed = JSON.parse(data) as { id: string; title: string }[];
        return parsed.map((t) => Task.reconstitute(t.id, t.title));
    }

    save(tasks: Task[]): void {
        localStorage.setItem(this.KEY, JSON.stringify(tasks));
    }

    delete(taskId: string): void {
        const tasks = this.findAll();
        const updatedTasks = tasks.filter((t) => t.id !== taskId);
        this.save(updatedTasks);
    }


}