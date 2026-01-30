import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import QRCode from "react-qr-code"

interface QRCodeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    docId: string
    docType: string
}

export function QRCodeDialog({ open, onOpenChange, docId, docType }: QRCodeDialogProps) {
    // Use absolute URL for the verification link (assuming base URL or generic fallback)
    // In a real app, use process.env.NEXT_PUBLIC_APP_URL
    const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify?docId=${docId}`

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Verification QR Code</DialogTitle>
                    <DialogDescription>
                        Scan this code to verify the authenticity of the {docType}.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <QRCode value={verificationUrl} size={200} />
                    </div>
                    <p className="text-sm text-muted-foreground break-all text-center">
                        {verificationUrl}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
