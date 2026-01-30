"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RequestDocumentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Form
    const [type, setType] = useState("")
    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            const res = await fetch("/api/citizen/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, title, notes })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Failed to submit request")

            setStatus({ type: 'success', message: "Request submitted to Government. Track it in your vault." })
            setTimeout(() => router.push("/dashboard/documents"), 2000)
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Request Document</CardTitle>
                    <CardDescription>Need a certified copy or a new document? Submit a request here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {status.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <span className="text-sm font-medium">{status.message}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Document Type</Label>
                            <Select value={type} onValueChange={setType} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Birth Certificate">Birth Certificate</SelectItem>
                                    <SelectItem value="National ID">National ID</SelectItem>
                                    <SelectItem value="Passport">Passport</SelectItem>
                                    <SelectItem value="Land Deed">Land Deed</SelectItem>
                                    <SelectItem value="Marriage Certificate">Marriage Certificate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Purpose / Title</Label>
                            <Input
                                placeholder="e.g. Certified Copy for Visa Application"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Additional Notes (Optional)</Label>
                            <Textarea
                                placeholder="Any specific details associated with your request..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? "Submitting..." : (
                                <>
                                    <FileUp className="mr-2 h-4 w-4" /> Submit Request
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
