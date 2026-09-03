const MODULE_ACTIONS = {
  dashboard: ["view"],
  projects: ["view", "create", "edit", "delete"],
  blogs: ["view", "create", "edit", "delete"],
  careers: ["view", "create", "edit", "delete"],
  applications: ["view", "edit", "delete"],
  inquiries: ["view", "edit", "delete"],
  redirects: ["view", "create", "edit", "delete"],
};

export const createDefaultPermissions = () =>
  Object.fromEntries(
    Object.entries(MODULE_ACTIONS).map(([moduleName, actions]) => [
      moduleName,
      Object.fromEntries(actions.map((action) => [action, false])),
    ])
  );

export const createFullPermissions = () =>
  Object.fromEntries(
    Object.entries(MODULE_ACTIONS).map(([moduleName, actions]) => [
      moduleName,
      Object.fromEntries(actions.map((action) => [action, true])),
    ])
  );

export const sanitizePermissionsInput = (permissions) => {
  if (typeof permissions === "string") {
    try {
      return JSON.parse(permissions);
    } catch {
      return {};
    }
  }

  return permissions && typeof permissions === "object" ? permissions : {};
};

export const normalizePermissions = (
  permissions,
  role = "admin",
  currentPermissions = createDefaultPermissions()
) => {
  if (role === "super_admin") {
    return createFullPermissions();
  }

  const incoming = sanitizePermissionsInput(permissions);
  const base = sanitizePermissionsInput(currentPermissions);
  const defaults = createDefaultPermissions();

  return Object.fromEntries(
    Object.entries(defaults).map(([moduleName, actions]) => [
      moduleName,
      Object.fromEntries(
        Object.keys(actions).map((action) => [
          action,
          Boolean(
            incoming?.[moduleName]?.[action] ??
              base?.[moduleName]?.[action] ??
              false
          ),
        ])
      ),
    ])
  );
};

export const hasPermission = (admin, moduleName, action) => {
  if (!admin) return false;

  if (admin.role === "super_admin") {
    return true;
  }

  return Boolean(admin?.permissions?.[moduleName]?.[action]);
};

export const isSuperAdmin = (admin) => admin?.role === "super_admin";

export const serializeAdmin = (
  admin,
  { includeTimestamps = false } = {}
) => {
  const permissions = normalizePermissions(
    admin?.permissions,
    admin?.role,
    createDefaultPermissions()
  );

  const payload = {
    _id: admin._id.toString(),
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: Boolean(admin.isActive),
    permissions,
  };

  if (includeTimestamps) {
    payload.createdAt = admin.createdAt;
    payload.updatedAt = admin.updatedAt;
  }

  return payload;
};
