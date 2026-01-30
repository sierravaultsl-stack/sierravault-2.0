"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, Search, CheckCircle, AlertCircle } from "lucide-react"

export default function IssueDocumentPage() {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Form State
    const [nin, setNin] = useState("")
    const [title, setTitle] = useState("")
    const [docType, setDocType] = useState("certificate")
    const [fileUrl, setFileUrl] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            let finalUrl = fileUrl;

            // Handle file upload if a file is selected
            if (selectedFile) {
                setUploading(true)
                const formData = new FormData()
                formData.append("file", selectedFile)

                const uploadRes = await fetch("/api/gov/upload", {
                    method: "POST",
                    body: formData
                })

                const uploadData = await uploadRes.json()
                if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to upload file")

                finalUrl = uploadData.url
                setUploading(false)
            }

            if (!finalUrl) {
                throw new Error("Please provide a file URL or upload a file.")
            }

            const res = await fetch("/api/gov/issue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nin,
                    title,
                    type: docType,
                    url: finalUrl,
                    metadata: {
                        tags: ["official", docType]
                    }
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Failed to issue document")

            setStatus({ type: 'success', message: "Document successfully issued to citizen's vault!" })
            // Reset crucial fields
            setTitle("")
            setNin("")
            setFileUrl("")
            setSelectedFile(null)
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message })
        } finally {
            setLoading(false)
            setUploading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Issue Official Document</h1>
                <p className="text-slate-500">Send certified documents directly to a citizen's secure vault.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Document Details</CardTitle>
                    <CardDescription>Enter the recipient's NIN and document information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {status.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <span className="text-sm font-medium">{status.message}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Citizen NIN (National ID Number)</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Enter 7 or 8 character NIN"
                                    className="pl-9"
                                    value={nin}
                                    onChange={(e) => setNin(e.target.value)}
                                    required
                                    minLength={7}
                                    maxLength={8}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Document Title</Label>
                                <Input
                                    placeholder="e.g. Bachelor of Science Degree"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Document Type</Label>
                                <Select value={docType} onValueChange={setDocType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="certificate">Certificate</SelectItem>
                                        <SelectItem value="license">License</SelectItem>
                                        <SelectItem value="id_card">ID Card</SelectItem>
                                        <SelectItem value="transcript">Academic Transcript</SelectItem>
                                        <SelectItem value="deed">Property Deed</SelectItem>
                                        <SelectItem value="birth_cert">Birth Certificate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label>Upload Document (Recommended)</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="cursor-pointer"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-500">Or provide URL</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>External File URL</Label>
                                <Input
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                    placeholder="https://..."
                                    disabled={!!selectedFile}
                                />
                                {selectedFile && (
                                    <p className="text-xs text-teal-600 font-medium italic">File selected. URL field disabled.</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            disabled={loading || uploading}
                        >
                            {loading || uploading ? (
                                uploading ? "Uploading Media..." : "Issuing..."
                            ) : (
                                <>
                                    <FileUp className="mr-2 h-4 w-4" /> Issue to Citizen
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
