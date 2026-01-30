import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";

import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id).lean();
        if (!user) return NextResponse.json({ user: null }, { status: 404 });

        // Fetch documents from new Document model
        const documents = await import("@/models/Document").then(mod => mod.default.find({ userId: user._id }).sort({ createdAt: -1 }).lean());

        // Fetch NIN record if user has a NIN
        let ninRecord = null;
        if (user.nin) {
            ninRecord = await import("@/models/NIN").then(mod => mod.default.findOne({ nin: user.nin }).lean());
        }

        return NextResponse.json({
            user: { ...user, documents, ninRecord },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
