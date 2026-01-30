import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';
import AuditLog from '@/models/AuditLog';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Auth Check (Gov Only) - Middleware guarantees x-user-role presence but we double check logic if needed
        const issuerId = req.headers.get('x-user-id');
        const issuerRole = req.headers.get('x-user-role');

        if (issuerRole !== 'gov') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { nin, type, title, url, metadata } = await req.json();

        if (!nin || !type || !title || !url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find Target Citizen
        const citizen = await User.findOne({ nin, /* role: 'citizen'*/ });
        if (!citizen) {
            return NextResponse.json({ error: 'Citizen with this NIN not found' }, { status: 404 });
        }

        // Create Document (State: ISSUED)
        const newDoc = await Document.create({
            userId: citizen._id,
            type,
            title,
            url,
            status: 'ISSUED',
            metadata: metadata || {},
            govAudit: {
                uploadedBy: issuerId,
                issuedAt: new Date(),
            }
        });

        // Audit Log
        await AuditLog.create({
            actorId: issuerId,
            action: 'DOCUMENT_ISSUED',
            targetId: newDoc._id,
            targetModel: 'Document',
            details: { nin, type, title }
        });

        return NextResponse.json({ success: true, document: newDoc });

    } catch (error) {
        console.error("Gov Issue Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
