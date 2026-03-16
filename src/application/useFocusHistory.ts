import { useState, useCallback } from "react";

export interface FocusEntry {
    date: string;       // YYYY-MM-DD
    duration: number;   // seconds
    timestamp: number;  // ms since epoch
}

export interface DailyData {
    date: string;
    total: number;      // seconds
    label: string;
}

const STORAGE_KEY = 'focus-history';
const MAX_DAYS = 30;

function todayString(): string {
    return new Date().toISOString().split('T')[0];
}

function loadHistory(): FocusEntry[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const entries = JSON.parse(data) as FocusEntry[];
        const cutoff = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000;
        return entries.filter(e => e.timestamp > cutoff);
    } catch {
        return [];
    }
}

export function useFocusHistory() {
    const [history, setHistory] = useState<FocusEntry[]>(loadHistory);

    const recordFocus = useCallback((durationSeconds: number) => {
        const entry: FocusEntry = {
            date: todayString(),
            duration: durationSeconds,
            timestamp: Date.now(),
        };
        setHistory(prev => {
            const updated = [...prev, entry];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const today = todayString();
    const todayEntries = history.filter(e => e.date === today);
    const todayTotal = todayEntries.reduce((sum, e) => sum + e.duration, 0);

    // Semana atual: segunda (0) → domingo (6), usando a ISO week (getDay: 0=dom, 1=seg … 6=sab)
    const now = new Date();
    const daysFromMonday = (now.getDay() + 6) % 7; // 0 se hoje é seg, 6 se hoje é dom
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    const weeklyData: DailyData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const total = history.filter(e => e.date === dateStr).reduce((sum, e) => sum + e.duration, 0);
        return {
            date: dateStr,
            total,
            label: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        };
    });

    return { history, recordFocus, todayTotal, todayEntries, weeklyData };
}
