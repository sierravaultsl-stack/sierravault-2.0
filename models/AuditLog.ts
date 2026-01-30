import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IAuditLog extends Document {
    actorId: mongoose.Types.ObjectId; // User who performed the action
    action: "DOCUMENT_UPLOAD" | "DOCUMENT_VERIFIED" | "DOCUMENT_REJECTED" | "DOCUMENT_ISSUED" | "ACCESS_GRANTED" | "LOGIN_FAILURE" | "GOV_User_ADDED" | "DOCUMENT_DELETED_REJECTED" | "DOCUMENT_REQUESTED";
    targetId?: mongoose.Types.ObjectId; // Document ID or User ID being acted upon
    targetModel?: "Document" | "User";
    details?: Record<string, any>; // Flexible metadata (reason, IP, etc.)
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        actorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        action: {
            type: String,
            enum: [
                "DOCUMENT_UPLOAD",
                "DOCUMENT_VERIFIED",
                "DOCUMENT_REJECTED",
                "DOCUMENT_ISSUED",
                "ACCESS_GRANTED",
                "LOGIN_FAILURE",
                "GOV_USER_ADDED",
                "DOCUMENT_DELETED_REJECTED",
                "DOCUMENT_REQUESTED",
            ],
            required: true,
            index: true,
        },
        targetId: { type: Schema.Types.ObjectId, index: true },
        targetModel: { type: String, enum: ["Document", "User"] },
        details: { type: Schema.Types.Mixed },
        ipAddress: { type: String },
        userAgent: { type: String },
        timestamp: { type: Date, default: Date.now, index: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } } // Immutable logs
);

export default models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
