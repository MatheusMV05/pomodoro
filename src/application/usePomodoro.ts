// application/usePomodoro.ts
import { useState, useEffect, useRef } from "react";
import { Pomodoro } from "../domain/entities/Pomodoro";
import type { TimerSettings } from "./useSettings";

function toSeconds(s: TimerSettings) {
    return {
        focusSeconds:      s.focusMinutes * 60,
        shortBreakSeconds: s.shortBreakMinutes * 60,
        longBreakSeconds:  s.longBreakMinutes * 60,
    };
}

export function usePomodoro(settings: TimerSettings, onFocusComplete?: (durationSeconds: number) => void) {
    const [pomodoro, setPomodoro] = useState<Pomodoro>(() => Pomodoro.create(toSeconds(settings)));

    const prevCyclesRef  = useRef(pomodoro.completedCycles);
    const settingsRef    = useRef(settings);
    const onCompleteRef  = useRef(onFocusComplete);
    onCompleteRef.current = onFocusComplete;

    useEffect(() => {
        if (!pomodoro.isActive) return;
        const id = window.setInterval(() => {
            setPomodoro((p: Pomodoro) => p.tick());
        }, 1000);
        return () => clearInterval(id);
    }, [pomodoro.isActive]);

    // Detect focus session completion (completedCycles increased)
    useEffect(() => {
        if (pomodoro.completedCycles > prevCyclesRef.current) {
            onCompleteRef.current?.(pomodoro.settings.focusSeconds);
        }
        prevCyclesRef.current = pomodoro.completedCycles;
    }, [pomodoro.completedCycles, pomodoro.settings.focusSeconds]);

    // Reset when settings change
    useEffect(() => {
        if (JSON.stringify(settingsRef.current) !== JSON.stringify(settings)) {
            settingsRef.current = settings;
            setPomodoro(Pomodoro.create(toSeconds(settings)));
        }
    }, [settings]);

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
