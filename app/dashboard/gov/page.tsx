import { enforceRole } from "@/lib/rbac"
import dbConnect from "@/lib/dbConnect"
import Document from "@/models/Document"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutDashboard, FileCheck, FilePlus, Users } from "lucide-react"
import Link from "next/link"

export default async function GovDashboardPage() {
    // Auth Check
    const user = await enforceRole(["gov"])
    await dbConnect()

    // Fetch Stats
    // 1. Pending Verification
    const pendingCount = await Document.countDocuments({ status: "PENDING_VERIFICATION" })

    // 2. Issued Today (approx)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const issuedCount = await Document.countDocuments({
        status: "ISSUED",
        "govAudit.issuedAt": { $gte: today }
    })

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Government Dashboard</h1>
                <p className="text-slate-500">Overview of verification queues and issuance.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/gov/verify">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pending Request</p>
                                <h3 className="text-3xl font-bold text-slate-900">{pendingCount}</h3>
                            </div>
                            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <FileCheck className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/gov/issue">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-teal-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Issued Today</p>
                                <h3 className="text-3xl font-bold text-slate-900">{issuedCount}</h3>
                            </div>
                            <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                <FilePlus className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
