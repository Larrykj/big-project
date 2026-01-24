import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSocket } from "../hooks/useSocket";
import { Wifi, WifiOff } from "lucide-react";

const truckIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097186.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const warehouseIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/679/679922.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const warehouses = [
  { id: 1, position: [-1.2921, 36.8219] as [number, number], name: "Nairobi Hub" },
  { id: 2, position: [-4.0435, 39.6682] as [number, number], name: "Mombasa Port" },
  { id: 3, position: [-0.0917, 34.7680] as [number, number], name: "Kisumu Center" },
];

// Component to animate marker movement
function AnimatedMarker({ position, icon, children }: { position: [number, number]; icon: Icon; children: React.ReactNode }) {
  return (
    <Marker position={position} icon={icon}>
      {children}
    </Marker>
  );
}

export default function KenyaMap() {
  const [activeTab, setActiveTab] = useState<"trucks" | "warehouses">("trucks");
  const { isConnected, truckPositions } = useSocket();

  // Convert socket truck positions to array
  const trucks = Object.entries(truckPositions).map(([plateNumber, data], index) => ({
    id: index + 1,
    position: [data.lat, data.lng] as [number, number],
    name: plateNumber,
    route: data.location || "Unknown",
    speed: data.speed || 0,
    status: data.status || "unknown",
    heading: data.heading || "N",
  }));

  // Fallback to static data if no WebSocket connection
  const fallbackTrucks = [
    { id: 1, position: [-1.2921, 36.8219] as [number, number], name: "KBX-001", route: "Nairobi → Mombasa", speed: 65, status: "on_route", heading: "SE" },
    { id: 2, position: [-4.0435, 39.6682] as [number, number], name: "KCA-054", route: "Mombasa Port", speed: 0, status: "loading", heading: "N" },
    { id: 3, position: [-0.0917, 34.7680] as [number, number], name: "KAK-123", route: "Kisumu → Nairobi", speed: 72, status: "on_route", heading: "E" },
  ];

  const displayTrucks = trucks.length > 0 ? trucks : fallbackTrucks;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border shadow-lg">
      <div className="bg-card border-b p-2 flex gap-2 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("trucks")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "trucks" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
          >
            🚚 Trucks ({displayTrucks.length})
          </button>
          <button
            onClick={() => setActiveTab("warehouses")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "warehouses" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
          >
            🏭 Hubs ({warehouses.length})
          </button>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isConnected ? "Live" : "Offline"}
        </div>
      </div>

      <MapContainer center={[-1.2921, 36.8219]} zoom={7} style={{ height: "550px", width: "100%" }} className="z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {activeTab === "trucks" && displayTrucks.map((truck) => (
          <AnimatedMarker key={truck.id} position={truck.position} icon={truckIcon}>
            <Popup>
              <div className="min-w-[150px]">
                <strong className="text-lg">{truck.name}</strong>
                <div className="text-sm text-gray-600 mt-1">{truck.route}</div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className={`px-2 py-0.5 rounded ${truck.status === 'on_route' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {truck.status.replace('_', ' ')}
                  </span>
                  <span className="font-mono">{truck.speed} km/h</span>
                </div>
              </div>
            </Popup>
          </AnimatedMarker>
        ))}

        {activeTab === "warehouses" && warehouses.map((w) => (
          <div key={w.id}>
            <Marker position={w.position} icon={warehouseIcon}>
              <Popup><strong>{w.name}</strong></Popup>
            </Marker>
            <Circle center={w.position} radius={30000} pathOptions={{ color: "green", fillOpacity: 0.1 }} />
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
