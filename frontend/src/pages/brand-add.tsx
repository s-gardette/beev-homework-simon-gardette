import { useEffect } from "react";
import { usePageContext } from "../components/layout/PageContext.tsx";

export function BrandAdd() {
    const { setHeading } = usePageContext();

    useEffect(() => {
        setHeading("Add a Brand");
        return () => setHeading("");
    }, [setHeading]);
    return (
        <h1 className="text-2xl font-bold">
            ICI UN FORMULAIRE POUR AJOUTER UNE MARQUE
        </h1>
    );
}
