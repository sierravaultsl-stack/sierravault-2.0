import { enforceRole } from "@/lib/rbac"
import User from "@/models/User"
import Organization from "@/models/Organization"
import dbConnect from "@/lib/dbConnect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, User as UserIcon } from "lucide-react"
import { UserManagement } from "./user-management"

export default async function UsersPage() {
    await enforceRole(["gov_admin"])
    await dbConnect()

    const users = await User.find({
        role: { $in: ["gov_admin", "gov_official", "gov_associate"] }
    })
        .sort({ createdAt: -1 })
        .populate("organizationId", "name")

    // Parse strict JSON for client component
    const plainOrgs = await Organization.find({}).select("name _id").lean()
    const organizations = JSON.parse(JSON.stringify(plainOrgs))

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Government Users</h1>
                    <p className="text-slate-500">Manage Officials and Associates access</p>
                </div>
                <UserManagement organizations={organizations} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user._id} className="border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                {user.role.replace("gov_", "").toUpperCase()}
                            </CardTitle>
                            <Shield className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-slate-900 break-words">{user.email}</div>
                            <div className="text-sm text-slate-500 mt-1">{user.telephone}</div>
                            <div className="flex items-center gap-2 mt-4">
                                {user.organizationId ? (
                                    <Badge variant="outline" className="text-xs">
                                        {/* @ts-ignore */}
                                        {user.organizationId.name}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-xs">
                                        No Org (Admin?)
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
