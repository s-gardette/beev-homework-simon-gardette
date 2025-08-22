import { useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { usePageContext } from "../components/layout/PageContext.tsx";
import type { Vehicle as VehicleType } from "../types";
import { useQuery } from "@tanstack/react-query";
import { Button, Heading } from "@/components/ui";

export function Vehicle() {
    const { id } = useParams<{ id: string }>();
    const { setHeading } = usePageContext();
    console.log("Vehicle component rendered with id:", id);
    const { data, isLoading, error } = useQuery({
        queryKey: ["vehicle", id],
        queryFn: () =>
            fetch(`/api/vehicles/${id}`).then((res) => {
                return res.json();
            }),
        enabled: Boolean(id),
    });

    const vehicle = data as unknown as VehicleType | undefined;

    useEffect(() => {
        setHeading("Vehicle Details");
        return () => setHeading("");
    }, [setHeading]);

    if (!id) return <div>404</div>;
    if (isLoading) return <div>Loading vehicle...</div>;
    if (error)
        return (
            <div>404 + Error loading vehicle: {(error as Error).message}</div>
        );

    return (
        <div>
            <Heading as="h2">Vehicle Details</Heading>
            {vehicle && (
                <>
                    <div className="mt-4">
                        <div className="text-lg font-semibold">
                            {vehicle.name}
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {vehicle.brand?.name} — {vehicle.model?.name}
                        </div>
                    </div>
                    <Button variant="link" className="mt-4">
                        <NavLink to={`/vehicles/${id}/edit`}>Edit</NavLink>
                    </Button>
                </>
            )}
        </div>
    );
}
