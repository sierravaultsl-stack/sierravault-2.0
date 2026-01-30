import { enforceRole } from "@/lib/rbac"
import dbConnect from "@/lib/dbConnect"
import Document from "@/models/Document"
import User from "@/models/User" // For typing if needed, mostly used in populate
import Organization from "@/models/Organization"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import VerifyButtons from "./verify-buttons" // Client component for interactions

export default async function VerificationPage() {
    // 1. Auth & Org Check
    const user = await enforceRole(["gov"])
    await dbConnect()

    const org = await Organization.findById(user.organizationId)
    const orgName = org?.name || "Government"
    const relevantTags = org?.tags || []

    // 2. Fetch Pending Documents directly from generic Document model
    // We fetch ALL pending for now to ensure visibility, or filter by type/tag if needed.
    // Given the strict requirement "Can view all citizen document requests", we might show all or filter.
    // "Government users... Can view all citizen document requests" -> ALL.
    // But "Smart Routing" implies filtering.
    // Let's filter if org tags exist, else show all (Admin view).

    const query: any = { status: "PENDING_VERIFICATION" }

    // If strict routing is desired:
    // if (relevantTags.length > 0) {
    //    query.type = { $in: relevantTags } 
    // }

    const pendingDocs = await Document.find(query)
        .populate('userId', 'email nin telephone')
        .sort({ createdAt: -1 })
        .lean()

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Verification Queue</h1>
                <p className="text-slate-500">
                    Reviewing requests for: <strong>{orgName}</strong>
                </p>
            </div>

            {pendingDocs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    <p className="text-slate-500">No pending documents found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingDocs.map((doc: any) => (
                        <Card key={doc._id.toString()} className="border-l-4 border-l-teal-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{doc.title}</h3>
                                        <p className="text-sm text-slate-500">
                                            Submitted by: <span className="font-medium">{doc.userId?.email || "Unknown"}</span>
                                            {doc.userId?.nin && ` (NIN: ${doc.userId.nin})`}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="outline">{doc.type}</Badge>
                                            {doc.metadata?.sizeBytes && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {(doc.metadata.sizeBytes / 1024).toFixed(1)} KB
                                                </Badge>
                                            )}
                                            {doc.metadata?.aiScore && (
                                                <Badge variant={doc.metadata.aiScore > 80 ? "default" : "destructive"} className="text-xs">
                                                    AI Score: {doc.metadata.aiScore}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <VerifyButtons docId={doc._id.toString()} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
