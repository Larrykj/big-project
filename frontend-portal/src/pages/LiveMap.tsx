import { useState } from "react";
import KenyaMap from "../components/KenyaMap";
import { useCurrency } from "../components/currency-provider";
import { toast } from "sonner";
import axios from "axios";
import { ScanSearch, ShieldCheck, AlertTriangle } from "lucide-react";

export default function LiveMap() {
  const { formatAmount } = useCurrency();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanAnomalies = async () => {
    setIsScanning(true);
    const toastId = toast.loading("AI Satellite scanning fleet...", {
      description: "Analyzing telemetry data from all 247 trucks"
    });

    try {
      // Direct call to AI Service (Python)
      const response = await axios.get("http://localhost:5001/api/anomaly-detection");
      const data = response.data;

      setTimeout(() => {
        if (data.anomalies_found > 0) {
          toast.error(`Anomaly Detected: ${data.details[0]?.message}`, {
            id: toastId,
            description: `Truck ${data.truck_id} - ${data.details[0]?.recommendation}`,
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            duration: 5000,
          });
        } else {
          toast.success("Fleet Status Nominal", {
            id: toastId,
            description: "No anomalies detected in active fleet.",
            icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
          });
        }
        setIsScanning(false);
      }, 1500); // Artificial delay for effect
    } catch {
      toast.error("AI Service Offline", {
        id: toastId,
        description: "Could not connect to Python Analysis Engine",
      });
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Fleet - Kenya</h1>
          <p className="text-sm text-muted-foreground mt-1">Nairobi • Mombasa • Kisumu</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleScanAnomalies}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isScanning ? <ScanSearch className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
            {isScanning ? "Scanning..." : "AI Anomaly Scan"}
          </button>
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500 animate-pulse">
            ● Live
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium">Active Trucks</h3>
          <div className="text-2xl font-bold">247</div>
          <p className="text-xs text-muted-foreground">+12% today</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium">To Mombasa</h3>
          <div className="text-2xl font-bold">89</div>
          <p className="text-xs text-muted-foreground">On highway</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium">Avg Speed</h3>
          <div className="text-2xl font-bold">67 km/h</div>
          <p className="text-xs text-muted-foreground">Fleet avg</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium">Revenue</h3>
          <div className="text-2xl font-bold">{formatAmount(3250000)}</div>
          <p className="text-xs text-muted-foreground">Today</p>
        </div>
      </div>

      <KenyaMap />
    </div>
  )
}
