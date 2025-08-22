type ProgressProps = {
    value: number;
    label?: string;
    gradientHeat?: boolean;
    displayLabel?: boolean;
};

export function Progress({
    value,
    label,
    gradientHeat = false,
    displayLabel = true,
}: ProgressProps) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const bgLayerClass = gradientHeat
        ? "bg-gradient-to-l from-chart-2 to-chart-5"
        : "bg-accent";

    return (
        <div className="w-full">
            {displayLabel && (
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">
                        {label}
                    </span>
                    <span className="text-sm font-medium">{clamped}%</span>
                </div>
            )}
            <div className="bg-background relative h-3 w-full overflow-hidden rounded">
                <div
                    className={`absolute inset-0 transition-all duration-300 ease-in-out ${bgLayerClass}`}
                />
                <div
                    className="bg-background absolute top-0 right-0 h-full transition-all duration-300 ease-in-out"
                    style={{ width: `${100 - clamped}%` }}
                />
            </div>
        </div>
    );
}

export default Progress;
