import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";
import { ChartBar, ChartArea } from "../components/analytics";
import { FleetStatus } from "@/components/FleetStatus.tsx";

export function Analytics() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Analytics");
        return () => setHeading("");
    }, [setHeading]);

    const vehicleStatusDistrib = [
        { x: "January", y: 186 },
        { x: "February", y: 305 },
        { x: "March", y: 240 },
    ];
    const vehicleTypeDistrib = [
        { x: "BEV", y: 186 },
        { x: "ICE", y: 305 },
    ];

    const areaData = [
        { x: "21/08", y: 30 },
        { x: "22/08", y: 50 },
        { x: "23/08", y: 35 },
        { x: "24/08", y: 70 },
        { x: "25/08", y: 60 },
    ];

    const areaData2 = [
        { x: "21/08", y: 20 },
        { x: "22/08", y: 40 },
        { x: "23/08", y: 25 },
        { x: "24/08", y: 50 },
        { x: "25/08", y: 45 },
    ];

    return (
        <div className="space-y-4">
            <FleetStatus />

            <div className="grid grid-cols-2 gap-4">
                <ChartBar
                    title="Vehicle Status Distribution"
                    data={vehicleStatusDistrib}
                />
                <ChartBar
                    title="Vehicle Type Distribution"
                    data={vehicleTypeDistrib}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ChartArea
                    title="Average Charge Level Over Time"
                    subtitle="Last 30 Days"
                    bigNumber={<span>75%</span>}
                    data={areaData}
                    xKey="x"
                    series={[{ key: "y", label: "Charge" }]}
                    color="chart-2"
                />
                <ChartArea
                    title="Average Energy Consumption Over Time"
                    subtitle="Last 30 Days"
                    bigNumber={<span>25 kWh/100km</span>}
                    data={areaData2}
                    xKey="x"
                    series={[{ key: "y", label: "Energy" }]}
                    color="chart-4"
                />
            </div>
        </div>
    );
}

export default Analytics;
