import { Card, CardContent } from "@/components/ui/card";

type Props = {
    label: string;
    value: string | number;
    hint?: string;
};

export function StatCard({ label, value, hint }: Props) {
    return (
        <Card className="bg-card text-card-foreground rounded-lg border p-4">
            <CardContent className="p-0">
                <div className="text-muted-foreground text-sm">{label}</div>
                <div className="mt-2 text-2xl font-bold">{value}</div>
                {hint && (
                    <div className="text-muted-foreground mt-1 text-xs">
                        {hint}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default StatCard;
