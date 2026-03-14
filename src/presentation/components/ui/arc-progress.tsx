interface ArcProgressProps{
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function ArcProgress({ value, size = 200, strokeWidth = 12, className }: ArcProgressProps){
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // 270° arc with gap at the bottom
    const arcFraction = 0.75;
    const maxArc = arcFraction * circumference;
    const progressArc = (value / 100) * maxArc;

    // rotate 135° so arc starts at bottom-left and ends at bottom-right
    const rotation = 135;
    const transform = `rotate(${rotation} ${size / 2} ${size / 2})`;

    return(
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
                className="text-primary transition-all duration-300"
                transform={transform}
            />
        </svg>
    )
}
