import { useEffect } from "react";
import { usePageContext } from "@/components/layout/PageContext";

export function Dashboard() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Analytics");
        return () => setHeading("");
    }, [setHeading]);

    return <div className="dashboard dark"></div>;
}
