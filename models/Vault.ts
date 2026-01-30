// DEPRECATED: This model is kept for backward compatibility and as a potential user-settings container.
// All documents are now Top-Level "Document" models.

import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IVault extends Document {
    userId: mongoose.Types.ObjectId;
    // documents: IVaultDocument[]; // DEPRECATED - Removed in favor of generic Document model
    encryptedMetadata?: string; // Placeholder for future vault-specific config
}

const VaultSchema = new Schema<IVault>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },
        encryptedMetadata: { type: String },
    },
    { timestamps: true }
);

export default models.Vault || model<IVault>("Vault", VaultSchema);
