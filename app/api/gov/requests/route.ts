import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Gov Only Check
        const userRole = req.headers.get('x-user-role');
        if (!userRole?.startsWith('gov_')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch PENDING documents
        // Populate user details (NIN, name would be good but email/tel for now as per schema)
        const pendingDocs = await Document.find({ status: 'PENDING_VERIFICATION' })
            .populate('userId', 'email telephone nin')
            .sort({ createdAt: -1 });

        return NextResponse.json({ data: pendingDocs });

    } catch (error) {
        console.error("Gov Requests Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
