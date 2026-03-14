import { Task } from "../entities/Tasks";

export interface TaskRepository {
    findAll(): Task[];
    save(tasks: Task[]): void;
    delete(taskId: string): void;
}