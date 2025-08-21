import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";

export function VehicleAdd() {
    const { setHeading } = usePageContext();

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
