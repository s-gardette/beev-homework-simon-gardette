import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";

export function ModelAdd() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Add a Vehicle Model");
        return () => setHeading("");
    }, [setHeading]);
    return (
        <h1 className="text-2xl font-bold">
            ICI UN FORMULAIRE POUR AJOUTER UN Modèle de Véhicule
        </h1>
    );
}
