import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';

export async function GET(req: Request) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        const userRole = req.headers.get('x-user-role');

        if (!userId || userRole !== 'citizen') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const docs = await Document.find({ userId })
            .select('-url -govAudit.rejectionReason') // Hide sensitive URL and internal reasons until individual secure fetch
            .sort({ createdAt: -1 });

        return NextResponse.json({ documents: docs });

    } catch (error) {
        console.error("Citizen Docs Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
