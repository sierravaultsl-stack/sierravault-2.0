import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Document from '@/models/Document';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        const userRole = req.headers.get('x-user-role');

        if (userRole !== 'citizen') {
            return NextResponse.json({ error: 'Forbidden: Citizens Only' }, { status: 403 });
        }

        const { type, title } = await req.json();

        // Check if citizen already has a pending/verified doc of this type? 
        // Maybe allow multiple, but usually 1 active Request.
        // For now, allow simple request creation.

        const newDoc = await Document.create({
            userId,
            type,
            title,
            status: 'PENDING_VERIFICATION', // Waiting for Gov to issue/verify
            // No URL yet
        });

        return NextResponse.json({ success: true, document: newDoc });

    } catch (error) {
        console.error("Citizen Request Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
