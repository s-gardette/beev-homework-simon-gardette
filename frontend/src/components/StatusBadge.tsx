import { Badge } from "@/components/ui";

type Props = {
    status?: string | null;
    className?: string;
};

type BadgeVariant = "inUse" | "charging" | "available" | "alert";

const META: Record<string, { label: string; variant: BadgeVariant }> = {
    available: { label: "Available", variant: "available" },
    in_use: { label: "In Use", variant: "inUse" },
    charging: { label: "Charging", variant: "charging" },
    unknown: { label: "Unknown", variant: "alert" },
};

export function StatusBadge({ status, className }: Props) {
    const key = String(status ?? "unknown");
    const meta =
        (META as Record<string, { label: string; variant: BadgeVariant }>)[
            key
        ] ?? META.unknown;

    return (
        <Badge
            variant={meta.variant}
            className={`rounded-full px-3 py-1 text-xs ${className ?? ""}`}
        >
            {meta.label}
        </Badge>
    );
}

export { META };
