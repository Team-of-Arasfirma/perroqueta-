"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminShell from "@/components/Admin/AdminShell";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "@/components/Admin/AdminAuthProvider";

function AdminRouteContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status !== "ready") return;

    if (isLoginPage && user) {
      router.replace("/admin");
      return;
    }

    if (!isLoginPage && !user) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, router, status, user]);

  // Wait until authentication is checked
  if (status !== "ready") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4FC]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6030C6]/30 border-t-[#6030C6]" />
      </div>
    );
  }

  // Login page should not use AdminShell
  if (isLoginPage) {
    if (user) return null;

    return children;
  }

  // Prevent protected admin content from flashing
  if (!user) {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminRouteContent>{children}</AdminRouteContent>
    </AdminAuthProvider>
  );
}