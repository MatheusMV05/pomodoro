import { useState } from "react";

export interface TimerSettings {
    focusMinutes: number;
    shortBreakMinutes: number;
    longBreakMinutes: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
};

const STORAGE_KEY = 'pomodoro-settings';

export function useSettings() {
    const [settings, setSettings] = useState<TimerSettings>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    const updateSettings = (updated: TimerSettings) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setSettings(updated);
    };

    return { settings, updateSettings };
}
