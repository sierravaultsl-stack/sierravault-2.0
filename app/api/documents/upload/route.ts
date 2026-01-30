import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';
import AuditLog from '@/models/AuditLog';

// Mock AI Analysis Function
const runAIAnalysis = (type: string, fileData: any) => {
    // In production, this would call a Python service or Cloud Vision API
    return {
        aiScore: Math.floor(Math.random() * 20) + 80, // Random 80-99
        flags: [],
        explanation: "Document appears authentic. Layout matches standard templates."
    };
};

export async function POST(req: Request) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        const userRole = req.headers.get('x-user-role');

        if (userRole !== 'citizen') {
            return NextResponse.json({ error: 'Forbidden: Citizens Only' }, { status: 403 });
        }

        const { type, title, url, sizeBytes, mimeType } = await req.json();

        if (!type || !title || !url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // AI Analysis
        const aiResult = runAIAnalysis(type, { url });

        const newDoc = await Document.create({
            userId,
            type,
            title,
            url, // This is the user uploaded URL (e.g. S3/Blob)
            status: 'PENDING_VERIFICATION',
            metadata: {
                aiScore: aiResult.aiScore,
                aiFlags: aiResult.flags,
                aiExplanation: aiResult.explanation,
                sizeBytes,
                mimeType
            }
        });

        await AuditLog.create({
            actorId: userId,
            action: 'DOCUMENT_UPLOAD',
            targetId: newDoc._id,
            targetModel: 'Document',
            details: { type, title, sizeBytes }
        });

        return NextResponse.json({ success: true, document: newDoc });

    } catch (error) {
        console.error("Citizen Upload Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
