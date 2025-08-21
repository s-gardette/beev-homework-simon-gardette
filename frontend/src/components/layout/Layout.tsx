import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageProvider, usePageContext } from "./PageContext.tsx";
import { Heading } from "../ui/headings";

function LayoutContent() {
    const { heading } = usePageContext();

    return (
        <div className="layout dark:dark bg-primary text-secondary ">
            <Header />
            <main className="relative container mx-auto min-h-screen content-center px-4">
                {heading && <Heading as="h1">{heading}</Heading>}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export function Layout() {
    return (
        <PageProvider>
            <LayoutContent />
        </PageProvider>
    );
}
