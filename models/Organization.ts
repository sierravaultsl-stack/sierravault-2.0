import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IOrganization extends Document {
    name: string;
    type: "ministry" | "agency" | "institution";
    code: string; // e.g., "MOE" for Ministry of Education
    tier: 1 | 2 | 3;
    tags: string[]; // Routing tags, e.g., ["education", "academic"]
    description?: string;
    website?: string;
    logoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
    {
        name: { type: String, required: true, unique: true },
        type: {
            type: String,
            enum: ["ministry", "agency", "institution"],
            required: true
        },
        code: { type: String, required: true, unique: true, uppercase: true },
        tier: { type: Number, enum: [1, 2, 3], required: true },
        tags: [{ type: String }], // Used for smart routing
        description: { type: String },
        website: { type: String },
        logoUrl: { type: String },
    },
    { timestamps: true }
);

// Prevent duplicate model compilation
export default models.Organization || model<IOrganization>("Organization", OrganizationSchema);
