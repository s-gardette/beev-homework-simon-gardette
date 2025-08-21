/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from "react";

type PageContextType = {
    heading: string;
    setHeading: (h: string) => void;
};

const PageHeadingContext = createContext<PageContextType | undefined>(
    undefined
);

export function PageProvider({ children }: { children: ReactNode }) {
    const [heading, setHeading] = useState("");

    return (
        <PageHeadingContext.Provider value={{ heading, setHeading }}>
            {children}
        </PageHeadingContext.Provider>
    );
}

export function usePageContext() {
    const ctx = useContext(PageHeadingContext);
    if (!ctx) {
        throw new Error(
            "usePageContext must be used within a PageContextProvider"
        );
    }
    return ctx;
}

export default PageHeadingContext;
