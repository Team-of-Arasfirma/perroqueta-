import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { hasPermission } from "../utils/adminPermissions.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";

  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(payload.sub);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is disabled.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }
};

export const requirePermission = (moduleName, action) => (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!req.admin.isActive) {
    return res.status(403).json({
      success: false,
      message: "Your account is disabled.",
    });
  }

  if (req.admin.role === "super_admin") {
    return next();
  }

  if (!hasPermission(req.admin, moduleName, action)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action.",
    });
  }

  return next();
};

export const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!req.admin.isActive) {
    return res.status(403).json({
      success: false,
      message: "Your account is disabled.",
    });
  }

  if (req.admin.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action.",
    });
  }

  return next();
};
