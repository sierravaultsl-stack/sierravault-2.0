"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VerifyButtons({ docId }: { docId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleAction(decision: 'APPROVE' | 'REJECT') {
        if (!confirm(`Are you sure you want to ${decision} this document?`)) return

        // For reject, simplistic prompt for now (in prod, use a modal)
        let reason = ""
        if (decision === 'REJECT') {
            reason = prompt("Enter rejection reason:") || "Requirements not met"
        }

        setLoading(true)
        try {
            const res = await fetch("/api/gov/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentId: docId, decision, reason })
            })

            if (!res.ok) {
                const data = await res.json()
                alert(data.error || "Action failed")
                return
            }

            router.refresh()
        } catch (e) {
            console.error(e)
            alert("Network error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={() => handleAction('REJECT')}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="mr-2 h-4 w-4" /> Reject</>}
            </Button>
            <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => handleAction('APPROVE')}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> Verify</>}
            </Button>
        </>
    )
}
