import { useState } from "react";
import { Search, Package } from "lucide-react";

interface TimelineEvent {
    status: string;
    date: string;
    completed: boolean;
    active?: boolean;
}

interface Shipment {
    id: string;
    from: string;
    to: string;
    status: string;
    currentLocation: string;
    progress: number;
    timeline: TimelineEvent[];
}

export default function TrackShipment() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [shipment, setShipment] = useState<Shipment | null>(null);

    const handleTrack = () => {
        setShipment({
            id: trackingNumber || "ORD-KE-7821",
            from: "Nairobi Industrial Area",
            to: "Mombasa Port",
            status: "In Transit",
            currentLocation: "Mtito Andei",
            progress: 65,
            timeline: [
                { status: "Order Placed", date: "Jan 23, 09:00 AM", completed: true },
                { status: "Picked Up", date: "Jan 23, 10:30 AM", completed: true },
                { status: "In Transit", date: "Jan 23, 11:45 AM", completed: true, active: true },
                { status: "Out for Delivery", date: "Expected 03:00 PM", completed: false },
                { status: "Delivered", date: "Expected 04:00 PM", completed: false },
            ],
        });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Track Your Shipment</h1>
                <p className="text-sm text-muted-foreground mt-2">Enter your tracking number to see live updates</p>
            </div>

            <div className="rounded-lg border bg-card p-8">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter tracking number (e.g., ORD-KE-7821)"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button
                        onClick={handleTrack}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Track
                    </button>
                </div>
            </div>

            {shipment && (
                <div className="space-y-6 animate-fade-in">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-bold">{shipment.id}</h2>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {shipment.from} → {shipment.to}
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium">
                                {shipment.status}
                            </span>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm text-muted-foreground">{shipment.progress}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000 ease-out"
                                    style={{ width: `${shipment.progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Currently at: <span className="font-medium text-foreground">{shipment.currentLocation}</span>
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="font-semibold mb-4">Shipment Timeline</h3>
                        <div className="space-y-4">
                            {shipment.timeline.map((event: TimelineEvent, index: number) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`h-3 w-3 rounded-full transition-all ${event.completed
                                                ? "bg-primary"
                                                : "bg-muted border-2 border-muted-foreground"
                                                } ${event.active ? "ring-4 ring-primary/20 animate-pulse" : ""}`}
                                        />
                                        {index < shipment.timeline.length - 1 && (
                                            <div className={`w-0.5 h-12 ${event.completed ? "bg-primary" : "bg-muted"}`} />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className={`font-medium ${event.completed ? "" : "text-muted-foreground"}`}>
                                            {event.status}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{event.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
