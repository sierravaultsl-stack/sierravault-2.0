import { enforceRole } from "@/lib/rbac"
import Organization from "@/models/Organization"
import dbConnect from "@/lib/dbConnect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import { OrgManagement } from "./org-management"

export default async function OrganizationsPage() {
    await enforceRole(["gov_admin"])
    await dbConnect()

    const orgs = await Organization.find({}).sort({ createdAt: -1 })

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Organizations</h1>
                    <p className="text-slate-500">Manage Ministries, Agencies, and Institutions</p>
                </div>
                <OrgManagement />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orgs.map((org) => (
                    <Card key={org._id} className="border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                {org.type.toUpperCase()} • Tier {org.tier}
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{org.name}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                    {org.code}
                                </Badge>
                                {org.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
