import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Organization from "@/models/Organization";
import { enforceRole } from "@/lib/rbac";

export async function GET(req: NextRequest) {
    try {
        await enforceRole(["gov_admin", "gov_official", "gov_associate"]);
        await dbConnect();

        const organizations = await Organization.find({}).sort({ name: 1 });
        return NextResponse.json(organizations);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 403 }); // Or 500 dependent on error
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await enforceRole(["gov_admin"]);
        await dbConnect();

        const data = await req.json();

        // Basic validation
        if (!data.name || !data.type || !data.code || !data.tier) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const org = await Organization.create(data);

        return NextResponse.json(org, { status: 201 });
    } catch (error: any) {
        // Handle duplicate code error
        if (error.code === 11000) {
            return NextResponse.json({ error: "Organization with this Code or Name already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
