import { getDocumentById } from "@/lib/getDocumentById"
import { DocumentActions } from "./document-actions"
import { FileText, Calendar, Shield, Hash } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface DocumentViewPageProps {
  params: Promise<{ id: string }>
}

export default async function DocumentViewPage({ params }: DocumentViewPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const document = await getDocumentById(id)

  if (!document) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold mb-4">Document not found</h1>
        <Link href="/dashboard/documents">
          <Button>Back to Documents</Button>
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(document.uploadedAt).toLocaleDateString("en-US", {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/dashboard/documents" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Documents
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{document.label}</h1>
            <Badge variant="outline" className="text-teal border-teal/30 bg-teal/5">
              {document.type}
            </Badge>
          </div>

          <div className="flex items-center text-muted-foreground mb-8">
            <Calendar className="h-4 w-4 mr-2" />
            Uploaded on {formattedDate}
          </div>

          <Card className="p-6 border-2 border-dashed border-muted bg-muted/5 min-h-[300px] flex flex-col items-center justify-center text-muted-foreground mb-8">
            <FileText className="h-16 w-16 mb-4 opacity-20" />
            <p>Document Preview</p>
            <p className="text-sm">(Click 'Open Document' to view full file)</p>
          </Card>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal" />
              Verification Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Authentication</span>
                <span className="font-medium text-green-600">Verified</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Blockchain Hash</span>
                <span className="font-mono text-xs break-all bg-secondary p-1 rounded">
                  {document.blockchainHash || "Pending Integration"}
                </span>
              </div>
            </div>
          </div>

          <DocumentActions
            docId={document._id}
            docType={document.type}
            docUrl={document.url}
          />
        </div>

        {/* Sidebar / Meta (Optional) */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Metadata</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Owner ID</span>
                <span className="font-mono">{document.userId || "Unknown"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Document ID</span>
                <span className="font-mono">{document._id}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">File Type</span>
                <span>PDF / Image</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

