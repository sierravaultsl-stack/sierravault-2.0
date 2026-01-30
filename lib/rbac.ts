import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";

export type Role = "citizen" | "gov";

export interface SystemUser extends IUser {
    _id: string;
}

/**
 * Retrieves the current authenticated user inside a Server Action or Server Component.
 * Returns null if not authenticated or invalid.
 */
export async function getCurrentUser(): Promise<SystemUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        await dbConnect();
        const user = await User.findById(decoded.id).select("-password").lean();
        return user as SystemUser;
    } catch (error) {
        return null;
    }
}

/**
 * Enforces that the current user has one of the allowed roles.
 * Throws an error if authorization fails (for use in Server Actions).
 * Returns the user if successful.
 */
export async function enforceRole(allowedRoles: Role[]): Promise<SystemUser> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthorized: Please log in.");
    }

    if (!allowedRoles.includes(user.role as Role)) {
        throw new Error("Forbidden: Insufficient permissions.");
    }

    return user;
}

/**
 * Soft check for RBAC, returns boolean instead of throwing.
 */
export async function hasRole(allowedRoles: Role[]): Promise<boolean> {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        return allowedRoles.includes(user.role as Role);
    } catch {
        return false;
    }
}
