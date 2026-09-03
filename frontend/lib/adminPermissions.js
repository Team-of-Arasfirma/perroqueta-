export const MODULES = [
  "dashboard",
  "projects",
  "blogs",
  "careers",
  "applications",
  "inquiries",
  "redirects",
];

export const ACTIONS = {
  dashboard: ["view"],
  projects: ["view", "create", "edit", "delete"],
  blogs: ["view", "create", "edit", "delete"],
  careers: ["view", "create", "edit", "delete"],
  applications: ["view", "edit", "delete"],
  inquiries: ["view", "edit", "delete"],
  redirects: ["view", "create", "edit", "delete"],
};

export const createEmptyPermissions = () =>
  Object.fromEntries(
    MODULES.map((moduleName) => [
      moduleName,
      Object.fromEntries(ACTIONS[moduleName].map((action) => [action, false])),
    ])
  );

export const createFullPermissions = () =>
  Object.fromEntries(
    MODULES.map((moduleName) => [
      moduleName,
      Object.fromEntries(ACTIONS[moduleName].map((action) => [action, true])),
    ])
  );

export const isSuperAdmin = (user) => user?.role === "super_admin";

export const hasPermission = (user, moduleName, action = "view") => {
  if (isSuperAdmin(user)) {
    return true;
  }

  return Boolean(user?.permissions?.[moduleName]?.[action]);
};

export const getPermissionSummary = (user) => {
  if (!user) return "No permissions";

  if (isSuperAdmin(user)) {
    return "Full Access";
  }

  const labels = {
    dashboard: "Dashboard",
    projects: "Projects",
    blogs: "Blogs",
    careers: "Careers",
    applications: "Applications",
    inquiries: "Inquiries",
    redirects: "Redirects",
  };

  const granted = MODULES.filter((moduleName) => {
    const modulePermissions = user?.permissions?.[moduleName] || {};
    return Object.values(modulePermissions).some(Boolean);
  }).map((moduleName) => labels[moduleName]);

  if (granted.length === 0) {
    return "No module access";
  }

  if (granted.length <= 3) {
    return granted.join(", ");
  }

  return `${granted.slice(0, 3).join(", ")} +${granted.length - 3}`;
};
