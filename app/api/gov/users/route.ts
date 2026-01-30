import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Vault from "@/models/Vault";
import { enforceRole } from "@/lib/rbac";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
    try {
        await enforceRole(["gov_admin"]);
        await dbConnect();

        // Get government users only
        const users = await User.find({
            role: { $in: ["gov_admin", "gov_official", "gov_associate"] }
        })
            .select("-password")
            .populate("organizationId", "name code")
            .sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await enforceRole(["gov_admin"]);
        await dbConnect();

        const data = await req.json();

        // Basic validation
        if (!data.email || !data.password || !data.telephone || !data.role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Ensure role is a government role
        if (!["gov_admin", "gov_official", "gov_associate"].includes(data.role)) {
            return NextResponse.json({ error: "Invalid government role." }, { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // Create empty vault for new user
        const vault = await Vault.create({ documents: [] });

        const newUser = await User.create({
            email: data.email,
            password: hashedPassword,
            telephone: data.telephone,
            role: data.role,
            organizationId: data.organizationId || undefined,
            permissions: data.permissions || [],
            vaultId: vault._id
        });

        const { password, ...userWithoutPassword } = newUser.toObject();

        return NextResponse.json(userWithoutPassword, { status: 201 });

    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "User with this Email or Telephone already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
