import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
    return (
        <div className="layout dark">
            <Header />
            <main className="dark:bg-primary dark:bg-text-white relative min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
