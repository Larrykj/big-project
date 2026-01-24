import { useState } from "react";
import { useCurrency } from "../components/currency-provider";
import { toast } from "sonner";
import axios from "axios";
import { Phone, Loader2, Settings } from "lucide-react";

export default function Finance() {
    const { formatAmount, currency, setCurrency } = useCurrency();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    // Default to your phone number for sandbox testing
    const [phoneNumber, setPhoneNumber] = useState("254799543777");
    const [showSettings, setShowSettings] = useState(false);
    const [testAmount, setTestAmount] = useState<number>(1);

    const handleMpesaPay = async (id: string, amount: number) => {
        setLoadingId(id);
        const toastId = toast.loading("Initiating M-Pesa STK Push...", {
            description: `Sending KSH ${amount} to ${phoneNumber}. Check your phone!`
        });

        try {
            // Call C# Finance Service
            const response = await axios.post("http://localhost:5000/api/mpesa/pay", {
                PhoneNumber: phoneNumber,
                Amount: amount,
                Reference: id
            });

            console.log("M-Pesa Response:", response.data);

            toast.success("STK Push Sent Successfully! 🎉", {
                id: toastId,
                description: `Check your phone (${phoneNumber}) for the M-Pesa prompt. Amount: KSH ${amount}`,
                duration: 8000,
            });
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } }, message?: string };
            console.error("M-Pesa Error:", err.response?.data || err.message);
            toast.error("Payment Failed", {
                id: toastId,
                description: err.response?.data?.error || "Could not reach Safaricom Gateway.",
            });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Finance Overview</h1>
                    <p className="text-sm text-muted-foreground mt-1">M-Pesa & Bank Payments</p>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="h-9 w-9 rounded-md border border-input bg-background flex items-center justify-center hover:bg-accent"
                        title="M-Pesa Settings"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as "KSH" | "USD" | "EUR" | "GBP")}
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

            {/* M-Pesa Phone Number Settings */}
            {showSettings && (
                <div className="rounded-lg border bg-card p-4 bg-green-500/5 border-green-500/20">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-500" />
                        M-Pesa Phone Number (Sandbox)
                    </h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="254712345678"
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        <button
                            onClick={() => setShowSettings(false)}
                            className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
                        >
                            Save
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Format: 254XXXXXXXXX (no + or leading 0). This number will receive the STK push.
                    </p>
                </div>
            )}

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
                        { id: "INV-004", client: "QuickMart", amount: 120500, status: "Pending", method: "M-Pesa" },
                    ].map((t) => (
                        <div key={t.id} className="flex justify-between items-center py-3 border-b last:border-0">
                            <div>
                                <div className="font-medium">{t.client}</div>
                                <div className="text-sm text-muted-foreground">{t.id} • {t.method}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold">{formatAmount(t.amount)}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${t.status === "Paid" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                    {t.status}
                                </span>
                                {t.method === "M-Pesa" && t.status === "Pending" && (
                                    <button
                                        onClick={() => handleMpesaPay(t.id, testAmount)}
                                        disabled={loadingId === t.id}
                                        className="h-8 px-3 rounded-full bg-green-600 text-white flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 text-sm"
                                        title={`Send KSH ${testAmount} STK Push`}
                                    >
                                        {loadingId === t.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Phone className="h-4 w-4" />
                                                <span>Pay</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Test Panel with Amount Input */}
            <div className="rounded-lg border bg-card p-6 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <h3 className="text-lg font-semibold mb-2">🧪 M-Pesa Sandbox Test</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Enter the amount and click the button to send an STK push to your phone.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    {/* Amount Input */}
                    <div className="flex-1 w-full sm:w-auto">
                        <label className="block text-sm font-medium mb-2">Amount (KSH)</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="1"
                                max="150000"
                                value={testAmount}
                                onChange={(e) => setTestAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="1"
                            />
                            {/* Quick amount buttons */}
                            <div className="flex gap-1">
                                {[1, 10, 100, 500].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setTestAmount(amt)}
                                        className={`px-3 py-2 rounded-md text-sm border ${testAmount === amt ? 'bg-green-600 text-white border-green-600' : 'border-input hover:bg-accent'}`}
                                    >
                                        {amt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={() => handleMpesaPay("TEST-001", testAmount)}
                        disabled={loadingId === "TEST-001"}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                    >
                        {loadingId === "TEST-001" ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Phone className="h-5 w-5" />
                                Send KSH {testAmount} to {phoneNumber.slice(-4)}
                            </>
                        )}
                    </button>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                    ⚠️ Wait 10-15 seconds between requests to avoid Safaricom rate limiting.
                </p>
            </div>
        </div>
    )
}
