import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        const userRole = req.headers.get('x-user-role');

        if (!userId || userRole !== 'citizen') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type, title, notes } = await req.json();

        if (!type || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create Request (State: REQUESTED)
        const newDoc = await Document.create({
            userId,
            type,
            title,
            status: 'REQUESTED',
            metadata: {
                aiExplanation: notes || "User request"
            }
        });

        return NextResponse.json({ success: true, document: newDoc });

    } catch (error) {
        console.error("Citizen Request Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
