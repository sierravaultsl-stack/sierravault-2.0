"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function VerifySearch() {
    const [query, setQuery] = useState("")
    const router = useRouter()

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        // If query is a URL, try to extract docId (naive check)
        // If it's a full URL like .../dashboard/verify?docId=123, extract 123
        let docId = query.trim()
        try {
            const url = new URL(query)
            const idParam = url.searchParams.get("docId")
            if (idParam) docId = idParam
        } catch {
            // Not a URL, treat as ID
        }

        router.push(`/dashboard/verify?docId=${docId}`)
    }

    return (
        <form onSubmit={handleVerify} className="flex gap-2 w-full max-w-sm mx-auto mb-8">
            <Input
                placeholder="Enter Document ID or Link"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-background"
            />
            <Button type="submit" className="bg-teal hover:bg-teal-light text-white">
                Verify
            </Button>
        </form>
    )
}
