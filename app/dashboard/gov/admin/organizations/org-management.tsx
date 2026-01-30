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
import { Plus } from "lucide-react"

export function OrgManagement() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const data = {
            name: formData.get("name"),
            code: formData.get("code"),
            type: formData.get("type"),
            tier: Number(formData.get("tier")),
        }

        try {
            const res = await fetch("/api/gov/organizations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || "Failed to create organization")
            }

            setOpen(false)
            window.location.reload() // Simple refresh to show new data
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
                    <Plus className="mr-2 h-4 w-4" />
                    Add Organization
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Organization</DialogTitle>
                    <DialogDescription>
                        Create a new Ministry, Agency, or Institution.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                className="col-span-3"
                                placeholder="Ministry of ..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="code"
                                name="code"
                                className="col-span-3"
                                placeholder="MOX"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <div className="col-span-3">
                                <Select name="type" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ministry">Ministry</SelectItem>
                                        <SelectItem value="agency">Agency</SelectItem>
                                        <SelectItem value="institution">Institution</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tier" className="text-right">
                                Tier
                            </Label>
                            <div className="col-span-3">
                                <Select name="tier" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Tier 1 (Admin)</SelectItem>
                                        <SelectItem value="2">Tier 2 (Official)</SelectItem>
                                        <SelectItem value="3">Tier 3 (Associate)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Organization"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
