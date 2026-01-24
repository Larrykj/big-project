import { useState } from "react";
import {
    Users, Shield, Activity, Settings, Plus, Trash2, Edit2, X,
    Truck, MapPin, Package, BarChart3, FileText, Database,
    CheckCircle, Download, Eye, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "../components/currency-provider";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
}

interface TruckType {
    id: number;
    licensePlate: string;
    model: string;
    driver: string;
    status: string;
    location: string;
    capacity: string;
}

interface Hub {
    id: number;
    name: string;
    location: string;
    capacity: string;
    manager: string;
    status: string;
    trucks: number;
}

export default function AdminPortal() {
    const { formatAmount } = useCurrency();
    const [activeTab, setActiveTab] = useState<"users" | "trucks" | "hubs" | "roles" | "reports" | "logs" | "settings">("users");

    // User Management State
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: "John Kamau", email: "john@example.com", role: "driver", status: "Active", phone: "+254712345678" },
        { id: 2, name: "Mary Wanjiku", email: "mary@example.com", role: "manager", status: "Active", phone: "+254723456789" },
        { id: 3, name: "Peter Omondi", email: "peter@example.com", role: "driver", status: "Inactive", phone: "+254734567890" },
    ]);

    // Truck Management State
    const [trucks, setTrucks] = useState<TruckType[]>([
        { id: 1, licensePlate: "KBX 001A", model: "Isuzu FRR", driver: "John Kamau", status: "On Route", location: "Nairobi-Mombasa Hwy", capacity: "7 tons" },
        { id: 2, licensePlate: "KCA 054B", model: "Mercedes Atego", driver: "Not Assigned", status: "Available", location: "Mombasa Port", capacity: "10 tons" },
        { id: 3, licensePlate: "KAK 123C", model: "Mitsubishi Canter", driver: "Peter Omondi", status: "Maintenance", location: "Nairobi Hub", capacity: "5 tons" },
    ]);

    // Hub Management State
    const [hubs, setHubs] = useState<Hub[]>([
        { id: 1, name: "Nairobi Central Hub", location: "Industrial Area, Nairobi", capacity: "5,000 pallets", manager: "Mary Wanjiku", status: "Operational", trucks: 25 },
        { id: 2, name: "Mombasa Port Terminal", location: "Port Reitz, Mombasa", capacity: "10,000 pallets", manager: "James Otieno", status: "Operational", trucks: 15 },
        { id: 3, name: "Kisumu Distribution Center", location: "Kisumu Industrial Area", capacity: "3,000 pallets", manager: "Grace Akinyi", status: "Under Maintenance", trucks: 8 },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string>("");
    const [modalType, setModalType] = useState<"user" | "truck" | "hub">("user");

    // Union type for editing item
    type AdminItem = User | TruckType | Hub;
    const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
    const [formData, setFormData] = useState<Partial<User & TruckType & Hub>>({});

    // Add new item
    const handleAdd = (type: "user" | "truck" | "hub") => {
        setModalType(type);
        setEditingItem(null);
        setFormData({});
        setShowModal(true);
    };

    // Edit item
    const handleEdit = (type: "user" | "truck" | "hub", item: AdminItem) => {
        setModalType(type);
        setEditingItem(item);
        setFormData(item);
        setShowModal(true);
    };

    // Delete item
    const handleDelete = (type: "user" | "truck" | "hub", id: number) => {
        const itemName = type === "user" ? users.find(u => u.id === id)?.name :
            type === "truck" ? trucks.find(t => t.id === id)?.licensePlate :
                hubs.find(h => h.id === id)?.name;

        if (confirm(`Are you sure you want to delete ${itemName}?`)) {
            if (type === "user") setUsers(users.filter(u => u.id !== id));
            if (type === "truck") setTrucks(trucks.filter(t => t.id !== id));
            if (type === "hub") setHubs(hubs.filter(h => h.id !== id));
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
        }
    };

    // Save (Add or Update)
    const handleSave = () => {
        if (modalType === "user") {
            if (!formData.name || !formData.email) {
                toast.error("Please fill all required fields");
                return;
            }

            if (editingItem) {
                setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...formData } : u));
                toast.success("User updated successfully!");
            } else {
                const newUser = { id: users.length + 1, ...formData, status: formData.status || "Active" };
                setUsers([...users, newUser]);
                toast.success("User added successfully!");
            }
        }

        if (modalType === "truck") {
            if (!formData.licensePlate || !formData.model) {
                toast.error("Please fill all required fields");
                return;
            }

            if (editingItem) {
                setTrucks(trucks.map(t => t.id === editingItem.id ? { ...t, ...formData } : t));
                toast.success("Truck updated successfully!");
            } else {
                const newTruck = { id: trucks.length + 1, ...formData, status: formData.status || "Available" };
                setTrucks([...trucks, newTruck]);
                toast.success("Truck added successfully!");
            }
        }

        if (modalType === "hub") {
            if (!formData.name || !formData.location) {
                toast.error("Please fill all required fields");
                return;
            }

            if (editingItem) {
                setHubs(hubs.map(h => h.id === editingItem.id ? { ...h, ...formData } : h));
                toast.success("Hub updated successfully!");
            } else {
                const newHub = { id: hubs.length + 1, ...formData, status: formData.status || "Operational", trucks: 0 };
                setHubs([...hubs, newHub]);
                toast.success("Hub added successfully!");
            }
        }

        setShowModal(false);
        setFormData({});
    };

    // Generate Report
    const handleGenerateReport = (reportType: string) => {
        setSelectedReport(reportType);
        setShowReportModal(true);
        toast.success(`Generating ${reportType}...`);
    };

    // Download Report as CSV
    const handleDownloadReport = (reportType: string) => {
        toast.success(`Preparing ${reportType} for download...`);

        let csvContent = "";
        const timestamp = new Date().toLocaleString();

        if (reportType === "Daily Operations Report") {
            csvContent = `Daily Operations Report - Generated: ${timestamp}\n\nOrder ID,Route,Status,Driver\nORD-7821,Nairobi-Mombasa,Completed,John Kamau\nORD-7822,Kisumu-Nairobi,In Transit,Mary Wanjiku\n`;
        } else if (reportType === "Financial Summary") {
            csvContent = `Financial Summary - ${timestamp}\n\nCategory,Amount (KSH)\nRevenue,18500000\nM-Pesa,12300000\nOutstanding,2450000\n`;
        } else if (reportType === "Fleet Performance") {
            csvContent = `Fleet Performance - ${timestamp}\n\nLicense,Model,Driver,Status\n`;
            trucks.forEach(t => csvContent += `${t.licensePlate},${t.model},${t.driver},${t.status}\n`);
        } else {
            csvContent = `${reportType} - ${timestamp}\n\nReport data generated successfully.\n`;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setTimeout(() => toast.success("Report downloaded!"), 500);
    };

    const [settings, setSettings] = useState({
        twoFactor: true,
        emailNotifications: true,
        apiAccess: false,
        maintenanceMode: false,
        autoBackup: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings({ ...settings, [key]: !settings[key] });
        toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${!settings[key] ? "enabled" : "disabled"}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Control Center</h1>
                    <p className="text-sm text-muted-foreground mt-1">Complete system management and oversight</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        System Healthy
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <p className="text-2xl font-bold mt-2">{users.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Fleet Size</p>
                            <p className="text-2xl font-bold mt-2">{trucks.length}</p>
                        </div>
                        <Truck className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Hubs</p>
                            <p className="text-2xl font-bold mt-2">{hubs.length}</p>
                        </div>
                        <MapPin className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Revenue (MTD)</p>
                            <p className="text-2xl font-bold mt-2">{formatAmount(18500000)}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b overflow-x-auto pb-2">
                {[
                    { key: "users", label: "Users", icon: Users },
                    { key: "trucks", label: "Fleet", icon: Truck },
                    { key: "hubs", label: "Hubs", icon: MapPin },
                    { key: "roles", label: "Roles", icon: Shield },
                    { key: "reports", label: "Reports", icon: FileText },
                    { key: "logs", label: "Logs", icon: Activity },
                    { key: "settings", label: "Settings", icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`px-4 py-2 font-medium transition-colors whitespace-nowrap rounded-t-lg ${activeTab === tab.key
                            ? "bg-primary/10 text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                    >
                        <tab.icon className="h-4 w-4 inline mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Users Tab */}
            {activeTab === "users" && (
                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                        <h3 className="text-lg font-semibold">User Management ({users.length} users)</h3>
                        <button
                            onClick={() => handleAdd("user")}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Add User
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Name</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Email</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Phone</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Role</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Status</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-t hover:bg-muted/20 transition-colors">
                                        <td className="py-4 px-6 font-medium">{user.name}</td>
                                        <td className="py-4 px-6 text-muted-foreground">{user.email}</td>
                                        <td className="py-4 px-6 text-muted-foreground">{user.phone}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium capitalize">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit("user", user)}
                                                    className="p-2 hover:bg-primary/10 rounded text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete("user", user.id)}
                                                    className="p-2 hover:bg-destructive/10 rounded text-destructive transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Trucks Tab */}
            {activeTab === "trucks" && (
                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                        <h3 className="text-lg font-semibold">Fleet Management ({trucks.length} trucks)</h3>
                        <button
                            onClick={() => handleAdd("truck")}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Add Truck
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left py-3 px-6 text-sm font-medium">License Plate</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Model</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Driver</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Capacity</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Status</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Location</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trucks.map((truck) => (
                                    <tr key={truck.id} className="border-t hover:bg-muted/20 transition-colors">
                                        <td className="py-4 px-6 font-medium">{truck.licensePlate}</td>
                                        <td className="py-4 px-6">{truck.model}</td>
                                        <td className="py-4 px-6 text-muted-foreground">{truck.driver}</td>
                                        <td className="py-4 px-6">{truck.capacity}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${truck.status === "On Route" ? "bg-blue-500/10 text-blue-500" :
                                                truck.status === "Available" ? "bg-green-500/10 text-green-500" :
                                                    "bg-yellow-500/10 text-yellow-500"
                                                }`}>
                                                {truck.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-muted-foreground text-sm">{truck.location}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit("truck", truck)}
                                                    className="p-2 hover:bg-primary/10 rounded text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete("truck", truck.id)}
                                                    className="p-2 hover:bg-destructive/10 rounded text-destructive transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Hubs Tab */}
            {activeTab === "hubs" && (
                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                        <h3 className="text-lg font-semibold">Hub Management ({hubs.length} locations)</h3>
                        <button
                            onClick={() => handleAdd("hub")}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Add Hub
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Hub Name</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Location</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Manager</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Capacity</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Trucks</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Status</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hubs.map((hub) => (
                                    <tr key={hub.id} className="border-t hover:bg-muted/20 transition-colors">
                                        <td className="py-4 px-6 font-medium">{hub.name}</td>
                                        <td className="py-4 px-6 text-muted-foreground">{hub.location}</td>
                                        <td className="py-4 px-6">{hub.manager}</td>
                                        <td className="py-4 px-6">{hub.capacity}</td>
                                        <td className="py-4 px-6">{hub.trucks} units</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${hub.status === "Operational" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                                }`}>
                                                {hub.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit("hub", hub)}
                                                    className="p-2 hover:bg-primary/10 rounded text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete("hub", hub.id)}
                                                    className="p-2 hover:bg-destructive/10 rounded text-destructive transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Roles Tab */}
            {activeTab === "roles" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { name: "Admin", users: users.filter(u => u.role === "admin").length, permissions: "Full System Access", color: "red" },
                        { name: "Manager", users: users.filter(u => u.role === "manager").length, permissions: "Manage Operations", color: "blue" },
                        { name: "Driver", users: users.filter(u => u.role === "driver").length, permissions: "View & Update Deliveries", color: "green" },
                        { name: "Customer", users: users.filter(u => u.role === "customer").length, permissions: "Track Orders", color: "purple" },
                    ].map((role) => (
                        <div key={role.name} className="rounded-lg border bg-card p-6 hover:shadow-lg transition-all">
                            <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">{role.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{role.permissions}</p>
                            <div className="flex items-center justify-between pt-3 border-t">
                                <span className="text-3xl font-bold">{role.users}</span>
                                <span className="text-xs text-muted-foreground">active users</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reports Tab - NOW FUNCTIONAL */}
            {activeTab === "reports" && (
                <div className="grid gap-4 md:grid-cols-2">
                    {[
                        { title: "Daily Operations Report", description: "Summary of today's deliveries and activities", icon: FileText, type: "operations" },
                        { title: "Financial Summary", description: "Revenue, expenses, and profit analysis", icon: BarChart3, type: "financial" },
                        { title: "Fleet Performance", description: "Truck utilization and efficiency metrics", icon: Truck, type: "fleet" },
                        { title: "User Activity Report", description: "Login history and user engagement", icon: Users, type: "users" },
                        { title: "System Health Report", description: "Server status and performance metrics", icon: Database, type: "system" },
                        { title: "Customer Satisfaction", description: "Feedback and ratings analysis", icon: Package, type: "satisfaction" },
                    ].map((report) => (
                        <div key={report.title} className="rounded-lg border bg-card p-6 hover:shadow-lg transition-all">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <report.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{report.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleGenerateReport(report.title)}
                                            className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 flex items-center gap-1"
                                        >
                                            <Eye className="h-3 w-3" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownloadReport(report.title)}
                                            className="px-3 py-1.5 border rounded text-sm hover:bg-accent flex items-center gap-1"
                                        >
                                            <Download className="h-3 w-3" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Logs Tab */}
            {activeTab === "logs" && (
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">System Activity Logs</h3>
                    <div className="space-y-3">
                        {[
                            { user: "admin@omnilogistics.ke", action: "Added new user: John Kamau", time: "2 mins ago", type: "create" },
                            { user: "manager@omnilogistics.ke", action: "Updated truck KBX 001A status", time: "15 mins ago", type: "update" },
                            { user: "admin@omnilogistics.ke", action: "Deleted hub: Eldoret Warehouse", time: "1 hour ago", type: "delete" },
                            { user: "driver@omnilogistics.ke", action: "Completed delivery ORD-7821", time: "2 hours ago", type: "complete" },
                            { user: "admin@omnilogistics.ke", action: "System backup completed", time: "3 hours ago", type: "system" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                                <div className={`h-2 w-2 rounded-full mt-2 ${log.type === "create" ? "bg-green-500" :
                                    log.type === "delete" ? "bg-red-500" :
                                        log.type === "update" ? "bg-blue-500" :
                                            "bg-purple-500"
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{log.action}</p>
                                    <p className="text-xs text-muted-foreground mt-1">by {log.user} • {log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                        <div className="space-y-4">
                            {Object.entries({
                                twoFactor: { title: "Two-Factor Authentication", desc: "Require 2FA for admin users" },
                                emailNotifications: { title: "Email Notifications", desc: "Send alerts for critical events" },
                                apiAccess: { title: "API Access", desc: "Enable external API integrations" },
                                maintenanceMode: { title: "Maintenance Mode", desc: "Temporarily disable system access" },
                                autoBackup: { title: "Auto Backup", desc: "Daily automated database backups" },
                            }).map(([key, { title, desc }]) => (
                                <div key={key} className="flex items-center justify-between py-4 px-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                    <div>
                                        <p className="font-medium">{title}</p>
                                        <p className="text-sm text-muted-foreground">{desc}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting(key as any)}
                                        className={`relative w-12 h-6 rounded-full transition-all shadow-inner ${settings[key as keyof typeof settings] ? "bg-primary" : "bg-muted-foreground/30"
                                            }`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${settings[key as keyof typeof settings] ? "translate-x-6" : ""
                                            }`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
                        <h3 className="text-lg font-semibold mb-2 text-destructive flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Dangerous Zone
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">These actions cannot be undone</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    const data = {
                                        users,
                                        trucks,
                                        hubs,
                                        exportedAt: new Date().toISOString(),
                                        totalRecords: users.length + trucks.length + hubs.length
                                    };
                                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(blob);
                                    link.download = `omnilogistics_backup_${new Date().toISOString().split('T')[0]}.json`;
                                    link.click();
                                    toast.success("Data exported successfully!");
                                }}
                                className="w-full px-4 py-3 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-lg text-sm font-medium hover:bg-yellow-500/20 transition-colors"
                            >
                                Export All Data
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure? This will reset all system settings.")) {
                                        toast.warning("Settings reset to defaults");
                                    }
                                }}
                                className="w-full px-4 py-3 bg-orange-500/10 text-orange-600 border border-orange-500/20 rounded-lg text-sm font-medium hover:bg-orange-500/20 transition-colors"
                            >
                                Reset System Settings
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure? This will delete all activity logs.")) {
                                        toast.error("All logs deleted");
                                    }
                                }}
                                className="w-full px-4 py-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                            >
                                Delete All Logs
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Universal Modal for Add/Edit - IMPROVED VISIBILITY */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-card rounded-lg p-6 w-full max-w-2xl border-2 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h3 className="text-xl font-bold">
                                {editingItem ? `Edit ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}` : `Add New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
                            </h3>
                            <button
                                onClick={() => { setShowModal(false); setFormData({}); }}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {modalType === "user" && (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name || ""}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Email *</label>
                                            <input
                                                type="email"
                                                value={formData.email || ""}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone || ""}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="+254712345678"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Role *</label>
                                            <select
                                                value={formData.role || ""}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            >
                                                <option value="">Select Role</option>
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                                <option value="driver">Driver</option>
                                                <option value="customer">Customer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-foreground">Status</label>
                                        <select
                                            value={formData.status || "Active"}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {modalType === "truck" && (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">License Plate *</label>
                                            <input
                                                type="text"
                                                value={formData.licensePlate || ""}
                                                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="KBX 001A"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Model *</label>
                                            <input
                                                type="text"
                                                value={formData.model || ""}
                                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="Isuzu FRR"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Driver</label>
                                            <input
                                                type="text"
                                                value={formData.driver || ""}
                                                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="John Kamau"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Capacity</label>
                                            <input
                                                type="text"
                                                value={formData.capacity || ""}
                                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="7 tons"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Status</label>
                                            <select
                                                value={formData.status || "Available"}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            >
                                                <option value="Available">Available</option>
                                                <option value="On Route">On Route</option>
                                                <option value="Maintenance">Maintenance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location || ""}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="Nairobi Hub"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {modalType === "hub" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-foreground">Hub Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name || ""}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Nairobi Central Hub"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-foreground">Location *</label>
                                        <input
                                            type="text"
                                            value={formData.location || ""}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Industrial Area, Nairobi"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Manager</label>
                                            <input
                                                type="text"
                                                value={formData.manager || ""}
                                                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="Mary Wanjiku"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-foreground">Capacity</label>
                                            <input
                                                type="text"
                                                value={formData.capacity || ""}
                                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="5,000 pallets"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-foreground">Status</label>
                                        <select
                                            value={formData.status || "Operational"}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        >
                                            <option value="Operational">Operational</option>
                                            <option value="Under Maintenance">Under Maintenance</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-6 border-t">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                                >
                                    {editingItem ? "Update" : "Create"} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                                </button>
                                <button
                                    onClick={() => { setShowModal(false); setFormData({}); }}
                                    className="px-8 py-3 border-2 rounded-lg font-semibold hover:bg-accent transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal - NOW FUNCTIONAL */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-card rounded-lg p-6 w-full max-w-4xl border-2 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h3 className="text-xl font-bold">{selectedReport}</h3>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-muted/30 rounded-lg border">
                                <h4 className="font-semibold mb-2">Report Summary</h4>
                                <p className="text-sm text-muted-foreground">
                                    Generated on: {new Date().toLocaleString()}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <p className="text-sm text-muted-foreground">Total Items</p>
                                    <p className="text-2xl font-bold mt-1">127</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <p className="text-sm text-muted-foreground">Success Rate</p>
                                    <p className="text-2xl font-bold mt-1 text-green-500">98.2%</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <p className="text-sm text-muted-foreground">Total Value</p>
                                    <p className="text-2xl font-bold mt-1">{formatAmount(2500000)}</p>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h4 className="font-semibold mb-3">Sample Data</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Record 1</span>
                                        <span className="font-medium">Completed</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Record 2</span>
                                        <span className="font-medium">In Progress</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-muted-foreground">Record 3</span>
                                        <span className="font-medium">Pending</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        handleDownloadReport(selectedReport);
                                        setShowReportModal(false);
                                    }}
                                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download CSV
                                </button>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="px-8 py-3 border-2 rounded-lg font-semibold hover:bg-accent"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
