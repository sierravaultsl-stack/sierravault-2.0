"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserPlus } from "lucide-react"

interface Organization {
    _id: string
    name: string
}

export function UserManagement({ organizations }: { organizations: Organization[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const data = {
            email: formData.get("email"),
            telephone: formData.get("telephone"),
            password: formData.get("password"),
            role: formData.get("role"),
            organizationId: formData.get("organizationId"),
        }

        try {
            const res = await fetch("/api/gov/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || "Failed to create user")
            }

            setOpen(false)
            window.location.reload()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Government User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Gov User</DialogTitle>
                    <DialogDescription>
                        Create a new Official, Associate, or Admin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="telephone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="telephone"
                                name="telephone"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                className="col-span-3"
                                defaultValue="password123"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <div className="col-span-3">
                                <Select name="role" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gov_admin">Gov Admin (Tier 1)</SelectItem>
                                        <SelectItem value="gov_official">Gov Official (Tier 2)</SelectItem>
                                        <SelectItem value="gov_associate">Gov Associate (Tier 3)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="organizationId" className="text-right">
                                Org
                            </Label>
                            <div className="col-span-3">
                                <Select name="organizationId">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem key={org._id} value={org._id}>
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
