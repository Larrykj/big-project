import { BarChart3, Globe, LayoutDashboard, Truck, Moon, Sun, TrendingUp, Search as SearchIcon, Shield, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useTheme } from "../theme-provider";
import { useAuth } from "../auth-provider";

export function Sidebar() {
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "driver", "customer"] },
        { path: "/map", label: "Live Map", icon: Globe, roles: ["admin", "manager", "driver"] },
        { path: "/orders", label: "Orders", icon: Truck, roles: ["admin", "manager", "driver"] },
        { path: "/finance", label: "Finance", icon: BarChart3, roles: ["admin", "manager"] },
        { path: "/analytics", label: "Analytics", icon: TrendingUp, roles: ["admin", "manager"] },
        { path: "/track", label: "Track Shipment", icon: SearchIcon, roles: ["admin", "manager", "driver", "customer"] },
        { path: "/admin", label: "Admin Portal", icon: Shield, roles: ["admin"] },
    ];

    const filteredNavItems = navItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className={cn("hidden lg:flex flex-col pb-12 w-64 border-r bg-background h-full transition-colors duration-300")}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <div className="mb-6 px-4">
                        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            OmniLogistics
                        </h2>
                        {user && (
                            <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                                <p className="text-xs font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        {filteredNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "w-full justify-start flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive(item.path)
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 border-t space-y-2">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground"
                >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-destructive/10 transition-colors text-destructive hover:text-destructive"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}
