import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IDocument extends Document {
    userId: mongoose.Types.ObjectId; // Citizen Owner
    type: string; // e.g., "National ID", "Birth Certificate"
    title: string; // User-friendly name
    url?: string; // File path or URL (Optional for requests)

    // State Machine
    status: "PENDING_VERIFICATION" | "VERIFIED" | "ISSUED" | "REJECTED" | "EXPIRED" | "REQUESTED";

    // Metadata & AI
    metadata: {
        aiScore?: number;
        aiFlags?: string[];
        aiExplanation?: string;
        extractedText?: string;
        fileHash?: string;
        mimeType?: string;
        sizeBytes?: number;
    };

    // Government Audit Workflow
    govAudit: {
        uploadedBy?: mongoose.Types.ObjectId; // If Gov issued
        verifiedBy?: mongoose.Types.ObjectId; // Gov User who verified
        verifiedAt?: Date;
        rejectedBy?: mongoose.Types.ObjectId;
        rejectionReason?: string;
        rejectedAt?: Date;
        issuedAt?: Date;
    };

    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        type: { type: String, required: true, index: true },
        title: { type: String, required: true },
        url: { type: String, required: false },

        status: {
            type: String,
            enum: ["PENDING_VERIFICATION", "VERIFIED", "ISSUED", "REJECTED", "EXPIRED", "REQUESTED"],
            default: "PENDING_VERIFICATION",
            index: true,
        },

        metadata: {
            aiScore: { type: Number },
            aiFlags: [{ type: String }],
            aiExplanation: { type: String },
            extractedText: { type: String },
            fileHash: { type: String },
            mimeType: { type: String },
            sizeBytes: { type: Number },
        },

        govAudit: {
            uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
            verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
            verifiedAt: { type: Date },
            rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
            rejectionReason: { type: String },
            rejectedAt: { type: Date },
            issuedAt: { type: Date },
        },
    },
    { timestamps: true }
);

// Indexes for common queries
DocumentSchema.index({ "govAudit.verifiedBy": 1 });
DocumentSchema.index({ createdAt: -1 });

export default models.Document || model<IDocument>("Document", DocumentSchema);
