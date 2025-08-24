import { Card, CardContent, Progress } from "@/components/ui";
import { fetchOrThrow, titleize } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "./analytics";
export function FleetStatus() {
    const { isPending, error, data } = useQuery({
        queryKey: ["fleetStatus"],
        queryFn: () =>
            fetchOrThrow("/api/analytics/fleet-operational").then((res) =>
                res.json()
            ),
    });

    if (isPending)
        return (
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-6 w-80 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index}>
                            <CardContent className="flex justify-between">
                                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-12 w-16 animate-pulse rounded bg-gray-200"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );

    if (error) return "An error has occurred: " + error.message;

    if (data?.totalVehicles === 0 && !isPending && !error) {
        return;
    }

    return (
        <div className="fleet-status mb-8">
            <div className="mb-8 flex w-full grow items-center justify-between">
                <div className="grow">
                    <Progress
                        value={Number(100 - (data?.availabilityRate ?? 0))}
                        label="Fleet Usage"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data &&
                    typeof data === "object" &&
                    Object.entries(data)
                        .filter(([key]) => key !== "availabilityRate")
                        .map(([key, value]) => {
                            return (
                                <StatCard
                                    key={key}
                                    label={titleize(
                                        key.replace(/([A-Z])/g, " $1")
                                    )}
                                    value={value as string | number}
                                />
                            );
                        })}
            </div>
        </div>
    );
}
