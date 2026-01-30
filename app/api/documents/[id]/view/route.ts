import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';
import { jwtVerify } from 'jose';
import AuditLog from '@/models/AuditLog';

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id: docId } = await params;

        // Auth Check: Needs Step-Up Token
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Step-Up Authentication Required' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let payload;
        try {
            const verified = await jwtVerify(token, SECRET_KEY);
            payload = verified.payload;
        } catch (e) {
            return NextResponse.json({ error: 'Invalid or Expired Step-Up Token' }, { status: 401 });
        }

        // @ts-ignore
        if (payload.scope !== 'document_access') {
            return NextResponse.json({ error: 'Insufficient Token Scope' }, { status: 403 });
        }

        const doc = await Document.findById(docId);
        if (!doc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        // RBAC: Can user view this? (Owner or Gov)
        // @ts-ignore
        const requestorId = payload.id;
        // @ts-ignore
        const requestorRole = payload.role;

        if (requestorRole !== 'citizen' && !requestorRole.startsWith('gov_')) {
            // Fallback safety
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (requestorRole === 'citizen' && doc.userId.toString() !== requestorId) {
            return NextResponse.json({ error: 'Forbidden: Not your document' }, { status: 403 });
        }

        // Audit Log Access
        await AuditLog.create({
            actorId: requestorId,
            action: 'ACCESS_GRANTED',
            targetId: doc._id,
            targetModel: 'Document',
            details: { method: 'Step-Up' }
        });

        // Return the secure URL (or signed URL in real implementation)
        return NextResponse.json({ url: doc.url });

    } catch (error) {
        console.error("Secure View Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
