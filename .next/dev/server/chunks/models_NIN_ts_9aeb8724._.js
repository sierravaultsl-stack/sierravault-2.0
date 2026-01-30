module.exports = [
"[project]/models/NIN.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const NinSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    surname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    middlename: {
        type: String
    },
    sex: {
        type: String,
        enum: [
            "M",
            "F"
        ],
        required: true
    },
    height: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    dateOfExpiry: {
        type: Date,
        required: true
    },
    personalIdNumber: {
        type: String,
        required: true,
        unique: true
    },
    nin: {
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 7
    }
}, {
    timestamps: true
});
// Prevent OverwriteModelError in dev
const NIN = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["models"].NIN || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["model"])("NIN", NinSchema);
const __TURBOPACK__default__export__ = NIN;
}),
];

//# sourceMappingURL=models_NIN_ts_9aeb8724._.js.map