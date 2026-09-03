"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  FolderKanban,
  FileText,
  BriefcaseBusiness,
  ClipboardList,
  MessageSquare,
  UsersRound,
  Route,
  Menu,
  X,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuthProvider";
import { hasPermission, isSuperAdmin } from "@/lib/adminPermissions";

const menuItems = [
  { label: "Dashboard", href: "/admin", Icon: LayoutDashboard, moduleName: "dashboard", action: "view" },
  { label: "Products", href: "/admin/products", Icon: Package },
  { label: "Projects", href: "/admin/projects", Icon: FolderKanban, moduleName: "projects", action: "view" },
  { label: "Blogs", href: "/admin/blogs", Icon: FileText, moduleName: "blogs", action: "view" },
  { label: "Careers", href: "/admin/careers", Icon: BriefcaseBusiness, moduleName: "careers", action: "view" },
  { label: "Applications", href: "/admin/applications", Icon: ClipboardList, moduleName: "applications", action: "view" },
  { label: "Inquiries", href: "/admin/inquiries", Icon: MessageSquare, moduleName: "inquiries", action: "view" },
  { label: "Users & Roles", href: "/admin/users", Icon: UsersRound, superAdminOnly: true },
  { label: "URL Redirection", href: "/admin/redirects", Icon: Route, moduleName: "redirects", action: "view" },
];

function Sidebar({ open, onClose, collapsed, onCollapse }) {
  const pathname = usePathname();
  const { signOut, user } = useAdminAuth();
  const router = useRouter();

  const visibleItems = useMemo(
    () =>
      menuItems.filter((item) => {
        if (item.label === "Products") {
          return true;
        }

        if (item.superAdminOnly) {
          return isSuperAdmin(user);
        }

        if (!item.moduleName) {
          return true;
        }

        return hasPermission(user, item.moduleName, item.action || "view");
      }),
    [user]
  );

  const logout = () => {
    signOut();
    router.replace("/admin/login");
  };

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-[#E8E1F3] bg-white transition-all duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[84px]" : ""}`}
      >
        <div className="flex h-[78px] items-center justify-between border-b border-[#EEEAF5] px-6">
          <Link href="/admin" className={`relative h-9 w-[150px] ${collapsed ? "lg:hidden" : ""}`}>
            <Image
              src="/assets/logo/Perroqueta-block.png"
              alt="Perroqueta"
              fill
              sizes="150px"
              className="object-contain object-left"
            />
          </Link>

          <button onClick={onClose} className="lg:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={onCollapse}
            className="hidden rounded-lg p-2 text-[#777] transition hover:bg-[#F4F0FA] lg:block"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {visibleItems.map(({ label, href, Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
                  active
                    ? "bg-[#6030C6] text-white"
                    : "text-[#666] hover:bg-[#F6F2FC] hover:text-[#6030C6]"
                }`}
              >
                <span className="flex w-5 shrink-0 items-center justify-center"><Icon className="h-[18px] w-[18px]" /></span>
                <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#EEEAF5] p-4">
          <button
            onClick={logout}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] font-semibold text-[#777] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { user, status } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const activeItem = menuItems.find((item) =>
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
  );

  if (pathname === "/admin/login") {
    return children;
  }

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F7F4FC]">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#6030C6]/30 border-t-[#6030C6]" />
      </div>
    );
  }

  if (!user) {
    router.replace("/admin/login");
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#F7F4FC]">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        collapsed={collapsed}
        onCollapse={() => setCollapsed((value) => !value)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[78px] shrink-0 items-center justify-between border-b border-[#E8E1F3] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 text-[#6030C6] transition hover:bg-[#F4F0FA] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">
                Admin Portal
              </p>

              <h1 className="text-[20px] font-bold text-[#171717]">
                {activeItem?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg border border-[#6030C6] px-4 py-2 text-[13px] font-semibold text-[#6030C6] transition hover:bg-[#6030C6] hover:text-white md:flex"
            >
              View Website
              <ExternalLink className="h-4 w-4" />
            </Link>

            <div className="hidden text-right sm:block">
              <p className="text-[13px] font-semibold text-[#333]">{user.name}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#888]">
                {user.role?.replace("_", " ")}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6030C6] text-sm font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
