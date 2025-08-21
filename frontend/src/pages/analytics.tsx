import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";

export function Analytics() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Analytics");
        return () => setHeading("");
    }, [setHeading]);

    return <h2 className="text-2xl font-bold">ICI DES STATS</h2>;
}
