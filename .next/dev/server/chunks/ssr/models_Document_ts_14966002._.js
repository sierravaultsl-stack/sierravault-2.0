module.exports = [
"[project]/models/Document.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const DocumentSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: [
            "PENDING_VERIFICATION",
            "VERIFIED",
            "ISSUED",
            "REJECTED",
            "EXPIRED",
            "REQUESTED"
        ],
        default: "PENDING_VERIFICATION",
        index: true
    },
    metadata: {
        aiScore: {
            type: Number
        },
        aiFlags: [
            {
                type: String
            }
        ],
        aiExplanation: {
            type: String
        },
        extractedText: {
            type: String
        },
        fileHash: {
            type: String
        },
        mimeType: {
            type: String
        },
        sizeBytes: {
            type: Number
        }
    },
    govAudit: {
        uploadedBy: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        },
        verifiedBy: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        },
        verifiedAt: {
            type: Date
        },
        rejectedBy: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: "User"
        },
        rejectionReason: {
            type: String
        },
        rejectedAt: {
            type: Date
        },
        issuedAt: {
            type: Date
        }
    }
}, {
    timestamps: true
});
// Indexes for common queries
DocumentSchema.index({
    "govAudit.verifiedBy": 1
});
DocumentSchema.index({
    createdAt: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["models"].Document || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["model"])("Document", DocumentSchema);
}),
];

//# sourceMappingURL=models_Document_ts_14966002._.js.map