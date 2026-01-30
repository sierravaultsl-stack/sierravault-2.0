import { enforceRole } from "@/lib/rbac"
import { ShieldAlert, Users, FileText, Activity, Building2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import Organization from "@/models/Organization"
import User from "@/models/User"
import AuditLog from "@/models/AuditLog"
import dbConnect from "@/lib/dbConnect"

export default async function AdminDashboardPage() {
    // 1. Enforce Tier 1 Security
    await enforceRole(["gov_admin"])
    await dbConnect()

    // 2. Fetch High-Level Stats
    const totalUsers = await User.countDocuments()
    const govUsers = await User.countDocuments({ role: { $in: ["gov_official", "gov_associate"] } })
    const totalOrgs = await Organization.countDocuments()
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(5).populate("actorId", "email role")

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">National Oversight Dashboard</h1>
                    <p className="text-slate-500">Tier 1 Administration • Republic of Sierra Leone</p>
                </div>
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    ADMIN ACCESS
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    icon={Users}
                    label="Total Citizens"
                    value={totalUsers}
                    change="+12% this week"
                    trend="up"
                />
                <StatsCard
                    icon={Building2}
                    label="Gov Entities"
                    value={totalOrgs}
                    change="Active Ministries"
                    trend="neutral"
                />
                <StatsCard
                    icon={ShieldAlert}
                    label="Gov Officials"
                    value={govUsers}
                    change="Across all tiers"
                    trend="up"
                />
                <StatsCard
                    icon={Activity}
                    label="System Health"
                    value="99.9%"
                    change="Operational"
                    trend="up"
                />
            </div>

            {/* Audit Logs Preview */}
            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="p-6 border-slate-200 shadow-sm">
                    <h3 className="tex-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-slate-500" />
                        Recent System Activity
                    </h3>
                    <div className="space-y-4">
                        {recentLogs.length === 0 && <p className="text-sm text-slate-500">No activity logs found.</p>}
                        {recentLogs.map((log: any) => (
                            <div key={log._id} className="flex items-start gap-4 p-3 bg-white border border-slate-100 rounded-lg">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {log.actorRole === "gov_admin" ? "A" : "U"}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{log.action}</p>
                                    <p className="text-xs text-slate-500">
                                        by <span className="font-mono">{log.actorId?.email || "Unknown"}</span> • {new Date(log.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 border-slate-200 shadow-sm">
                    <h3 className="tex-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="grid gap-4">
                        <a href="/dashboard/gov/admin/organizations" className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group block">
                            <h4 className="font-semibold text-slate-900 group-hover:text-teal-700">Manage Organizations</h4>
                            <p className="text-sm text-slate-500">Add or edit Ministries and Institutions</p>
                        </a>
                        <button className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group">
                            <h4 className="font-semibold text-slate-900 group-hover:text-teal-700">Audit Reports</h4>
                            <p className="text-sm text-slate-500">Generate compliance reports</p>
                        </button>
                        <a href="/dashboard/gov/admin/users" className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group block">
                            <h4 className="font-semibold text-slate-900 group-hover:text-teal-700">User Management</h4>
                            <p className="text-sm text-slate-500">Suspend or revoke government access</p>
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    )
}
