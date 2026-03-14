// application/usePomodoro.ts
import { useState, useEffect } from "react";
import { Pomodoro } from "../domain/entities/Pomodoro";

export function usePomodoro() {
    const [pomodoro, setPomodoro] = useState<Pomodoro>(() => Pomodoro.create());

    useEffect(() => {
        if (!pomodoro.isActive) return;

        const id = window.setInterval(() => {
            setPomodoro((p: Pomodoro) => p.tick());
        }, 1000);

        return () => clearInterval(id);
    }, [pomodoro.isActive]);

    return {
        mode:            pomodoro.mode,
        timeLeft:        pomodoro.timeLeft,
        duration:        pomodoro.duration,
        isActive:        pomodoro.isActive,
        completedCycles: pomodoro.completedCycles,
        start:  () => setPomodoro((p: Pomodoro) => p.start()),
        pause:  () => setPomodoro((p: Pomodoro) => p.pause()),
        reset:  () => setPomodoro((p: Pomodoro) => p.reset()),
    };
}