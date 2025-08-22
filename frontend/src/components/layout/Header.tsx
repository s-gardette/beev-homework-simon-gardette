import { NavLink } from "react-router";
import { Heading } from "@/components/ui";
import beevLogo from "@/assets/beev.svg";

const MenuItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Vehicles", path: "/vehicles" },
    { name: "Add Vehicle", path: "/vehicles/add" },
    { name: "Add Brand", path: "/brand/add" },
    { name: "Add Model", path: "/model/add" },
    { name: "Analytics", path: "/analytics" },
];

export function Header() {
    return (
        <header className="bg-background text-foreground sticky top-0 z-10 p-2">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <NavLink to="/">
                        <img
                            src={beevLogo}
                            className="logo h-16 w-16"
                            alt="Beev logo"
                        />
                    </NavLink>
                    <NavLink to="/">
                        <Heading as="h1" variant="h3">
                            Beev Fleet Management
                        </Heading>
                    </NavLink>
                </div>

                <nav>
                    {MenuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className="mx-2 text-foreground hover:text-indigo-400"
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
