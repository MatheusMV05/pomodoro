type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

const DURATIONS: Record<PomodoroMode, number> = {
    focus:      25 * 60,
    shortBreak:  5 * 60,
    longBreak:  15 * 60,
};

const CYCLES_BEFORE_LONG_BREAK = 4;

export class Pomodoro {
    public readonly mode: PomodoroMode;
    public readonly completedCycles: number;
    public readonly isActive: boolean;
    public readonly timeLeft: number;
    public readonly duration: number;

    private constructor(
        mode: PomodoroMode,
        completedCycles: number,
        isActive: boolean,
        timeLeft: number,
        duration: number,
    ) {
        this.mode = mode;
        this.completedCycles = completedCycles;
        this.isActive = isActive;
        this.timeLeft = timeLeft;
        this.duration = duration;
    }

    static create(): Pomodoro {
        return new Pomodoro('focus', 0, false, DURATIONS['focus'], DURATIONS['focus']);
    }

    start(): Pomodoro {
        if (this.isActive) return this;
        return new Pomodoro(this.mode, this.completedCycles, true, this.timeLeft, this.duration);
    }

    pause(): Pomodoro {
        if (!this.isActive) return this;
        return new Pomodoro(this.mode, this.completedCycles, false, this.timeLeft, this.duration);
    }

    reset(): Pomodoro {
        return Pomodoro.create();
    }

    tick(): Pomodoro {
        if (!this.isActive) return this;

        if (this.timeLeft > 1) {
            return new Pomodoro(this.mode, this.completedCycles, true, this.timeLeft - 1, this.duration);
        }

        // timeLeft chegou a 0 — avança o ciclo
        return this.advance();
    }

    private advance(): Pomodoro {
        if (this.mode === 'focus') {
            const newCycles = this.completedCycles + 1;
            const nextMode = newCycles % CYCLES_BEFORE_LONG_BREAK === 0
                ? 'longBreak'
                : 'shortBreak';
            return new Pomodoro(nextMode, newCycles, true, DURATIONS[nextMode], DURATIONS[nextMode]);
        }

        return new Pomodoro('focus', this.completedCycles, true, DURATIONS['focus'], DURATIONS['focus']);
    }
}
