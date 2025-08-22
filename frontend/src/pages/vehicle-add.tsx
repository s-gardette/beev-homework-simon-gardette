import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";

export function VehicleAdd({ mode = "add" }: { mode?: "edit" | "add" } = {}) {
    const { setHeading } = usePageContext();
    console.log(mode);

    useEffect(() => {
        setHeading("Add a Vehicle");
        return () => setHeading("");
    }, [setHeading]);
    return (
        <h1 className="text-2xl font-bold">
            ICI UN FORMULAIRE POUR AJOUTER UN VEHICULE
        </h1>
    );
}
