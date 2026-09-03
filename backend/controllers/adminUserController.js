import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import {
  createDefaultPermissions,
  createFullPermissions,
  normalizePermissions,
  sanitizePermissionsInput,
  serializeAdmin,
} from "../utils/adminPermissions.js";

const clean = (value = "") => String(value).trim();

const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const countActiveSuperAdmins = async (excludeId = null) => {
  const query = {
    role: "super_admin",
    isActive: true,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Admin.countDocuments(query);
};

const normalizeIncomingPermissions = (permissions, role, currentPermissions) =>
  normalizePermissions(
    sanitizePermissionsInput(permissions),
    role,
    currentPermissions || createDefaultPermissions()
  );

const buildPayload = async (body, currentAdmin = null) => {
  const name = clean(body.name ?? currentAdmin?.name ?? "");
  const email = clean(body.email ?? currentAdmin?.email ?? "").toLowerCase();
  const role = clean(body.role ?? currentAdmin?.role ?? "admin");
  const isActive =
    body.isActive === undefined
      ? currentAdmin?.isActive ?? true
      : String(body.isActive) === "true" || body.isActive === true;
  const password = clean(body.password ?? "");

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email || !isValidEmail(email)) {
    throw new Error("A valid email address is required.");
  }

  if (!["super_admin", "admin", "editor"].includes(role)) {
    throw new Error("Please choose a valid role.");
  }

  if (!currentAdmin && password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  if (currentAdmin && password && password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const permissions = normalizeIncomingPermissions(
    body.permissions,
    role,
    currentAdmin?.permissions || createDefaultPermissions()
  );

  return {
    name,
    email,
    role,
    isActive,
    password,
    permissions: role === "super_admin" ? createFullPermissions() : permissions,
  };
};

export const getAdminUsers = async (req, res) => {
  try {
    const admins = await Admin.find({}).sort({ createdAt: -1 }).select("-passwordHash").lean();

    const users = admins.map((admin) => serializeAdmin(admin, { includeTimestamps: true }));

    const stats = {
      total: users.length,
      active: users.filter((user) => user.isActive).length,
      superAdmins: users.filter((user) => user.role === "super_admin").length,
      disabled: users.filter((user) => !user.isActive).length,
    };

    return res.json({
      success: true,
      users,
      stats,
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin users.",
    });
  }
};

export const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin user ID.",
      });
    }

    const admin = await Admin.findById(id).select("-passwordHash").lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found.",
      });
    }

    return res.json({
      success: true,
      user: serializeAdmin(admin, { includeTimestamps: true }),
    });
  } catch (error) {
    console.error("Get admin user by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin user.",
    });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const payload = await buildPayload(req.body);

    const existing = await Admin.findOne({
      email: payload.email,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An admin with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const admin = await Admin.create({
      name: payload.name,
      email: payload.email,
      role: payload.role,
      isActive: payload.isActive,
      permissions: payload.permissions,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully.",
      user: serializeAdmin(admin, { includeTimestamps: true }),
    });
  } catch (error) {
    console.error("Create admin user error:", error);

    return res.status(error.message?.includes("required") ? 400 : 500).json({
      success: false,
      message: error.message || "Unable to create admin user.",
    });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin user ID.",
      });
    }

    const admin = await Admin.findById(id).select("+passwordHash");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found.",
      });
    }

    const payload = await buildPayload(req.body, admin);

    const duplicate = await Admin.findOne({
      email: payload.email,
      _id: { $ne: admin._id },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "An admin with this email already exists.",
      });
    }

    const isCurrentUser = req.admin._id.toString() === admin._id.toString();

    if (isCurrentUser && payload.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "You cannot disable your own account.",
      });
    }

    if (admin.role === "super_admin" && payload.role !== "super_admin") {
      const activeSuperAdmins = await countActiveSuperAdmins(admin._id);

      if (activeSuperAdmins === 0) {
        return res.status(400).json({
          success: false,
          message: "The final active super admin role cannot be changed.",
        });
      }
    }

    if (admin.role === "super_admin" && payload.isActive === false) {
      const activeSuperAdmins = await countActiveSuperAdmins(admin._id);

      if (activeSuperAdmins === 0) {
        return res.status(400).json({
          success: false,
          message: "The final active super admin cannot be disabled.",
        });
      }
    }

    admin.name = payload.name;
    admin.email = payload.email;
    admin.role = payload.role;
    admin.isActive = payload.isActive;
    admin.permissions =
      payload.role === "super_admin" ? createFullPermissions() : payload.permissions;

    if (payload.password) {
      admin.passwordHash = await bcrypt.hash(payload.password, 12);
    }

    await admin.save();

    return res.json({
      success: true,
      message: "Admin user updated successfully.",
      user: serializeAdmin(admin, { includeTimestamps: true }),
    });
  } catch (error) {
    console.error("Update admin user error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update admin user.",
    });
  }
};

export const toggleAdminUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isActive = String(req.body.isActive) === "true" || req.body.isActive === true;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin user ID.",
      });
    }

    const admin = await Admin.findById(id).select("-passwordHash").lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found.",
      });
    }

    if (req.admin._id.toString() === admin._id.toString() && !isActive) {
      return res.status(400).json({
        success: false,
        message: "You cannot disable your own account.",
      });
    }

    if (admin.role === "super_admin" && !isActive) {
      const activeSuperAdmins = await countActiveSuperAdmins(admin._id);

      if (activeSuperAdmins === 0) {
        return res.status(400).json({
          success: false,
          message: "The final active super admin cannot be disabled.",
        });
      }
    }

    admin.isActive = isActive;
    await admin.save();

    return res.json({
      success: true,
      message: `Admin user ${isActive ? "enabled" : "disabled"} successfully.`,
      user: serializeAdmin(admin, { includeTimestamps: true }),
    });
  } catch (error) {
    console.error("Toggle admin user status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update admin user status.",
    });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin user ID.",
      });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found.",
      });
    }

    if (req.admin._id.toString() === admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    if (admin.role === "super_admin" && admin.isActive) {
      const activeSuperAdmins = await countActiveSuperAdmins(admin._id);

      if (activeSuperAdmins === 0) {
        return res.status(400).json({
          success: false,
          message: "The final active super admin cannot be deleted.",
        });
      }
    }

    await admin.deleteOne();

    return res.json({
      success: true,
      message: "Admin user deleted successfully.",
    });
  } catch (error) {
    console.error("Delete admin user error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to delete admin user.",
    });
  }
};
