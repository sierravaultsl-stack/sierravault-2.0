import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { password } = await req.json();

        // Get User ID from headers (set by middleware)
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Issue Step-Up Token (Valid 5 mins)
        const stepUpToken = jwt.sign(
            { id: user._id, role: user.role, scope: 'document_access' },
            JWT_SECRET,
            { expiresIn: '5m' }
        );

        return NextResponse.json({ token: stepUpToken });

    } catch (error) {
        console.error("Step-Up Auth Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
