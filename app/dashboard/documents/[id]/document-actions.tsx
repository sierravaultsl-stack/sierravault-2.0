"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QRCodeDialog } from "@/components/qr-code-dialog"
import { QrCode, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

interface DocumentActionsProps {
    docId: string
    docType: string
    docUrl: string
}

import { StepUpModal } from "@/components/auth/step-up-modal"

export function DocumentActions({ docId, docType, docUrl }: DocumentActionsProps) {
    const [showQR, setShowQR] = useState(false)
    const [stepUpOpen, setStepUpOpen] = useState(false)

    // Handle Secure View
    const handleView = () => {
        setStepUpOpen(true)
    }

    const handleStepUpSuccess = async (token: string) => {
        try {
            const res = await fetch(`/api/documents/${docId}/view`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.url) {
                window.open(data.url, '_blank')
            } else {
                alert("Failed to retrieve document URL")
            }
        } catch (e) {
            alert("Secure view error")
        }
    }

    return (
        <div className="flex flex-wrap gap-3 mt-6">
            <StepUpModal
                open={stepUpOpen}
                onOpenChange={setStepUpOpen}
                onSuccess={handleStepUpSuccess}
            />

            <Button
                onClick={() => setShowQR(true)}
                className="bg-teal text-white hover:bg-teal-dark gap-2"
            >
                <QrCode className="h-4 w-4" />
                Generate QR Code
            </Button>

            <Button variant="outline" className="gap-2" onClick={handleView}>
                <Download className="h-4 w-4" />
                Open Securely
            </Button>

            <QRCodeDialog
                open={showQR}
                onOpenChange={setShowQR}
                docId={docId}
                docType={docType}
            />
        </div>
    )
}
