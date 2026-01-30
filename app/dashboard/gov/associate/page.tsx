import { enforceRole } from "@/lib/rbac"
import { Upload, FileText, Building, History } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dbConnect from "@/lib/dbConnect"
import Organization from "@/models/Organization"

export default async function AssociateDashboardPage() {
    // 1. Enforce Tier 3 Security
    const user = await enforceRole(["gov_associate", "gov_official"]) // Tier 2 can also upload
    await dbConnect()

    // 2. Fetch Organization Details
    const organization = await Organization.findById(user.organizationId)

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{organization?.name || "Institution Portal"}</h1>
                    <p className="text-slate-500">Tier 3 Issuing Authority • ID: {organization?.code}</p>
                </div>
                <div className="bg-slate-200 text-slate-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    ASSOCIATE
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Upload Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-slate-200 shadow-xl bg-white">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 bg-teal/10 rounded-full flex items-center justify-center text-teal-600">
                                <Upload className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Issue New Document</h2>
                                <p className="text-sm text-slate-500">Securely upload and route to ministry</p>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Recipient NIN</label>
                                    <Input placeholder="SL-1234..." className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Document Type</label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        <option>Select Type...</option>
                                        <option>Degree Certificate</option>
                                        <option>Transcript</option>
                                        <option>Diploma</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Document Title</label>
                                <Input placeholder="e.g. B.Sc Computer Science 2024" className="bg-slate-50" />
                            </div>

                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-4" />
                                <p className="text-sm text-slate-600 font-medium">Drag and drop file here, or click to browse</p>
                                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                            </div>

                            <Button className="w-full bg-teal hover:bg-teal-light text-white h-12 text-lg">
                                Submit for Verification
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Sidebar / Recent Submissions */}
                <div className="space-y-6">
                    <Card className="p-6 border-slate-200 bg-white">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <History className="h-5 w-5 text-slate-500" />
                            Recent Submissions
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="h-8 w-8 bg-slate-100 rounded flex-shrink-0 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Student Transcript #{202400 + i}</p>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Pending Ministry</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-xs">View All History</Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
