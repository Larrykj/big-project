import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../theme-provider";
import { useCurrency } from "../currency-provider";
import { useAuth } from "../auth-provider";

interface SearchResult {
    type: string;
    id: string;
    detail: string;
    status: string;
}

export function Topbar() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const { theme } = useTheme();
    const { currency } = useCurrency();
    const { user } = useAuth();

    const notifications = [
        { id: 1, text: "Order ORD-7821 arrived at Mombasa", time: "2 mins ago", unread: true },
        { id: 2, text: "Payment of KSH 425,000 received via M-Pesa", time: "15 mins ago", unread: true },
        { id: 3, text: "Driver KBX-001 completed delivery", time: "1 hour ago", unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        // Simulated search results
        const results = [
            { type: "Order", id: "ORD-7821", detail: "Nairobi → Mombasa", status: "In Transit" },
            { type: "Order", id: "ORD-7822", detail: "Kisumu → Nairobi", status: "Delivered" },
            { type: "Invoice", id: "INV-2024-001", detail: "KSH 425,000", status: "Paid" },
            { type: "Driver", id: "John Kamau", detail: "KBX 001A", status: "On Route" },
            { type: "Driver", id: "Mary Wanjiku", detail: "KCA 054B", status: "Available" },
        ].filter(item =>
            item.id.toLowerCase().includes(query.toLowerCase()) ||
            item.detail.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(results);
    };

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-6 justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <button className="lg:hidden">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search orders, invoices, drivers..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />

                        {searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                                {searchResults.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 hover:bg-accent cursor-pointer border-b last:border-0"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSearchResults([]);
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded mr-2">
                                                    {result.type}
                                                </span>
                                                <span className="font-medium">{result.id}</span>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded ${result.status === 'Delivered' || result.status === 'Paid' ? 'bg-green-500/10 text-green-500' :
                                                result.status === 'Available' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {result.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{result.detail}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground hidden md:block">
                        {currency} • {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg hover:bg-accent"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50">
                                <div className="p-4 border-b">
                                    <h3 className="font-semibold">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 border-b last:border-0 hover:bg-accent cursor-pointer ${notif.unread ? "bg-primary/5" : ""
                                                }`}
                                        >
                                            <p className="text-sm">{notif.text}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 border-t">
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        className="text-sm text-primary hover:underline w-full text-center"
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                            {user?.name?.charAt(0) || "A"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
