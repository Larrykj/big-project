import { useCurrency } from "../components/currency-provider";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Truck, DollarSign } from "lucide-react";

const revenueData = [
    { month: 'Jan', revenue: 12500000 },
    { month: 'Feb', revenue: 15200000 },
    { month: 'Mar', revenue: 14800000 },
    { month: 'Apr', revenue: 18500000 },
    { month: 'May', revenue: 19200000 },
    { month: 'Jun', revenue: 21000000 },
];

const routeData = [
    { route: 'Nairobi-Mombasa', trips: 450 },
    { route: 'Nairobi-Kisumu', trips: 320 },
    { route: 'Mombasa-Nakuru', trips: 180 },
    { route: 'Eldoret-Nairobi', trips: 220 },
];

export default function Analytics() {
    const { formatAmount } = useCurrency();

    const stats = [
        { label: "Total Revenue", value: formatAmount(21000000), change: "+18.2%", icon: DollarSign, color: "text-green-500" },
        { label: "Active Orders", value: "1,284", change: "+12.5%", icon: Package, color: "text-blue-500" },
        { label: "Fleet Size", value: "247", change: "+8 trucks", icon: Truck, color: "text-purple-500" },
        { label: "Growth Rate", value: "23.1%", change: "YoY", icon: TrendingUp, color: "text-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Real-time business intelligence</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                            </div>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend (6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Routes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={routeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="route" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="trips" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-muted-foreground">Delivery Success Rate</p>
                        <p className="text-3xl font-bold text-primary mt-2">98.2%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                        <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                        <p className="text-3xl font-bold text-green-500 mt-2">4.8/5</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                        <p className="text-3xl font-bold text-blue-500 mt-2">94.5%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
