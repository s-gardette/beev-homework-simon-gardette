import React from "react";
import { Progress } from "@/components/ui";

type Props = {
    level?: number | null;
    size?: "sm" | "md" | "lg";
    showPercent?: boolean;
    gradientHeat?: boolean;
    className?: string;
};

export const ChargeLevel: React.FC<Props> = ({
    level = null,
    size = "md",
    gradientHeat = true,
    className,
}) => {
    const pct =
        level == null ? 0 : Math.max(0, Math.min(100, Math.round(level)));
    const widthClass = size === "sm" ? "w-36" : size === "lg" ? "w-64" : "w-48";
    return (
        <div className={`flex items-center gap-3 ${className ?? ""}`}>
            <div className={widthClass}>
                <Progress value={pct} gradientHeat={gradientHeat} />
            </div>
        </div>
    );
};

export default ChargeLevel;
