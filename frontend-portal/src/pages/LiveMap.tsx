import KenyaMap from "../components/KenyaMap";
import { useCurrency } from "../components/currency-provider";

export default function LiveMap() {
  const { formatAmount } = useCurrency();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Fleet - Kenya</h1>
          <p className="text-sm text-muted-foreground mt-1">Nairobi • Mombasa • Kisumu</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500 animate-pulse">
          ● Live
        </span>
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
