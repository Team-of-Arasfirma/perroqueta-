import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import { createFullPermissions } from "../utils/adminPermissions.js";

if (!process.env.SEED_ADMIN_EMAIL) {
  throw new Error("SEED_ADMIN_EMAIL is required.");
}

if (!process.env.SEED_ADMIN_PASSWORD) {
  throw new Error("SEED_ADMIN_PASSWORD is required.");
}

await connectDB();

const email = process.env.SEED_ADMIN_EMAIL.trim().toLowerCase();

const admin = await Admin.findOne({ email }).select("+passwordHash");

if (!admin) {
  console.log("Admin not found:", email);
  process.exit(1);
}

admin.passwordHash = await bcrypt.hash(
  process.env.SEED_ADMIN_PASSWORD,
  12
);

admin.isActive = true;
admin.role = "super_admin";
admin.permissions = createFullPermissions();

await admin.save();

console.log("Super admin password updated:", email);

process.exit(0);
