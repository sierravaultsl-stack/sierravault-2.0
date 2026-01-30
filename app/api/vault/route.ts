import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import Vault from "@/models/Vault"

export async function GET() {
    await dbConnect()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let payload: any
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await User.findById(payload.id).populate("vaultId").lean()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    const vault = user.vaultId

    const normalizedDocs = vault?.documents?.map((doc: any) => ({
        _id: doc._id.toString(),
        label: doc.label || "Document",
        type: doc.type || "Other",
        uploadedAt: doc.uploadedAt,
        status: "verified",
        visibility: "private",
        aiScore: 0.85,
        txId: null, // Fill when blockchain is added
        blockchainHash: doc.blockchainHash || null,
        url: doc.url,
        mimeType: doc.type
    })) || []

    return NextResponse.json({ documents: normalizedDocs })
}

