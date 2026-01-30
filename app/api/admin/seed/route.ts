import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Organization from "@/models/Organization";
import Vault from "@/models/Vault";
import bcrypt from "bcryptjs";

// WARNING: This route is for demo initialization only. In production, protect or remove.
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // 1. Create Ministries (Tier 2)
        const ministryEd = await Organization.findOneAndUpdate(
            { code: "MOE" },
            {
                name: "Ministry of Education",
                type: "ministry",
                code: "MOE",
                tier: 2,
                tags: ["education", "academic"],
                description: "Governing body for education and academic certifications."
            },
            { upsert: true, new: true }
        );

        const ministryHealth = await Organization.findOneAndUpdate(
            { code: "MOHS" },
            {
                name: "Ministry of Health & Sanitation",
                type: "ministry",
                code: "MOHS",
                tier: 2,
                tags: ["health", "medical"],
                description: "Governing body for health certifications and records."
            },
            { upsert: true, new: true }
        );

        // 2. Create Institutions (Tier 3)
        const uniSierra = await Organization.findOneAndUpdate(
            { code: "USL" },
            {
                name: "University of Sierra Leone",
                type: "institution",
                code: "USL",
                tier: 3,
                tags: ["education"],
                description: "Public university system."
            },
            { upsert: true, new: true }
        );

        // 3. Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash("password123", salt); // Default password

        // Admin User (Tier 1)
        const adminVault = await Vault.create({ documents: [] });
        await User.findOneAndUpdate(
            { email: "admin@gov.sl" },
            {
                email: "admin@gov.sl",
                password: hashedPwd,
                telephone: "+23200000000",
                role: "gov_admin",
                permissions: ["all"],
                vaultId: adminVault._id
            },
            { upsert: true }
        );

        // Ministry Official (Tier 2 - Education)
        const moeVault = await Vault.create({ documents: [] });
        await User.findOneAndUpdate(
            { email: "official@moe.gov.sl" },
            {
                email: "official@moe.gov.sl",
                password: hashedPwd,
                telephone: "+23200000001",
                role: "gov_official",
                organizationId: ministryEd._id,
                permissions: ["verify.education", "issue.education"],
                vaultId: moeVault._id
            },
            { upsert: true }
        );

        // University Associate (Tier 3 - USL)
        const uslVault = await Vault.create({ documents: [] });
        await User.findOneAndUpdate(
            { email: "registrar@usl.edu.sl" },
            {
                email: "registrar@usl.edu.sl",
                password: hashedPwd,
                telephone: "+23200000002",
                role: "gov_associate",
                organizationId: uniSierra._id,
                permissions: ["upload.education"],
                vaultId: uslVault._id
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "Government structure seeded successfully.",
            credentials: {
                admin: "admin@gov.sl / password123",
                official: "official@moe.gov.sl / password123",
                associate: "registrar@usl.edu.sl / password123"
            }
        });

    } catch (error: any) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
