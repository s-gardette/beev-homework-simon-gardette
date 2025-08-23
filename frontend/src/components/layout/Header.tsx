import { NavLink } from "react-router";
import { Heading } from "@/components/ui";
import beevLogo from "@/assets/beev.svg";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export function Header() {
    type SubItem = { name: string; path: string };
    type MenuItem = { name: string; path?: string; items?: SubItem[] };

    const menu: MenuItem[] = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Vehicles", path: "/vehicles" },
        {
            name: "Admin",
            items: [
                { name: "Add Vehicle", path: "/vehicles/add" },
                { name: "Add Brand", path: "/brand/add" },
                { name: "Add Model", path: "/model/add" },
            ],
        },
        { name: "Analytics", path: "/analytics" },
    ];

    function renderMenuItem(item: MenuItem) {
        if (item.items && item.items.length > 0) {
            return (
                <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid gap-2 p-4">
                            {item.items.map((child) => (
                                <NavigationMenuLink asChild key={child.name}>
                                    <NavLink to={child.path}>
                                        {child.name}
                                    </NavLink>
                                </NavigationMenuLink>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            );
        }

        return (
            <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild>
                    <NavLink to={item.path ?? "#"}>{item.name}</NavLink>
                </NavigationMenuLink>
            </NavigationMenuItem>
        );
    }

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
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menu.map((m) => renderMenuItem(m))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>
            </div>
        </header>
    );
}
