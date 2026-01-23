import { useCurrency } from "../components/currency-provider";

export default function Finance() {
    const { formatAmount, currency, setCurrency } = useCurrency();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Finance Overview</h1>
                    <p className="text-sm text-muted-foreground mt-1">M-Pesa & Bank Payments</p>
                </div>
                <div className="flex gap-2 items-center">
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="KSH">KSH</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                    </select>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">
                        KRA Report
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                    <div className="text-2xl font-bold">{formatAmount(18500000)}</div>
                    <p className="text-xs text-muted-foreground"><span className="text-green-500">↑ 20%</span> vs last month</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">M-Pesa</h3>
                    <div className="text-2xl font-bold">{formatAmount(12300000)}</div>
                    <p className="text-xs text-muted-foreground">66% of revenue</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Outstanding</h3>
                    <div className="text-2xl font-bold">{formatAmount(2450000)}</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Payouts</h3>
                    <div className="text-2xl font-bold">{formatAmount(8900000)}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                    {[
                        { id: "INV-001", client: "Nakumatt", amount: 425000, status: "Paid", method: "M-Pesa" },
                        { id: "INV-002", client: "Tuskys", amount: 318000, status: "Pending", method: "Bank" },
                        { id: "INV-003", client: "Naivas", amount: 542000, status: "Paid", method: "M-Pesa" },
                    ].map((t) => (
                        <div key={t.id} className="flex justify-between py-3 border-b last:border-0">
                            <div>
                                <div className="font-medium">{t.client}</div>
                                <div className="text-sm text-muted-foreground">{t.id} • {t.method}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold">{formatAmount(t.amount)}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${t.status === "Paid" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                    {t.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
