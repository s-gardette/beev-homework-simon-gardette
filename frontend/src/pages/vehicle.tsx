import { useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { usePageContext } from "../components/layout/PageContext.tsx";
import type { Vehicle as VehicleType } from "../types";
import { useQuery } from "@tanstack/react-query";
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { ChargeLevel } from "@/components/ChargeLevel";
import { NotFound } from "./404.tsx";
import { fetchOrThrow } from "@/lib/utils.ts";

export function Vehicle() {
    const { id } = useParams<{ id: string }>();
    const { setHeading } = usePageContext();

    const { data, isLoading, error } = useQuery({
        queryKey: ["vehicle", id],
        queryFn: () =>
            fetchOrThrow(`/api/vehicles/${id}`).then((res) => res.json()),
        enabled: Boolean(id),
    });

    const vehicle = data as unknown as VehicleType | undefined;

    useEffect(() => {
        setHeading(vehicle ? vehicle.name || "No vehicule" : "No vehicule");
        return () => setHeading("");
    }, [setHeading, vehicle]);

    const formatDate = (iso?: string | null) =>
        iso ? new Date(iso).toLocaleString() : "—";

    if (!id || error) return <NotFound />;
    if (isLoading) return <div>Loading vehicle...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                    <Button asChild variant="secondary">
                        <NavLink to="/vehicles">Back</NavLink>
                    </Button>
                    <Button asChild variant="link">
                        <NavLink to={`/vehicles/${id}/edit`}>Edit</NavLink>
                    </Button>
                </div>
            </div>

            {vehicle && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                {vehicle.name ?? "Unnamed vehicle"}
                            </CardTitle>
                            <CardDescription>
                                {vehicle.brand?.name ?? "—"} —{" "}
                                {vehicle.model?.name ?? "—"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-muted-foreground">
                                        Status
                                    </div>
                                    <div className="font-medium">
                                        <StatusBadge
                                            status={
                                                vehicle.vehicleStatus?.status ??
                                                null
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-muted-foreground">
                                        External ID
                                    </div>
                                    <div className="font-medium">
                                        {vehicle.externalId ?? "—"}
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-muted-foreground">
                                        Created
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(vehicle.createdAt)}
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-muted-foreground">
                                        Updated
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(vehicle.updatedAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Model details */}
                            {vehicle.model && (
                                <div className="mt-6">
                                    <div className="text-sm font-semibold">
                                        Model
                                    </div>
                                    <div className="mt-1">
                                        <div className="text-muted-foreground">
                                            {vehicle.model.name ?? "—"}
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-muted-foreground">
                                                Battery capacity
                                            </div>
                                            <div className="font-medium">
                                                {vehicle.model
                                                    .batteryCapacity ?? "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">
                                                Avg consumption
                                            </div>
                                            <div className="font-medium">
                                                {vehicle.model
                                                    .averageConsumption ?? "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full items-center justify-between">
                                <div className="text-muted-foreground">
                                    Type: {vehicle.type ?? "—"}
                                </div>
                                <div className="text-muted-foreground">
                                    ID:{" "}
                                    <span className="font-mono text-xs">
                                        {vehicle.id}
                                    </span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Telemetry / Status</CardTitle>
                            <CardDescription>
                                Quick vitals for this vehicle
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs">
                                        <div className="text-muted-foreground">
                                            Charge level
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        <ChargeLevel
                                            level={
                                                vehicle.vehicleStatus
                                                    ?.currentChargeLevel ?? null
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs">
                                        <div className="text-muted-foreground">
                                            Status updated
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(
                                            vehicle.vehicleStatus?.updatedAt
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
