import { useEffect } from "react";
import { usePageContext } from "@/components/layout/PageContext";

import { FleetStatus } from "@/components/FleetStatus";
import { VehiclesTable } from "@/components/VehiclesTable";

export function Dashboard() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Fleet Dashboard");
        return () => setHeading("");
    }, [setHeading]);

    return (
        <div className="dashboard space-y-6">
            <FleetStatus />
            <VehiclesTable />
        </div>
    );
}
