import { getDocumentById } from "@/lib/getDocumentById"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle, XCircle, FileText, Calendar, ShieldCheck, Download, Search, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const docId = resolvedParams.docId as string | undefined

  const cookieStore = await cookies()
  const token = cookieStore.get("token")

  // If user is logged in, redirect to dashboard verify
  if (token) {
    const redirectUrl = docId
      ? `/dashboard/verify?docId=${docId}`
      : `/dashboard/verify`
    redirect(redirectUrl)
  }

  let document = null
  let hasSearched = false

  if (docId) {
    hasSearched = true
    document = await getDocumentById(docId)
  }

  // Pre-calculate formatted date if doc exists
  const formattedDate = document ? new Date(document.uploadedAt).toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : null

  const isImage = document?.url?.match(/\.(jpeg|jpg|png|webp)$/i)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isLoggedIn={false} />

      <main className="flex-1 flex flex-col pt-20">
        <section className="bg-navy py-12 text-center text-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/10">
              <ShieldCheck className="h-8 w-8 text-teal" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl mb-4">Verify a Document</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Check the authenticity of any SierraVault document using its unique ID.
            </p>

            {/* Simple Form Implementation since this is a Server Component */}
            <form action="/verify" method="GET" className="max-w-md mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="docId"
                  defaultValue={docId || ""}
                  placeholder="Enter Document ID..."
                  className="pl-10 h-12 bg-card border-border"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 bg-teal hover:bg-teal-light text-navy-dark">
                Verify
              </Button>
            </form>
          </div>
        </section>

        <section className="flex-1 py-12 bg-navy-dark">
          <div className="container mx-auto px-4">

            {!hasSearched && (
              <div className="text-center text-muted-foreground mt-8">
                <p>Enter a ID above or scan a QR code to begin verification.</p>
              </div>
            )}

            {hasSearched && !document && (
              <Card className="max-w-md mx-auto p-8 text-center border-destructive/50 bg-destructive/5">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-bold text-destructive mb-2">Verification Failed</h2>
                <p className="text-muted-foreground">
                  We couldn't find a document with ID <span className="font-mono text-foreground">{docId}</span>.
                </p>
              </Card>
            )}

            {document && (
              <Card className="max-w-2xl mx-auto border-2 border-teal/20 shadow-2xl overflow-hidden bg-card">
                {/* Verified Header */}
                <div className="bg-teal/5 border-b border-teal/10 p-8 text-center relative">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal/10 mb-4">
                    <ShieldCheck className="h-10 w-10 text-teal" />
                  </div>
                  <h1 className="text-2xl font-bold text-teal-900">Authentic Document</h1>
                  <p className="text-teal-700 mt-2">Verified by SierraVault Infrastructure</p>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document Name</label>
                      <div className="flex items-center gap-2 text-lg font-medium text-foreground">
                        <FileText className="h-5 w-5 text-teal" />
                        {document.label}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document Type</label>
                      <div className="text-lg font-medium text-foreground">
                        {document.type}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issued / Uploaded</label>
                      <div className="flex items-center gap-2 text-lg font-medium text-foreground">
                        <Calendar className="h-5 w-5 text-teal" />
                        {formattedDate}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="text-sm font-semibold mb-3 text-foreground">Blockchain Verification</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs break-all border border-border">
                      <p className="text-muted-foreground mb-1">Document Hash:</p>
                      <div className="text-foreground font-semibold">
                        {document.blockchainHash || "0x7f83b1657ff1...b9a8 (Mock Hash)"}
                      </div>
                      <div className="mt-3 text-teal flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">On-chain Record Matched</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center pt-2 space-y-4">
                    {isImage && document.url && (
                      <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden border border-border shadow-sm">
                        <img
                          src={document.url}
                          alt="Document Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <Link href={document.url || "#"} target="_blank">
                      <Button className="bg-teal hover:bg-teal-light text-white gap-2">
                        <Download className="h-4 w-4" />
                        View Original Document
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-secondary/30 p-4 text-center text-xs text-muted-foreground">
                  Doc ID: {document._id}
                </div>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  )
}
