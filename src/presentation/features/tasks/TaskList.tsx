import { useState } from "react";
import { useTasks } from "@/application/useTasks";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import type { TaskRepository } from "@/domain/repositories/TaskRepository";

interface Props {
    repository: TaskRepository;
}

export function TaskList({ repository } : Props) {
    const { tasks, currentTask, addTask, completeCurrentTask } = useTasks(repository);
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        addTask(inputValue);
        if (inputValue) {
            setInputValue("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-2 mb-6">
                <Input
                    placeholder="Adicionar nova tarefa..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button onClick={handleAdd}>Adicionar</Button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center mt-4">Nenhuma tarefa na fila</p>
                ) : (
                    tasks.map((task, index) => (
                        <Card key={task.id} className={index === 0 ? "border-primary" : "opacity-50"}>
                            <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
                                <CardTitle className="text-base font-medium">{task.title}</CardTitle>
                                {index === 0 && (
                                    <Button size="sm" onClick={completeCurrentTask}>Concluir</Button>
                                )}
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}