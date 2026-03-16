type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
    focusSeconds: number;
    shortBreakSeconds: number;
    longBreakSeconds: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
    focusSeconds: 25 * 60,
    shortBreakSeconds: 5 * 60,
    longBreakSeconds: 15 * 60,
};

const CYCLES_BEFORE_LONG_BREAK = 4;

export class Pomodoro {
    public readonly mode: PomodoroMode;
    public readonly completedCycles: number;
    public readonly isActive: boolean;
    public readonly timeLeft: number;
    public readonly duration: number;
    public readonly settings: PomodoroSettings;

    private constructor(
        mode: PomodoroMode,
        completedCycles: number,
        isActive: boolean,
        timeLeft: number,
        duration: number,
        settings: PomodoroSettings,
    ) {
        this.mode = mode;
        this.completedCycles = completedCycles;
        this.isActive = isActive;
        this.timeLeft = timeLeft;
        this.duration = duration;
        this.settings = settings;
    }

    static create(settings: PomodoroSettings = DEFAULT_SETTINGS): Pomodoro {
        return new Pomodoro('focus', 0, false, settings.focusSeconds, settings.focusSeconds, settings);
    }

    start(): Pomodoro {
        if (this.isActive) return this;
        return new Pomodoro(this.mode, this.completedCycles, true, this.timeLeft, this.duration, this.settings);
    }

    pause(): Pomodoro {
        if (!this.isActive) return this;
        return new Pomodoro(this.mode, this.completedCycles, false, this.timeLeft, this.duration, this.settings);
    }

    reset(settings?: PomodoroSettings): Pomodoro {
        return Pomodoro.create(settings ?? this.settings);
    }

    tick(): Pomodoro {
        if (!this.isActive) return this;
        if (this.timeLeft > 1) {
            return new Pomodoro(this.mode, this.completedCycles, true, this.timeLeft - 1, this.duration, this.settings);
        }
        return this.advance();
    }

    private advance(): Pomodoro {
        if (this.mode === 'focus') {
            const newCycles = this.completedCycles + 1;
            const nextMode: PomodoroMode = newCycles % CYCLES_BEFORE_LONG_BREAK === 0 ? 'longBreak' : 'shortBreak';
            const nextDuration = nextMode === 'longBreak' ? this.settings.longBreakSeconds : this.settings.shortBreakSeconds;
            return new Pomodoro(nextMode, newCycles, true, nextDuration, nextDuration, this.settings);
        }
        return new Pomodoro('focus', this.completedCycles, true, this.settings.focusSeconds, this.settings.focusSeconds, this.settings);
    }
}
