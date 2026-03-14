import {Timer} from "./presentation/features/pomodoro/Timer";
import {TaskList} from "./presentation/features/tasks/TaskList";
import {TaskRepositoryImp} from "./infrastructure/repositories/TaskRepositoryImp";
import type { TaskRepository } from './domain/repositories/TaskRepository';

const TaskRepository = new TaskRepositoryImp();

export default function App() {
    return (
        <div
            className="bg-background min-h-screen w-screen text-foreground flex p-8 gap-8 transition-colors duration-300">
            {/* Lado Esquerdo: Pomodoro Timer */}
            <main className="flex-[2] bg-card text-card-foreground rounded-xl border border-border p-8 shadow-lg">
                <Timer/>
            </main>

            {/* Lado Direito: Todo List */}
            <aside
                className="flex-[1] bg-card text-card-foreground rounded-xl border border-border p-6 shadow-lg flex flex-col">
                <h2 className="text-xl font-bold mb-4">Fila de Tarefas</h2>
                <TaskList repository={TaskRepository}/>
            </aside>
        </div>
    );
}