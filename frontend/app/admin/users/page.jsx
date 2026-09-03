"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Edit3, Eye, EyeOff, Loader2, Plus, Search, Shield, ShieldAlert, ShieldCheck, Trash2, X } from "lucide-react";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import { createEmptyPermissions, createFullPermissions, getPermissionSummary, isSuperAdmin } from "@/lib/adminPermissions";
import { createAdminUser, deleteAdminUser, fetchAdminUsers, updateAdminUser, updateAdminUserStatus } from "@/services/adminUserService";

const ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "User" },
]; 

const PERMISSION_GROUPS = [
  ["dashboard", "Dashboard", [["view", "View"]]],
  ["projects", "Projects", [["view", "View"], ["create", "Create"], ["edit", "Edit"], ["delete", "Delete"]]],
  ["blogs", "Blogs", [["view", "View"], ["create", "Create"], ["edit", "Edit"], ["delete", "Delete"]]],
  ["careers", "Careers", [["view", "View"], ["create", "Create"], ["edit", "Edit"], ["delete", "Delete"]]],
  ["applications", "Applications", [["view", "View"], ["edit", "Edit Status"], ["delete", "Delete"]]],
  ["inquiries", "Inquiries", [["view", "View"], ["edit", "Edit Status"], ["delete", "Delete"]]],
  ["redirects", "Redirects", [["view", "View"], ["create", "Create"], ["edit", "Edit"], ["delete", "Delete"]]],
];

const roleLabel = Object.fromEntries(ROLES.map((role) => [role.value, role.label]));
const blankForm = () => ({ name: "", email: "", password: "", role: "admin", isActive: true, permissions: createEmptyPermissions() });

const cleanPermissions = (permissions = {}) => {
  const template = createEmptyPermissions();
  return Object.fromEntries(
    Object.keys(template).map((moduleName) => [
      moduleName,
      Object.fromEntries(Object.keys(template[moduleName]).map((action) => [action, Boolean(permissions?.[moduleName]?.[action])])),
    ])
  );
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const Badge = ({ tone = "default", children }) => {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "danger"
        ? "border-red-200 bg-red-50 text-red-600"
        : tone === "warning"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : tone === "muted"
            ? "border-[#E4DEF0] bg-[#F6F3FC] text-[#665A7D]"
            : "border-[#D9CBF5] bg-[#F3EEFB] text-[#6030C6]";
  return <span className={`inline-flex rounded-full border px-3 py-1.5 text-[12px] font-bold ${className}`}>{children}</span>;
};

const StatCard = ({ label, value, tone = "text-[#6030C6]" }) => (
  <div className="rounded-2xl border border-[#E8E1F3] bg-white p-5 shadow-[0_10px_30px_rgba(49,29,91,0.05)]">
    <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8C84A2]">{label}</p>
    <p className={`mt-3 text-[30px] font-bold ${tone}`}>{value}</p>
  </div>
);

