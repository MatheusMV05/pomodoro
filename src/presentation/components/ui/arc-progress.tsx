import { cn } from "@/lib/utils";

type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

interface ArcProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    isActive?: boolean;
    mode?: PomodoroMode;
}

const MODE_COLORS: Record<PomodoroMode, string> = {
    focus:      'text-primary',
    shortBreak: 'text-emerald-500',
    longBreak:  'text-blue-500',
};

export function ArcProgress({ value, size = 200, strokeWidth = 14, className, isActive = false, mode = 'focus' }: ArcProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // 270° arc with gap at the bottom
    const arcFraction = 0.75;
    const maxArc = arcFraction * circumference;
    const progressArc = (value / 100) * maxArc;

    // rotate 135° so arc starts at bottom-left and ends at bottom-right
    const rotation = 135;
    const transform = `rotate(${rotation} ${size / 2} ${size / 2})`;
    const colorClass = MODE_COLORS[mode];

    // Tip position: arc starts at SVG 0° (3 o'clock), rotated by `rotation` degrees
    const tipAngleRad = ((rotation + (progressArc / circumference) * 360) * Math.PI) / 180;
    const tipX = size / 2 + radius * Math.cos(tipAngleRad);
    const tipY = size / 2 + radius * Math.sin(tipAngleRad);
    const tomatoSize = strokeWidth * 1.6;

    return (
        <svg width={size} height={size} className={className}>
            {/* Track */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={`${maxArc} ${circumference}`}
                strokeLinecap="round"
                className="text-muted"
                transform={transform}
            />

            {/* Progress */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={`${progressArc} ${circumference}`}
                strokeLinecap="round"
                className={cn(colorClass, "transition-all duration-500")}
                transform={transform}
            />

            {/* Tomato at tip */}
            {value > 1 && (
                <text
                    x={tipX}
                    y={tipY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={tomatoSize}
                    className={cn("transition-all duration-500", isActive && "animate-timer-breathe")}
                    style={{ userSelect: 'none' }}
                >
                    🍅
                </text>
            )}
        </svg>
    );
}
