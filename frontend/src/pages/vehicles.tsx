import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";

export function Vehicles() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Vehicles Fleet");
        return () => setHeading("");
    }, [setHeading]);
    return <h1 className="text-2xl font-bold">ICI UN DAHSBOARD</h1>;
}
