"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Loader2,
  MessageSquare,
  Users,
} from "lucide-react";

import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { hasPermission, isSuperAdmin } from "@/lib/adminPermissions";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboardPage() {
  const { user, token } = useAdminAuth();

  const canView =
    isSuperAdmin(user) || hasPermission(user, "dashboard", "view");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canView || !token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/admin/dashboard`,
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load dashboard data."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err.message || "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [canView, token]);

  if (!canView) {
    return (
      <AdminAccessDenied
        title="Dashboard Access Denied"
        description="You do not have dashboard access. Please contact a super admin if you need this module enabled."
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6030C6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {error}
      </div>
    );
  }

  const stats = data?.stats || {};

  const cards = [
    [
      "Projects",
      stats.projects,
      FolderKanban,
      "published",
      "Published",
    ],
    [
      "Blogs",
      stats.blogs,
      FileText,
      "published",
      "Published",
    ],
    [
      "Careers",
      stats.careers,
      BriefcaseBusiness,
      "open",
      "Open",
    ],
    [
      "Applications",
      stats.applications,
      Users,
      "new",
      "New",
    ],
    [
      "Inquiries",
      stats.inquiries,
      MessageSquare,
      "new",
      "New",
    ],
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#FF8626]">
          Overview
        </p>

        <h2 className="mt-2 text-[30px] font-bold text-[#171717]">
          Welcome to the dashboard
        </h2>

        <p className="mt-2 text-[14px] text-[#777]">
          A live overview of your Perroqueta content and incoming
          activity.
        </p>
      </div>

      {/* Top cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(
          ([title, item, Icon, highlight, label]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#E8E1F3] bg-white p-5 shadow-[0_10px_30px_rgba(49,29,91,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1ECFB] text-[#6030C6]">
                  <Icon className="h-5 w-5" />
                </div>

                <Activity className="h-4 w-4 text-[#FF8626]" />
              </div>

              <h3 className="mt-5 text-[16px] font-bold text-[#555]">
                {title}
              </h3>

              <p className="mt-1 text-3xl font-black text-[#171717]">
                {item?.total ?? 0}
              </p>

              <p className="mt-3 text-xs font-semibold text-[#6030C6]">
                {item?.[highlight] ?? 0} {label}
              </p>
            </div>
          )
        )}
      </div>

      {/* Overview */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Projects */}
        <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5">
          <h3 className="text-lg font-bold text-[#222]">
            Projects
          </h3>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-[#F7F4FC] p-3">
              <b className="block text-lg text-[#6030C6]">
                {stats.projects?.completed ?? 0}
              </b>
              Completed
            </div>

            <div className="rounded-xl bg-[#F7F4FC] p-3">
              <b className="block text-lg text-[#6030C6]">
                {stats.projects?.ongoing ?? 0}
              </b>
              Ongoing
            </div>

            <div className="rounded-xl bg-[#F7F4FC] p-3">
              <b className="block text-lg text-[#6030C6]">
                {stats.projects?.upcoming ?? 0}
              </b>
              Upcoming
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5">
          <h3 className="text-lg font-bold text-[#222]">
            Applications
          </h3>

          <div className="mt-5 flex justify-between text-sm">
            <span className="text-[#555]">Reviewed</span>
            <b>{stats.applications?.reviewed ?? 0}</b>
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-[#555]">Shortlisted</span>
            <b>{stats.applications?.shortlisted ?? 0}</b>
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-[#555]">Hired</span>
            <b className="text-green-600">
              {stats.applications?.hired ?? 0}
            </b>
          </div>
        </section>

        {/* Admin users */}
        <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5">
          <h3 className="text-lg font-bold text-[#222]">
            Admin Users
          </h3>

          <p className="mt-4 text-3xl font-black text-[#6030C6]">
            {stats.admins?.active ?? 0}

            <span className="ml-2 text-sm font-semibold text-[#888]">
              active
            </span>
          </p>

          <p className="mt-2 text-sm text-[#777]">
            {stats.admins?.inactive ?? 0} inactive of{" "}
            {stats.admins?.total ?? 0} total users
          </p>
        </section>
      </div>

      {/* Recent activity */}
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Recent
          title="Recent Applications"
          rows={data?.recent?.applications}
          render={(row) => (
            <div className="flex flex-wrap items-center gap-2">
              <b className="text-[14px] font-semibold text-[#222]">
                {row.fullName}
              </b>

              <span className="text-[#B0A8BF]">
                •
              </span>

              <span className="text-[13px] text-[#555]">
                {row.careerTitle || "Career"}
              </span>

              <StatusBadge status={row.status} />
            </div>
          )}
        />

        <Recent
          title="Recent Inquiries"
          rows={data?.recent?.inquiries}
          render={(row) => (
            <div className="flex flex-wrap items-center gap-2">
              <b className="text-[14px] font-semibold text-[#222]">
                {row.fullName}
              </b>

              <span className="text-[#B0A8BF]">
                •
              </span>

              <span className="text-[13px] text-[#555]">
                {row.productInterest || "General inquiry"}
              </span>

              <StatusBadge status={row.status} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    String(status || "").toLowerCase();

  let classes =
    "bg-[#F3EEFB] text-[#6030C6]";

  if (
    normalizedStatus === "hired" ||
    normalizedStatus === "closed"
  ) {
    classes =
      "bg-emerald-50 text-emerald-700";
  }

  if (
    normalizedStatus === "rejected"
  ) {
    classes =
      "bg-red-50 text-red-600";
  }

  if (
    normalizedStatus === "shortlisted" ||
    normalizedStatus === "contacted"
  ) {
    classes =
      "bg-orange-50 text-orange-600";
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes}`}
    >
      {status || "New"}
    </span>
  );
}

function Recent({
  title,
  rows = [],
  render,
}) {
  return (
    <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5">
      <h3 className="text-lg font-bold text-[#222]">
        {title}
      </h3>

      {rows.length === 0 ? (
        <p className="py-8 text-sm text-[#888]">
          No recent activity.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-[#F0EBF7]">
          {rows.map((row) => (
            <div
              key={row._id}
              className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                {render(row)}
              </div>

              <time className="shrink-0 text-[12px] text-[#888]">
                {formatDate(
                  row.createdAt ||
                    row.appliedAt
                )}
              </time>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}