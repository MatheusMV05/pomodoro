type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

const DURATIONS: Record<PomodoroMode, number> = {
    focus:      25 * 60,
    shortBreak:  5 * 60,
    longBreak:  15 * 60,
};

const CYCLES_BEFORE_LONG_BREAK = 4;

export class Pomodoro {
    private constructor(
        public readonly mode: PomodoroMode,
        public readonly completedCycles: number,
        public readonly isActive: boolean,
        public readonly timeLeft: number,
    ) {}

    static create(): Pomodoro {
        return new Pomodoro('focus', 0, false, DURATIONS['focus']);
    }

    start(): Pomodoro {
        if (this.isActive) return this;
        return new Pomodoro(this.mode, this.completedCycles, true, this.timeLeft);
    }

    pause(): Pomodoro {
        if (!this.isActive) return this;
        return new Pomodoro(this.mode, this.completedCycles, false, this.timeLeft);
    }

    reset(): Pomodoro {
        return Pomodoro.create();
    }

    tick(): Pomodoro {
        if (!this.isActive) return this;

        if (this.timeLeft > 1) {
            return new Pomodoro(this.mode, this.completedCycles, true, this.timeLeft - 1);
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
            return new Pomodoro(nextMode, newCycles, true, DURATIONS[nextMode]);
        }

        return new Pomodoro('focus', this.completedCycles, true, DURATIONS['focus']);
    }
}