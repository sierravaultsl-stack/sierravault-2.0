"use server"

import dbConnect from "@/lib/dbConnect"

import mongoose from "mongoose"

export async function getDocumentById(id: string) {
    try {
        await dbConnect()

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }

        const doc = await import("@/models/Document").then(mod => mod.default.findById(id).lean());

        if (!doc) {
            return null
        }

        return {
            _id: doc._id.toString(),
            label: doc.title, // Map title to label
            url: doc.url, // Note: This exposes URL to Server Component. Be careful passing to Client.
            type: doc.type,
            uploadedAt: doc.createdAt,
            blockchainHash: doc.metadata?.fileHash || null,
            userId: doc.userId?.toString() ?? null,
            status: doc.status
        }
    } catch (err) {
        console.error("getDocumentById error:", err)
        return null
    }
}
