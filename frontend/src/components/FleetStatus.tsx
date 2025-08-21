import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/headings";
import { Progress } from "@/components/ui/progress";
import { titleize } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
export function FleetStatus() {
    const { isPending, error, data } = useQuery({
        queryKey: ["backend"],
        queryFn: () =>
            fetch("/api/analytics/fleet-operational").then((res) => res.json()),
    });

    console.log("data", data);

    if (isPending)
        return (
            <>
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-6 w-80 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="bg-secondary text-primary">
                            <CardContent className="flex justify-between">
                                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-12 w-16 animate-pulse rounded bg-gray-200"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </>
        );

    if (error) return "An error has occurred: " + error.message;
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading as="h2">Fleet Overview</Heading>
                <div className="w-80">
                    <Progress
                        value={Number(100 - (data?.availabilityRate ?? 0))}
                        label="Fleet Utilization"
                        gradientHeat={true}
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
                                <Card
                                    key={key}
                                    className="bg-secondary text-primary"
                                >
                                    <CardContent className="flex justify-between ">
                                        <CardTitle>{titleize(key)}</CardTitle>
                                        <p className="-mt-1 text-5xl font-bold">
                                            {String(value)}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
            </div>
        </>
    );
}
