import { useCurrency } from "../components/currency-provider";

export default function Orders() {
  const { formatAmount } = useCurrency();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders - Kenya Routes</h1>
          <p className="text-sm text-muted-foreground mt-1">Freight across East Africa</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium">Total Orders</h3>
          <div className="text-2xl font-bold">1,284</div>
          <p className="text-xs text-muted-foreground">+180 this week</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium">En Route</h3>
          <div className="text-2xl font-bold">342</div>
          <p className="text-xs text-muted-foreground">In transit</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium">Value</h3>
          <div className="text-2xl font-bold">{formatAmount(12500000)}</div>
          <p className="text-xs text-muted-foreground">Goods value</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Shipments</h3>
        <div className="space-y-4">
          {[
            { id: "ORD-7821", from: "Nairobi", to: "Mombasa", status: "In Transit", eta: "2h", value: 850000 },
            { id: "ORD-7822", from: "Kisumu", to: "Nairobi", status: "Loading", eta: "4h", value: 420000 },
            { id: "ORD-7823", from: "Mombasa", to: "Nakuru", status: "In Transit", eta: "6h", value: 1200000 },
          ].map((order) => (
            <div key={order.id} className="flex justify-between py-3 border-b last:border-0">
              <div className="flex-1">
                <div className="font-medium">{order.id}</div>
                <div className="text-sm text-muted-foreground">{order.from} → {order.to} • {formatAmount(order.value)}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">ETA: {order.eta}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${order.status === "In Transit" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
