import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

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

const trucks = [
  { id: 1, position: [-1.2921, 36.8219] as [number, number], name: "KBX-001", route: "Nairobi → Mombasa" },
  { id: 2, position: [-4.0435, 39.6682] as [number, number], name: "KCA-054", route: "Mombasa Port" },
  { id: 3, position: [-0.0917, 34.7680] as [number, number], name: "KAK-123", route: "Kisumu → Nairobi" },
];

const warehouses = [
  { id: 1, position: [-1.2921, 36.8219] as [number, number], name: "Nairobi Hub" },
  { id: 2, position: [-4.0435, 39.6682] as [number, number], name: "Mombasa Port" },
  { id: 3, position: [-0.0917, 34.7680] as [number, number], name: "Kisumu Center" },
];

export default function KenyaMap() {
  const [activeTab, setActiveTab] = useState<"trucks" | "warehouses">("trucks");

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border shadow-lg">
      <div className="bg-card border-b p-2 flex gap-2">
        <button onClick={() => setActiveTab("trucks")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "trucks" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          🚚 Trucks ({trucks.length})
        </button>
        <button onClick={() => setActiveTab("warehouses")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "warehouses" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          🏭 Hubs ({warehouses.length})
        </button>
      </div>

      <MapContainer center={[-1.2921, 36.8219]} zoom={7} style={{ height: "550px", width: "100%" }} className="z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {activeTab === "trucks" && trucks.map((truck) => (
          <Marker key={truck.id} position={truck.position} icon={truckIcon}>
            <Popup><strong>{truck.name}</strong><br />{truck.route}</Popup>
          </Marker>
        ))}

        {activeTab === "warehouses" && warehouses.map((w) => (
          <>
            <Marker key={w.id} position={w.position} icon={warehouseIcon}>
              <Popup><strong>{w.name}</strong></Popup>
            </Marker>
            <Circle center={w.position} radius={30000} pathOptions={{ color: "green", fillOpacity: 0.1 }} />
          </>
        ))}
      </MapContainer>
    </div>
  );
}