export default function AdminUsersPage() {
  const { user, token, status } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, superAdmins: 0, disabled: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(blankForm());
  const [showPassword, setShowPassword] = useState(false);

  const canAccessPage = status === "ready" && isSuperAdmin(user);
  const activeSuperAdminCount = useMemo(() => users.filter((item) => item.role === "super_admin" && item.isActive).length, [users]);

  const loadUsers = async () => {
    const data = await fetchAdminUsers({ token });
    setUsers(data.users || []);
    setStats(data.stats || { total: 0, active: 0, superAdmins: 0, disabled: 0 });
  };

  useEffect(() => {
    if (!canAccessPage) {
      setLoading(false);
      return;
    }

    if (!token) return;

    setLoading(true);
    setError("");
    loadUsers().catch((loadError) => setError(loadError.message || "Unable to load admin users.")).finally(() => setLoading(false));
  }, [canAccessPage, token]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return users.filter((admin) => {
      const matchesSearch = !keyword || admin.name?.toLowerCase().includes(keyword) || admin.email?.toLowerCase().includes(keyword);
      const matchesRole = roleFilter === "all" || admin.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? admin.isActive : !admin.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter, users]);

  const resetForm = () => {
    setForm(blankForm());
    setEditingUser(null);
    setFormError("");
    setShowPassword(false);
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (admin) => {
    setEditingUser(admin);
    setForm({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
      role: admin.role || "admin",
      isActive: admin.isActive ?? true,
      permissions: cleanPermissions(admin.permissions || createEmptyPermissions()),
    });
    setFormError("");
    setModalOpen(true);
  };
  const closeModal = () => { if (!saving) { resetForm(); setModalOpen(false); } };

  const updatePermission = (moduleName, action, value) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [moduleName]: { ...prev.permissions[moduleName], [action]: value } },
    }));
  };

  const setAllPermissions = (value) => {
    const next = createEmptyPermissions();
    Object.keys(next).forEach((moduleName) => Object.keys(next[moduleName]).forEach((action) => { next[moduleName][action] = value; }));
    setForm((prev) => ({ ...prev, permissions: next }));
  };

  const handleRoleChange = (nextRole) => {
    setForm((prev) => ({ ...prev, role: nextRole, permissions: nextRole === "super_admin" ? createFullPermissions() : prev.permissions }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!form.name.trim()) return setFormError("Name is required.");
    if (!form.email.trim()) return setFormError("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setFormError("Enter a valid email address.");
    if (!editingUser && form.password.length < 8) return setFormError("Password must be at least 8 characters.");
    if (editingUser && form.password && form.password.length < 8) return setFormError("Password must be at least 8 characters.");

    try {
      setSaving(true);
      const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role, isActive: form.isActive, permissions: form.role === "super_admin" ? createFullPermissions() : form.permissions };
      if (form.password.trim()) payload.password = form.password;
      if (editingUser) await updateAdminUser({ token, id: editingUser._id, payload }); else await createAdminUser({ token, payload });
      await loadUsers();
      closeModal();
    } catch (submitError) {
      setFormError(submitError.message || "Unable to save admin user.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (admin) => {
    if (admin._id === user?._id) return;
    if (admin.role === "super_admin" && admin.isActive && activeSuperAdminCount <= 1) return;
    try {
      setSaving(true);
      setError("");
      await updateAdminUserStatus({ token, id: admin._id, isActive: !admin.isActive });
      await loadUsers();
    } catch (statusError) {
      setError(statusError.message || "Unable to update user status.");
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async () => {
    if (!deleteTarget?._id) return;
    try {
      setDeleting(true);
      setError("");
      await deleteAdminUser({ token, id: deleteTarget._id });
      setDeleteTarget(null);
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete admin user.");
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading") return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#6030C6]" /></div>;
  if (!isSuperAdmin(user)) return <AdminAccessDenied title="Users & Roles Access Denied" description="Only a super admin can manage admin users, roles and module permissions." />;

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FF8626]">Admin Management</p><h2 className="mt-2 text-[28px] font-bold text-[#171717]">Users & Roles</h2><p className="mt-2 text-[14px] text-[#777777]">Manage admin users, roles and module permissions.</p></div>
        <button onClick={openCreate} className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5127AE]"><Plus className="h-4 w-4" />Add User</button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.total} />
        <StatCard label="Active Users" value={stats.active} tone="text-emerald-600" />
        <StatCard label="Super Admins" value={stats.superAdmins} tone="text-[#6030C6]" />
        <StatCard label="Disabled Users" value={stats.disabled} tone="text-red-600" />
      </div>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#E8E1F3] bg-white p-4 shadow-[0_10px_30px_rgba(49,29,91,0.05)] lg:flex-row">
        <div className="flex h-[44px] flex-1 items-center rounded-xl border border-[#E3DDEA] px-3 focus-within:border-[#6030C6]"><Search className="h-4 w-4 shrink-0 text-[#999]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="h-full w-full bg-transparent px-3 text-[13px] text-[#333] outline-none" /></div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-[44px] rounded-xl border border-[#E3DDEA] bg-white px-4 text-[13px] text-[#555] outline-none focus:border-[#6030C6]"><option value="all">All Roles</option>{ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-[44px] rounded-xl border border-[#E3DDEA] bg-white px-4 text-[13px] text-[#555] outline-none focus:border-[#6030C6]"><option value="all">All Status</option><option value="active">Active</option><option value="disabled">Disabled</option></select>
      </div>

      {error && !modalOpen && !deleteTarget ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">{error}</div> : null}

      <div className="mt-6">
        {loading ? <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#E8E1F3] bg-white"><Loader2 className="h-7 w-7 animate-spin text-[#6030C6]" /></div> : filteredUsers.length === 0 ? <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCD3EA] bg-white px-5 text-center"><Shield className="h-8 w-8 text-[#6030C6]" /><h3 className="mt-4 text-[17px] font-bold text-[#333]">No users found</h3><p className="mt-2 text-[14px] text-[#888]">Try adjusting the filters or create a new admin user.</p></div> : (
          <>
            <div className="hidden overflow-hidden rounded-[18px] border border-[#E8E1F3] bg-white lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#F0EAFB]"><thead className="bg-[#FBF8FF]"><tr className="text-left text-[12px] font-bold uppercase tracking-[0.1em] text-[#8B83A0]"><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Permissions</th><th className="px-5 py-4">Created</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#F3EEF9]">{filteredUsers.map((admin) => {
                  const isSelf = admin._id === user?._id;
                  const isFinalSuperAdmin = admin.role === "super_admin" && admin.isActive && activeSuperAdminCount <= 1;
                  return (<tr key={admin._id} className="align-top transition hover:bg-[#FCFAFF]"><td className="px-5 py-4"><p className="text-[16px] font-bold text-[#222]">{admin.name}</p><p className="mt-1 text-[13px] text-[#777]">{admin.email}</p></td><td className="px-5 py-4"><Badge tone={admin.role === "super_admin" ? "default" : admin.role === "admin" ? "muted" : "warning"}>{roleLabel[admin.role] || admin.role}</Badge></td><td className="px-5 py-4"><Badge tone={admin.isActive ? "success" : "danger"}>{admin.isActive ? "Active" : "Disabled"}</Badge></td><td className="px-5 py-4 text-[13px] text-[#555]">{getPermissionSummary(admin)}</td><td className="px-5 py-4 text-[13px] text-[#555]">{formatDate(admin.createdAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(admin)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3EEFB] px-3 py-2 text-[13px] font-bold text-[#6030C6] transition hover:bg-[#E8DBFB]"><Edit3 className="h-4 w-4" /> Edit</button><button type="button" onClick={() => toggleStatus(admin)} disabled={isSelf || isFinalSuperAdmin || saving} className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF2E7] px-3 py-2 text-[13px] font-bold text-[#C45F13] transition hover:bg-[#FFE6CF] disabled:cursor-not-allowed disabled:opacity-40"><ShieldCheck className="h-4 w-4" /> {admin.isActive ? "Disable" : "Enable"}</button><button type="button" onClick={() => setDeleteTarget(admin)} disabled={isSelf || isFinalSuperAdmin} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /> Delete</button></div></td></tr>);
                })}</tbody></table>
              </div>
            </div>

            <div className="grid gap-4 lg:hidden">{filteredUsers.map((admin) => {
              const isSelf = admin._id === user?._id;
              const isFinalSuperAdmin = admin.role === "super_admin" && admin.isActive && activeSuperAdminCount <= 1;
              return (<article key={admin._id} className="rounded-[18px] border border-[#E8E1F3] bg-white p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-[17px] font-bold text-[#222]">{admin.name}</h3><p className="mt-1 text-[13px] text-[#777]">{admin.email}</p></div><Badge tone={admin.isActive ? "success" : "danger"}>{admin.isActive ? "Active" : "Disabled"}</Badge></div><div className="mt-4 flex flex-wrap gap-2"><Badge tone={admin.role === "super_admin" ? "default" : admin.role === "admin" ? "muted" : "warning"}>{roleLabel[admin.role] || admin.role}</Badge></div><p className="mt-4 text-[13px] text-[#555]">{getPermissionSummary(admin)}</p><p className="mt-2 text-[12px] text-[#888]">Created {formatDate(admin.createdAt)}</p><div className="mt-5 grid grid-cols-3 gap-2"><button type="button" onClick={() => openEdit(admin)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F3EEFB] px-4 py-3 text-[13px] font-bold text-[#6030C6]"><Edit3 className="h-4 w-4" /> Edit</button><button type="button" onClick={() => toggleStatus(admin)} disabled={isSelf || isFinalSuperAdmin || saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF2E7] px-4 py-3 text-[13px] font-bold text-[#C45F13] disabled:cursor-not-allowed disabled:opacity-40"><ShieldCheck className="h-4 w-4" /> {admin.isActive ? "Disable" : "Enable"}</button><button type="button" onClick={() => setDeleteTarget(admin)} disabled={isSelf || isFinalSuperAdmin} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /> Delete</button></div></article>);
            })}</div>
          </>
        )}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#17112D]/55 p-3 backdrop-blur-[3px] sm:p-6">
          <form onSubmit={submit} className="flex max-h-[94vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[22px] bg-[#FBF9FE] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[#E8E1F3] bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6030C6]">{editingUser ? "Edit User" : "New User"}</p>
                <h2 className="mt-1 text-[21px] font-bold text-[#241D32]">{editingUser ? "Update Admin User" : "Create Admin User"}</h2>
              </div>
              <button type="button" onClick={closeModal} className="flex h-9 w-9 items-center justify-center rounded-full text-[#777080] transition hover:bg-[#F3EEFB] hover:text-[#6030C6]"><X className="h-5 w-5" /></button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section className="space-y-5">
                  <div className="rounded-[18px] border border-[#E8E1F3] bg-white p-5 sm:p-6">
                    <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">Account Details</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block"><span className="text-[13px] font-semibold text-[#333]">Name *</span><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-2 h-[46px] w-full rounded-xl border border-[#DDD7E8] px-4 text-[13px] outline-none focus:border-[#6030C6]" placeholder="Full name" /></label>
                      <label className="block"><span className="text-[13px] font-semibold text-[#333]">Email *</span><input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-2 h-[46px] w-full rounded-xl border border-[#DDD7E8] px-4 text-[13px] outline-none focus:border-[#6030C6]" placeholder="name@example.com" /></label>
                      <label className="block">
                        <span className="text-[13px] font-semibold text-[#333]">
                          {editingUser ? "New Password" : "Password *"}
                        </span>
                        <div className="relative mt-2">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                            className="h-[46px] w-full rounded-xl border border-[#DDD7E8] px-4 pr-12 text-[13px] outline-none focus:border-[#6030C6]"
                            placeholder={editingUser ? "Leave blank to keep current password" : "At least 8 characters"}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8B83A0] transition hover:bg-[#F3EEFB] hover:text-[#6030C6]"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-[18px] w-[18px]" />
                            ) : (
                              <Eye className="h-[18px] w-[18px]" />
                            )}
                          </button>
                        </div>
                        <p className="mt-2 text-[11px] text-[#888]">
                          {editingUser ? "Leave blank to keep current password." : "Password must be at least 8 characters."}
                        </p>
                      </label>
                      <label className="block"><span className="text-[13px] font-semibold text-[#333]">Role *</span><select value={form.role} onChange={(e) => handleRoleChange(e.target.value)} className="mt-2 h-[46px] w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[13px] outline-none focus:border-[#6030C6]">{ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></label>
                    </div>
                    <label className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F8F5FC] px-4 py-4"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4 accent-[#6030C6]" /><div><p className="text-[13px] font-semibold text-[#333]">Active Account</p><p className="mt-1 text-[11px] text-[#888]">Disabled users cannot log in.</p></div></label>
                  </div>

                  <div className="rounded-[18px] border border-[#E8E1F3] bg-white p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">Module Permissions</p><p className="mt-1 text-[12px] text-[#777]">Grant access for admin and editor roles.</p></div>
                      {form.role !== "super_admin" ? <div className="flex gap-2"><button type="button" onClick={() => setAllPermissions(true)} className="rounded-xl border border-[#DDD7E8] px-4 py-2 text-[12px] font-semibold text-[#6030C6]">Select All</button><button type="button" onClick={() => setAllPermissions(false)} className="rounded-xl border border-[#DDD7E8] px-4 py-2 text-[12px] font-semibold text-[#666]">Clear All</button></div> : null}
                    </div>
                    {form.role === "super_admin" ? <div className="mt-4 rounded-2xl border border-dashed border-[#D9CBF5] bg-[#F7F2FF] p-4 text-sm text-[#5E4A7C]"><div className="flex items-center gap-2 font-semibold text-[#6030C6]"><ShieldAlert className="h-4 w-4" /> Full Access</div><p className="mt-2 text-[12px] leading-6">Super admins always have full access regardless of stored permission values.</p></div> : null}
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {PERMISSION_GROUPS.map(([key, label, actions]) => (
                        <div key={key} className="rounded-[16px] border border-[#EEE6FB] bg-[#FBF8FF] p-4">
                          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#8B83A0]">{label}</p>
                          <div className="mt-4 grid gap-2">
                            {actions.map(([actionKey, actionLabel]) => {
                              const checked = Boolean(form.permissions?.[key]?.[actionKey]);
                              const disabled = form.role === "super_admin";
                              return <label key={actionKey} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-[13px] text-[#444]"><span>{actionLabel}</span><input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => updatePermission(key, actionKey, e.target.checked)} className="h-4 w-4 accent-[#6030C6] disabled:opacity-50" /></label>;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="space-y-5">
                  <div className="rounded-[18px] border border-[#E8E1F3] bg-white p-5 sm:p-6">
                    <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">Summary</p>
                    <div className="mt-4 rounded-2xl border border-[#E8E1F3] bg-[#FBF9FE] p-4">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-[#8B83A0]">Role</p>
                      <p className="mt-1 text-[18px] font-bold text-[#222]">{roleLabel[form.role] || form.role}</p>
                      <p className="mt-4 text-[12px] uppercase tracking-[0.12em] text-[#8B83A0]">Permissions</p>
                      <p className="mt-1 text-[13px] leading-6 text-[#555]">{form.role === "super_admin" ? "Full Access" : getPermissionSummary({ role: form.role, permissions: form.permissions })}</p>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#E8E1F3] bg-white p-5 sm:p-6">
                    <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">Quick Notes</p>
                    <ul className="mt-4 space-y-3 text-[13px] leading-6 text-[#666]">
                      <li>Super admins can manage every module.</li>
                      <li>Admin and editor permissions are selected by a super admin.</li>
                      <li>Users & Roles is only visible to super admins.</li>
                      <li>Leave the password blank on edit to keep the existing password.</li>
                    </ul>
                  </div>
                </aside>
              </div>
            </div>

            {(formError || error) ? <div className="shrink-0 border-t border-red-100 bg-red-50 px-5 py-3 text-[12px] font-medium text-red-600 sm:px-7">{formError || error}</div> : null}

            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#E8E1F3] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button type="button" onClick={closeModal} disabled={saving} className="h-11 rounded-xl border border-[#DDD7E8] px-5 text-[13px] font-bold text-[#68616F] transition hover:bg-[#F8F5FC] disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-6 text-[13px] font-bold text-white shadow-[0_7px_18px_rgba(96,48,198,0.18)] transition hover:bg-[#5127AE] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{saving ? "Saving..." : editingUser ? "Update User" : "Create User"}</button>
            </div>
          </form>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-[230] flex items-center justify-center bg-[#17112D]/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[440px] rounded-[20px] border border-[#E8E1F3] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 className="h-5 w-5" /></div>
            <h3 className="mt-5 text-[21px] font-bold text-[#222]">Delete admin user?</h3>
            <p className="mt-3 text-[14px] leading-6 text-[#777]">Delete <strong className="text-[#333]">{deleteTarget.name}</strong> and remove access for this account?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} disabled={deleting} className="h-[44px] rounded-xl border border-[#DDD7E8] px-4 text-[14px] font-semibold text-[#666]">Cancel</button>
              <button type="button" onClick={removeUser} disabled={deleting} className="flex h-[44px] items-center gap-2 rounded-xl bg-red-600 px-4 text-[14px] font-semibold text-white disabled:opacity-60">{deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
