
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User";
import Vault from "./models/Vault";
import dbConnect from "./lib/dbConnect";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sierra-vault";

async function seed() {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGODB_URI);

    console.log("Clearing existing test users...");
    await User.deleteMany({ email: { $in: ["admin@gov.sl", "citizen@sierra.sl"] } });

    // Create Vaults first
    const adminVault = await Vault.create({
        userId: new mongoose.Types.ObjectId(),
        documents: []  // Initialize empty for legacy schema compat if needed
    });
    const citizenVault = await Vault.create({
        userId: new mongoose.Types.ObjectId(),
        documents: []
    });

    const hashedPassword = await bcrypt.hash("password123", 10);

    console.log("Creating Gov Official...");
    const admin = await User.create({
        email: "admin@gov.sl",
        password: hashedPassword,
        telephone: "+23299000000",
        role: "gov",
        vaultId: adminVault._id,
        isActive: true,
        permissions: ["all"]
    });
    // Link vault back to user
    adminVault.userId = admin._id;
    await adminVault.save();

    console.log("Creating Citizen...");
    const citizen = await User.create({
        email: "citizen@sierra.sl",
        password: hashedPassword,
        telephone: "+23277000000",
        nin: "SL123456789",
        role: "citizen",
        vaultId: citizenVault._id,
        isActive: true
    });
    citizenVault.userId = citizen._id;
    await citizenVault.save();

    console.log("✅ Seeding Complete!");
    console.log("Admin: admin@gov.sl / password123");
    console.log("Citizen: citizen@sierra.sl / password123 / NIN: SL123456789");

    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
