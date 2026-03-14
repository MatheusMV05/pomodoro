import {usePomodoro} from "@/application/usePomodoro";
import { Pomodoro } from "@/domain/entities/Pomodoro";
import {Button} from "@/presentation/components/ui/button";

export function Timer() {
    const {mode, timeLeft, isActive, completedCycles, start, pause, reset} = usePomodoro();

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold mb-8 text-muted-foreground uppercase tracking-widest">
                {mode === 'focus' ? 'Foco' : 'Pausa'}
            </h2>

            <div className="text-9xl font-bold font-mono mb-12 tabular-nums">
                {formattedTime}
            </div>

            <div className="flex gap-4">
                <Button size="lg" onClick={isActive ? pause : start} variant={isActive ? "secondary" : "default"}>
                    {isActive ? "Pausar" : "Iniciar"}
                </Button>
                <Button
                    size="lg"
                    onClick={reset}
                    variant="outline"
                >
                    Resetar
                </Button>
            </div>
        </div>
    );
}