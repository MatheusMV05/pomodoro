import { useEffect, useRef } from "react";
import {usePomodoro} from "@/application/usePomodoro";
import { ArcProgress } from "@/presentation/components/ui/arc-progress";
import {Button} from "@/presentation/components/ui/button";
import { useNotification } from "@/presentation/features/notification/notification";

const TRANSITION_MESSAGES = {
    shortBreak: { title: "Hora da pausa curta!", body: "Bom trabalho! Descanse por 5 minutos." },
    longBreak:  { title: "Hora da pausa longa!", body: "Incrível! 4 ciclos completos. Descanse por 15 minutos." },
    focus:      { title: "Hora de focar!",        body: "Pausa concluída. Vamos nessa!" },
} as const;

export function Timer() {
    const {mode, timeLeft, duration, isActive, start, pause, reset} = usePomodoro();
    const { notify } = useNotification();
    const prevModeRef = useRef(mode);

    useEffect(() => {
        if (prevModeRef.current === mode) return;
        const { title, body } = TRANSITION_MESSAGES[mode];
        notify(title, { body });
        prevModeRef.current = mode;
    }, [mode, notify]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold mb-8 text-muted-foreground uppercase tracking-widest">
                {{ focus: 'Foco', shortBreak: 'Pausa Curta', longBreak: 'Pausa Longa' }[mode]}
            </h2>

            <div className="relative flex items-center justify-center mb-12">
                <ArcProgress value={(timeLeft / duration) * 100} size={280} />
                <span className="absolute text-6xl font-mono font-bold tabular-nums">
                    {formattedTime}
                </span>
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