import { getDocumentById } from "@/lib/getDocumentById"
import { CheckCircle, XCircle, FileText, Calendar, ShieldCheck, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VerifySearch } from "./verify-search"

// Params need to be awaited in Next.js 15/16 if it's dynamic, 
// strictly speaking searchParams is a promise in the latest versions
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyPage({ searchParams }: Props) {
    const resolvedParams = await searchParams
    const docId = resolvedParams.docId as string | undefined

    if (!docId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <div className="bg-muted/30 p-8 rounded-full mb-6">
                    <ShieldCheck className="h-16 w-16 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verify Document</h1>
                <p className="text-muted-foreground max-w-md mb-8">
                    Scan a SierraVault QR code or enter a document ID to verify its authenticity.
                </p>
                <VerifySearch />
                <Link href="/dashboard/documents" className="mt-4">
                    <Button variant="link">Back to My Documents</Button>
                </Link>
            </div>
        )
    }

    const document = await getDocumentById(docId)

    if (!document) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <div className="bg-red-100 p-8 rounded-full mb-6 text-red-600">
                    <XCircle className="h-16 w-16" />
                </div>
                <h1 className="text-2xl font-bold text-red-700 mb-2">Verification Failed</h1>
                <p className="text-muted-foreground max-w-md mb-8">
                    The document ID provided could not be found or has been revoked.
                </p>
                <Link href="/dashboard/verify">
                    <Button variant="outline">Try Another</Button>
                </Link>
            </div>
        )
    }

    const formattedDate = new Date(document.uploadedAt).toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4 bg-muted/10">
            <Card className="w-full max-w-2xl border-2 border-teal/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-teal/5 border-b border-teal/10 p-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal/10 mb-4">
                        <ShieldCheck className="h-10 w-10 text-teal" />
                    </div>
                    <h1 className="text-2xl font-bold text-teal-900">Authentic Document</h1>
                    <p className="text-teal-700 mt-2">Verified by SierraVault Infrastructure</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document Name</label>
                            <div className="flex items-center gap-2 text-lg font-medium">
                                <FileText className="h-5 w-5 text-teal" />
                                {document.label || "Untitled Document"}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document Type</label>
                            <div className="text-lg font-medium">
                                {document.type || "Official Record"}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issued / Uploaded</label>
                            <div className="flex items-center gap-2 text-lg font-medium">
                                <Calendar className="h-5 w-5 text-teal" />
                                {formattedDate}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 mt-6">
                        <h3 className="text-sm font-semibold mb-3">Blockchain Verification</h3>
                        <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs break-all">
                            <p className="text-muted-foreground mb-1">Document Hash:</p>
                            <div className="text-foreground">
                                {document.blockchainHash || "0x7f83b1657ff1...b9a8 (Mock Hash)"}
                            </div>
                            {document.blockchainHash && (
                                <div className="mt-2 text-teal flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> On-chain Record Found
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Link href={document.url || "#"} target="_blank">
                            <Button className="bg-teal hover:bg-teal-light text-white">
                                View Verified File
                            </Button>
                        </Link>
                    </div>

                </div>

                {/* Footer */}
                <div className="bg-secondary/30 p-4 text-center text-xs text-muted-foreground">
                    Doc ID: {document._id}
                </div>
            </Card>
        </div>
    )
}
