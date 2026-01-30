import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';
import AuditLog from '@/models/AuditLog';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const verifierId = req.headers.get('x-user-id');
        const userRole = req.headers.get('x-user-role');

        if (userRole !== 'gov') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { documentId, decision, reason } = await req.json();
        // decision: 'APPROVE' | 'REJECT'

        if (!documentId || !decision) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const doc = await Document.findById(documentId);
        if (!doc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        if (doc.status !== 'PENDING_VERIFICATION') {
            return NextResponse.json({ error: 'Document is not pending verification' }, { status: 400 });
        }

        if (decision === 'APPROVE') {
            doc.status = 'VERIFIED';
            doc.govAudit.verifiedBy = verifierId;
            doc.govAudit.verifiedAt = new Date();
            await doc.save();
        } else if (decision === 'REJECT') {
            if (!reason) {
                return NextResponse.json({ error: 'Rejection reason is mandatory' }, { status: 400 });
            }

            // Delete the document as requested
            await Document.findByIdAndDelete(documentId);

            // Log the deletion (Metadata preserved in audit log)
            await AuditLog.create({
                actorId: verifierId,
                action: 'DOCUMENT_DELETED_REJECTED', // Distinct action
                targetId: documentId, // ID might not point to existing doc anymore, but preserved for history
                targetModel: 'Document',
                details: { decision, reason, originalTitle: doc.title, originalType: doc.type }
            });

            return NextResponse.json({ success: true, message: "Document rejected and deleted from vault" });
        } else {
            return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
        }

        // Audit Log
        await AuditLog.create({
            actorId: verifierId,
            action: decision === 'APPROVE' ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REJECTED',
            targetId: doc._id,
            targetModel: 'Document',
            details: { decision, reason }
        });

        return NextResponse.json({ success: true, document: doc });

    } catch (error) {
        console.error("Gov Verify Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
