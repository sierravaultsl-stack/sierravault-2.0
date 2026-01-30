// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import crypto from "crypto";

import { supabase } from "@/lib/superbaseClient";

// Connect to MongoDB helper
async function connectDB() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId") as string;
        const documentType = formData.get("documentType") as string;

        if (!file || !userId || !documentType) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate unique filename
        const filename = `${Date.now()}-${file.name}`;

        // Upload to Supabase bucket "documents"
        const { data, error: uploadError } = await supabase.storage
            .from("documents")
            .upload(filename, buffer, { contentType: file.type });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/documents/${filename}`;

        // Connect to MongoDB
        await connectDB();

        // Create new Document
        const newDoc = await import("@/models/Document").then(mod => mod.default.create({
            userId,
            type: documentType,
            title: file.name, // Fallback title
            url: fileUrl,
            status: 'PENDING_VERIFICATION',
            metadata: {
                mimeType: file.type,
                sizeBytes: buffer.length,
                fileHash: crypto.createHash("sha256").update(buffer).digest("hex")
            }
        }));

        // Blockchain hash (SHA256) - reusing what we calculated or just the one above
        const blockchainHash = newDoc.metadata.fileHash;

        return NextResponse.json({
            message: "Uploaded successfully",
            doc: newDoc,
            blockchainHash,
        });


    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
