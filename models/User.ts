import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    telephone: string;
    nin?: string;
    vaultId: mongoose.Types.ObjectId;
    resetToken?: string;
    resetTokenExpiry?: Date;
    // Simplified Roles
    role: "citizen" | "gov";
    organizationId?: mongoose.Types.ObjectId;
    permissions?: string[];
    isActive: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        telephone: { type: String, required: true },
        nin: { type: String, required: false, unique: true, sparse: true },
        vaultId: { type: Schema.Types.ObjectId, ref: "Vault", required: true },
        resetToken: { type: String, required: false },
        resetTokenExpiry: { type: Date, required: false },

        // RBAC Fields
        role: {
            type: String,
            enum: ["citizen", "gov"],
            default: "citizen",
            index: true
        },
        organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
        permissions: [{ type: String }], // Granular generic permissions e.g. ["verify.education", "issue.birth_cert"]
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
