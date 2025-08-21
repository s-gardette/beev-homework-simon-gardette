type ProgressProps = {
    value: number; // 0-100
    label?: string;
    gradientHeat?: boolean;
};

export function Progress({ value, label, gradientHeat }: ProgressProps) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    return (
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                    {label}
                </span>
                <span className="text-sm font-medium">{clamped}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded bg-slate-800">
                <div
                    className={gradientHeat ? "" : "bg-blue-600"}
                    style={{
                        height: "12px",
                        width: `${clamped}%`,
                        transition: "width 300ms ease",
                        ...(gradientHeat && {
                            background: `linear-gradient(to right, rgb(34 197 94), rgb(239 68 68))`,
                        }),
                    }}
                />
            </div>
        </div>
    );
}

export default Progress;
