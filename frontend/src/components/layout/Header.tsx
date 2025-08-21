import { NavLink } from "react-router";
import beevLogo from "../../assets/beev.svg";

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
        <header className="bg-secondary text-primary sticky top-0 z-10 p-2">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="https://beev.co" target="_blank">
                        <img
                            src={beevLogo}
                            className="logo h-16 w-16"
                            alt="Beev logo"
                        />
                    </a>
                    <h1 className="text-xl font-bold">Beev Homework</h1>
                </div>

                <nav>
                    {MenuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className="mx-2 text-white hover:text-indigo-400"
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
