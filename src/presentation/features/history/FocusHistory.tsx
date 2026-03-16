import { Clock, Flame, TrendingUp } from "lucide-react";
import type { FocusEntry, DailyData } from "@/application/useFocusHistory";

interface Props {
    todayTotal: number;
    todayEntries: FocusEntry[];
    weeklyData: DailyData[];
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
}

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function FocusHistory({ todayTotal, todayEntries, weeklyData }: Props) {
    const maxWeekly = Math.max(...weeklyData.map(d => d.total), 1);
    const totalWeek = weeklyData.reduce((sum, d) => sum + d.total, 0);
    const todayIsIndex = weeklyData.findIndex(d => d.date === new Date().toISOString().split('T')[0]);

    return (
        <div className="h-full overflow-y-auto p-8 animate-fade-in-up">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Histórico de Concentração</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Acompanhe seu progresso de foco</p>
                </div>

                {/* Today's Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Flame size={16} className="text-primary" />
                            <span>Hoje</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground tabular-nums">
                            {todayTotal > 0 ? formatDuration(todayTotal) : '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {todayEntries.length} {todayEntries.length === 1 ? 'sessão' : 'sessões'} completadas
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <TrendingUp size={16} className="text-primary" />
                            <span>Esta semana</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground tabular-nums">
                            {totalWeek > 0 ? formatDuration(totalWeek) : '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {weeklyData.reduce((sum, d) => sum + (d.total > 0 ? 1 : 0), 0)} dias ativos
                        </p>
                    </div>
                </div>

                {/* Weekly Bar Chart */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                        Últimos 7 dias
                    </h2>
                    <div className="flex items-end gap-2 h-32">
                        {weeklyData.map((day, i) => {
                            const isToday = i === todayIsIndex;
                            const height = day.total > 0 ? Math.max((day.total / maxWeekly) * 100, 6) : 4;

                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                                    {/* Bar */}
                                    <div className="w-full flex items-end" style={{ height: '100px' }}>
                                        <div
                                            className={`w-full rounded-t-md transition-all duration-500 ${
                                                isToday
                                                    ? 'bg-primary shadow-[0_0_12px_var(--color-primary)/40]'
                                                    : day.total > 0
                                                        ? 'bg-primary/40 group-hover:bg-primary/60'
                                                        : 'bg-muted'
                                            }`}
                                            style={{ height: `${height}%` }}
                                            title={day.total > 0 ? formatDuration(day.total) : 'Sem foco'}
                                        />
                                    </div>
                                    <span className={`text-[11px] font-medium capitalize ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {day.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Session List */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={16} className="text-primary" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Sessões de hoje
                        </h2>
                    </div>

                    {todayEntries.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-4xl mb-3">🍅</p>
                            <p className="text-muted-foreground text-sm">Nenhuma sessão hoje ainda.</p>
                            <p className="text-muted-foreground/60 text-xs mt-1">Complete um ciclo de foco para registrar!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {[...todayEntries].reverse().map((entry, i) => (
                                <div
                                    key={entry.timestamp}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-accent/50 border border-border/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                                            {todayEntries.length - i}
                                        </span>
                                        <span className="text-sm text-foreground font-medium">
                                            {formatDuration(entry.duration)} de foco
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatTime(entry.timestamp)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
