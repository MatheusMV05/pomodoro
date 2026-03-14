import {useState} from "react";
import {Task} from "../domain/entities/Tasks.ts";
import type {TaskRepository} from "../domain/repositories/TaskRepository.ts";

export function useTasks(repository: TaskRepository) {
    const [tasks, setTasks] = useState<Task[]>(() => repository.findAll());

    // A tarefa atual é sempre a primeira da fila (índice 0)
    const currentTask = tasks.length > 0 ? tasks[0] : null;

    // Função para adicionar (entra no final da fila)
    const addTask = (title: string) => {
        const newTask = Task.create(title);
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        repository.save(updatedTasks);
    };

    // Função para concluir a tarefa atual
    const completeCurrentTask = () => {
        const updated = tasks.slice(1); // Remove a primeira tarefa
        setTasks(updated);
        repository.save(updated);
    };

    return {
        tasks,
        currentTask,
        addTask,
        completeCurrentTask,
    };
}