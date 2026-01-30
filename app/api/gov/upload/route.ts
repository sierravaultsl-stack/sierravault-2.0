// app/api/gov/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/superbaseClient";

export async function POST(req: NextRequest) {
    try {
        // Auth Check (Gov Only)
        const issuerRole = req.headers.get('x-user-role');
        if (issuerRole !== 'gov' && issuerRole !== 'official' && issuerRole !== 'associate') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Missing file" }, { status: 400 });
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate unique filename
        const filename = `gov/${Date.now()}-${file.name}`;

        // Upload to Supabase bucket "documents"
        const { data, error: uploadError } = await supabase.storage
            .from("documents")
            .upload(filename, buffer, { contentType: file.type });

        if (uploadError) {
            console.error("Supabase gov upload error:", uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/documents/${filename}`;

        return NextResponse.json({
            message: "Uploaded successfully",
            url: fileUrl,
            filename: file.name
        });

    } catch (err: any) {
        console.error("Gov Upload error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
