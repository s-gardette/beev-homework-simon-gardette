import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";
import { VehiclesTable } from "../components/VehiclesTable/VehiclesTable.tsx";

export function Vehicles() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Vehicles Fleet");
        return () => setHeading("");
    }, [setHeading]);
    return (
        <div className="vehicles space-y-6">
            <VehiclesTable rows={50} />
        </div>
    );
}
