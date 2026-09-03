import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { serializeAdmin } from "../utils/adminPermissions.js";

const createToken = (admin) =>
  jwt.sign(
    {
      sub: admin._id.toString(),
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );

export const login = async (req, res) => {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const password =
    typeof req.body.password === "string"
      ? req.body.password
      : "";

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const admin = await Admin.findOne({ email }).select("+passwordHash");

    if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.json({
      success: true,
      token: createToken(admin),
      user: serializeAdmin(admin),
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in.",
    });
  }
};

export const currentAdmin = (req, res) => {
  return res.json({
    success: true,
    user: serializeAdmin(req.admin),
  });
};
