import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageProvider, usePageContext } from "./PageContext.tsx";

function LayoutContent() {
    const { heading } = usePageContext();

    return (
        <div className="layout dark">
            <Header />
            <main className="bg-primary text-secondary relative min-h-screen">
                {heading ? (
                    <h1 className="p-4 text-xl font-semibold">{heading}</h1>
                ) : null}
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
