import { useEffect, useRef, type ReactNode } from "react";
import { usePomodoro } from "@/application/usePomodoro";
import { Button } from "@/presentation/components/ui/button";
import { ArcProgress } from "@/presentation/components/ui/arc-progress";
import { NowPlayingWidget } from "@/presentation/features/spotify/NowPlayingWidget";
import { useNotification } from "@/presentation/features/notification/notification";
import { cn } from "@/lib/utils";
import type { TimerSettings } from "@/application/useSettings";
import type { NowPlayingTrack } from "@/application/useNowPlaying";

const TRANSITION_MESSAGES = {
    shortBreak: { title: "Hora da pausa curta!", body: "Bom trabalho! Descanse um pouco." },
    longBreak:  { title: "Hora da pausa longa!", body: "Incrível! 4 ciclos completos. Você merece!" },
    focus:      { title: "Hora de focar!",        body: "Pausa concluída. Vamos nessa!" },
} as const;

const MODE_CONFIG = {
    focus:      { label: 'Foco',        color: 'text-primary',       dot: 'bg-primary' },
    shortBreak: { label: 'Pausa Curta', color: 'text-emerald-500',   dot: 'bg-emerald-500' },
    longBreak:  { label: 'Pausa Longa', color: 'text-blue-500',      dot: 'bg-blue-500' },
} as const;

const CYCLES_UNTIL_LONG = 4;

interface Props {
    settings: TimerSettings;
    onFocusComplete: (durationSeconds: number) => void;
    nowPlaying?: NowPlayingTrack | null;
    onToggle?: () => Promise<void>;
    onNext?:   () => Promise<void>;
    onPrev?:   () => Promise<void>;
}

type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

interface TomatoTimerProps {
    progress: number;
    isActive: boolean;
    mode: PomodoroMode;
    children: ReactNode;
}

function TomatoTimer({ progress, isActive, mode, children }: TomatoTimerProps) {
    return (
        <div className="relative flex items-center justify-center">
            <ArcProgress value={progress} size={260} strokeWidth={14} isActive={isActive} mode={mode} />
            <div className="absolute flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
}

export function Timer({ settings, onFocusComplete, nowPlaying, onToggle, onNext, onPrev }: Props) {
    const { mode, timeLeft, duration, isActive, completedCycles, start, pause, reset } = usePomodoro(settings, onFocusComplete);
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
    const progress = (timeLeft / duration) * 100;

    // Cycle indicators: how many focus sessions completed in the current "round" of 4
    const cyclesInRound = completedCycles % CYCLES_UNTIL_LONG;

    const modeConf = MODE_CONFIG[mode];

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8 py-6 animate-fade-in-up">

            {/* Mode badge */}
            <div className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold uppercase tracking-widest transition-all duration-500",
                mode === 'focus'
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : mode === 'shortBreak'
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-500"
            )}>
                <span className={cn("w-2 h-2 rounded-full", modeConf.dot, isActive && "animate-pulse")} />
                {modeConf.label}
            </div>

            {/* Tomato timer */}
            <TomatoTimer progress={progress} isActive={isActive} mode={mode}>
                <span
                    key={formattedTime}
                    className={cn(
                        "text-5xl font-mono font-bold tabular-nums leading-none transition-all duration-200",
                        isActive ? "text-white" : "text-white/75"
                    )}
                >
                    {formattedTime}
                </span>
                <span className="text-xs text-white/60 mt-2 font-medium">
                    {isActive ? 'em progresso' : timeLeft === duration ? 'pronto para iniciar' : 'pausado'}
                </span>
            </TomatoTimer>

            {/* Cycle indicators */}
            <div className="flex items-center gap-3">
                {Array.from({ length: CYCLES_UNTIL_LONG }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-3 h-3 rounded-full border-2 transition-all duration-300",
                            i < cyclesInRound
                                ? "bg-primary border-primary scale-110"
                                : "bg-transparent border-border"
                        )}
                    />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                    {completedCycles} {completedCycles === 1 ? 'ciclo' : 'ciclos'} completos
                </span>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
                <Button
                    size="lg"
                    onClick={isActive ? pause : start}
                    variant={isActive ? "secondary" : "default"}
                    className={cn(
                        "min-w-32 font-semibold transition-all duration-200",
                        !isActive && "hover:scale-105 hover:shadow-[0_0_20px_var(--color-primary)/50]"
                    )}
                >
                    {isActive ? "Pausar" : "Iniciar"}
                </Button>
                <Button
                    size="lg"
                    onClick={reset}
                    variant="outline"
                    className="hover:scale-105 transition-transform duration-200"
                >
                    Resetar
                </Button>
            </div>

            {/* Now playing */}
            {nowPlaying && onToggle && (
                <div className="w-full max-w-xs animate-fade-in-up">
                    <NowPlayingWidget
                        track={nowPlaying}
                        onToggle={onToggle}
                        onNext={onNext ?? (() => Promise.resolve())}
                        onPrev={onPrev ?? (() => Promise.resolve())}
                    />
                </div>
            )}
        </div>
    );
}
