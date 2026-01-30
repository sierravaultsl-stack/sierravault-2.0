import Link from "next/link"
import { FileText, CheckCircle, Lock, Share2, ExternalLink, QrCode, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { QRCodeDialog } from "./qr-code-dialog"

interface DocumentCardProps {
  document: {
    _id: string // Changed from docId to match API response usually having _id
    label?: string
    type?: string
    uploadedAt?: string | Date
    url?: string
    status?: "pending" | "verified" | "rejected"
    visibility?: "private" | "shared"
    txId?: string
    onChainHash?: string
    aiScore?: number
  }
  onSecureView?: (id: string) => void
}

export function DocumentCard({ document, onSecureView }: DocumentCardProps) {
  const [showQR, setShowQR] = useState(false)

  const docId = document._id
  const docType = document.type || "Document"
  const uploadDate = document.uploadedAt ? new Date(document.uploadedAt) : new Date()
  const formattedDate = uploadDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })

  const aiPercent = document.aiScore ? Math.round(document.aiScore * 100) : 0

  // Use the ID for the detail view
  const detailUrl = `/dashboard/documents/${docId}`
  const fileUrl = document.url || "#"

  return (
    <>
      <Card className="relative border-border bg-card p-4 hover:shadow-lg transition-shadow">
        {/* Top: Type & Date */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
              <FileText className="h-6 w-6 text-teal" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">{document.label || docType}</h3>
              <p className="text-xs text-muted-foreground">Uploaded {formattedDate}</p>
            </div>
          </div>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={detailUrl} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (onSecureView) onSecureView(docId)
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4" /> Secure View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" /> Generate QR Code
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const link = `${window.location.origin}/dashboard/documents/${docId}`;
                  navigator.clipboard.writeText(link);
                }}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Copy Link
              </DropdownMenuItem>
              {document.txId && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`https://explorer.solana.com/tx/${document.txId}`}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" /> View on Blockchain
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 mb-3">
          {document.status === "verified" && (
            <span className="flex items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-xs text-teal font-medium">
              <CheckCircle className="h-3 w-3" /> Verified
            </span>
          )}
          {document.status === "pending" && (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-600 font-medium">Pending</span>
          )}
          {document.visibility === "private" && (
            <span className="flex items-center gap-1 rounded-full bg-muted/10 px-2 py-1 text-xs font-medium">
              <Lock className="h-3 w-3" /> Private
            </span>
          )}
          {document.visibility === "shared" && (
            <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
              <Share2 className="h-3 w-3" /> Shared
            </span>
          )}
        </div>

        {/* AI Authenticity */}
        {document.aiScore !== undefined && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">AI Authenticity Score</p>
            <div className="h-2 w-full rounded-full bg-muted/20">
              <div
                className="h-2 rounded-full bg-teal transition-all"
                style={{ width: `${aiPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* On-chain info */}
        {document.onChainHash && (
          <div className="mt-2 rounded-lg bg-purple-100 p-2 text-xs text-purple-700 break-all">
            <p className="font-medium">On-chain: {document.txId || "TX_DEMO_2025..."}</p>
            <p>Hash: {document.onChainHash}</p>
          </div>
        )}
      </Card>

      <QRCodeDialog
        open={showQR}
        onOpenChange={setShowQR}
        docId={docId}
        docType={docType}
      />
    </>
  )
}
