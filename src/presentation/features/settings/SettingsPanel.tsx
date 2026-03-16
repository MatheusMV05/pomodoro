import { useState } from "react";
import { Save, RotateCcw, Target, Coffee, Leaf, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import type { TimerSettings } from "@/application/useSettings";
import { DEFAULT_SETTINGS } from "@/application/useSettings";

interface Props {
    settings: TimerSettings;
    onUpdate: (settings: TimerSettings) => void;
}

interface FieldConfig {
    key: keyof TimerSettings;
    label: string;
    description: string;
    min: number;
    max: number;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FIELDS: FieldConfig[] = [
    { key: 'focusMinutes',      label: 'Tempo de Foco',   description: 'Duração de cada sessão de foco', min: 1, max: 90, Icon: Target },
    { key: 'shortBreakMinutes', label: 'Pausa Curta',     description: 'Pausa entre sessões de foco',     min: 1, max: 30, Icon: Coffee },
    { key: 'longBreakMinutes',  label: 'Pausa Longa',     description: 'Pausa após 4 ciclos completos',   min: 5, max: 60, Icon: Leaf   },
];

export function SettingsPanel({ settings, onUpdate }: Props) {
    const [draft, setDraft] = useState<TimerSettings>(settings);
    const [saved, setSaved] = useState(false);

    const handleChange = (key: keyof TimerSettings, raw: string) => {
        const parsed = parseInt(raw, 10);
        const field  = FIELDS.find(f => f.key === key)!;
        const clamped = Number.isNaN(parsed) ? draft[key] : Math.min(field.max, Math.max(field.min, parsed));
        setDraft(prev => ({ ...prev, [key]: clamped }));
    };

    const handleSave = () => {
        onUpdate(draft);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setDraft(DEFAULT_SETTINGS);
    };

    const isDirty = JSON.stringify(draft) !== JSON.stringify(settings);
    const isDefault = JSON.stringify(draft) === JSON.stringify(DEFAULT_SETTINGS);

    return (
        <div className="h-full overflow-y-auto p-8 animate-fade-in-up">
            <div className="max-w-lg mx-auto flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Personalize os tempos do seu pomodoro
                    </p>
                </div>

                {/* Settings Card */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                    {FIELDS.map((field) => (
                        <div key={field.key} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <field.Icon size={18} className="text-primary shrink-0" />
                                <div>
                                    <label className="text-sm font-semibold text-foreground">{field.label}</label>
                                    <p className="text-xs text-muted-foreground">{field.description}</p>
                                </div>
                            </div>

                            {/* Slider + Number input */}
                            <div className="flex items-center gap-4 mt-1">
                                <input
                                    type="range"
                                    min={field.min}
                                    max={field.max}
                                    value={draft[field.key]}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="flex-1 accent-primary h-1.5 rounded-full cursor-pointer"
                                />
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <input
                                        type="number"
                                        min={field.min}
                                        max={field.max}
                                        value={draft[field.key]}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="w-14 text-center border border-border rounded-lg bg-muted/50 px-2 py-1.5 text-sm font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    <span className="text-xs text-muted-foreground">min</span>
                                </div>
                            </div>

                            {/* Visual preview circles */}
                            <div className="flex items-center gap-1 mt-0.5">
                                {Array.from({ length: Math.min(draft[field.key], 30) }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-primary/30"
                                        style={{ opacity: Math.max(0.2, i / Math.min(draft[field.key], 30)) }}
                                    />
                                ))}
                                {draft[field.key] > 30 && (
                                    <span className="text-xs text-muted-foreground ml-1">+{draft[field.key] - 30}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info box */}
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-600 dark:text-amber-400">
                    <AlertTriangle size={16} className="shrink-0" />
                    Salvar as configurações irá <strong>reiniciar o timer</strong> atual.
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className="flex-1 gap-2"
                        size="lg"
                    >
                        {saved ? <Check size={16} /> : <Save size={16} />}
                        {saved ? 'Salvo!' : 'Salvar'}
                    </Button>
                    <Button
                        onClick={handleReset}
                        disabled={isDefault}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                    >
                        <RotateCcw size={16} />
                        Padrão
                    </Button>
                </div>
            </div>
        </div>
    );
}
