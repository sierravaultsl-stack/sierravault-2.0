import { enforceRole } from "@/lib/rbac"
import { CheckCircle, XCircle, FileText, Search, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dbConnect from "@/lib/dbConnect"
import Organization from "@/models/Organization"
import Vault from "@/models/Vault"

export default async function MinistryDashboardPage() {
    // 1. Enforce Tier 2 Security
    const user = await enforceRole(["gov_official"])
    await dbConnect()

    // 2. Fetch Organization Details
    const organization = await Organization.findById(user.organizationId)
    // In a real app, we would query *all* vaults for documents with status="pending" and tags IN organization.tags
    // For this demo, we mock the query structure logic

    // Mock Queue Data (Since we don't have a global document index in this schema, we usually index this)
    const verificationQueue = [
        { id: "doc_1", label: "B.Sc Computer Science", uploader: "University of Sierra Leone", date: "2024-10-15", status: "pending" },
        { id: "doc_2", label: "WASSCE Certificate", uploader: "WAEC", date: "2024-10-16", status: "pending" },
    ]

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{organization?.name || "Ministry Portal"}</h1>
                    <p className="text-slate-500">Tier 2 Verification Authority • ID: {organization?.code}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    OFFICIAL ACCESS
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6 border-l-4 border-l-yellow-400">
                    <p className="text-sm text-slate-500 font-semibold uppercase">Pending Verification</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">14</p>
                </Card>
                <Card className="p-6 border-l-4 border-l-green-500">
                    <p className="text-sm text-slate-500 font-semibold uppercase">Issued This Month</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">1,023</p>
                </Card>
                <Card className="p-6 border-l-4 border-l-red-500">
                    <p className="text-sm text-slate-500 font-semibold uppercase">Rejected</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">5</p>
                </Card>
            </div>

            {/* Verification Workspace */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-100/50 p-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="h-5 w-5" /> Verification Queue
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search NIN or Doc ID..." className="pl-9 h-9 w-64 bg-white" />
                        </div>
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {verificationQueue.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-700">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{item.label}</h3>
                                    <p className="text-sm text-slate-500">Uploaded by {item.uploader} • {item.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">
                                    Reject
                                </Button>
                                <Button size="sm" className="bg-teal hover:bg-teal-light text-white">
                                    Verify & Stamp
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {verificationQueue.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>All clear! No pending documents.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
