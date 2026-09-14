"use client";

import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  useAdminAuth,
} from "@/components/Admin/AdminAuthProvider";

import AdminAccessDenied from "@/components/Admin/AccessDenied";

import {
  hasPermission,
  isSuperAdmin,
} from "@/lib/adminPermissions";

import {
  deleteInquiry as deleteInquiryRequest,
  fetchInquiryById,
  fetchInquiries,
  updateInquiryStatus,
} from "@/services/inquiryService";

const PAGE_SIZE = 20;

const STATUSES = [
  "Unread",
  "Read",
];

const statusClasses = {
  Unread:
    "border-orange-200 bg-orange-50 text-orange-700",

  Read:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function normalizeStatus(status) {
  if (status === "New") {
    return "Unread";
  }

  if (
    status === "Contacted" ||
    status === "Closed"
  ) {
    return "Read";
  }

  return status || "Unread";
}

function Badge({ status }) {
  const normalizedStatus =
    normalizeStatus(status);

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-[12px] font-bold ${statusClasses[normalizedStatus] ||
        statusClasses.Unread
        }`}
    >
      {normalizedStatus}
    </span>
  );
}

const sourceClasses = {
  "Contact Page":
    "border-blue-200 bg-blue-50 text-blue-700",

  "Get In Touch Popup":
    "border-[#D9CBF5] bg-[#F3EEFB] text-[#6030C6]",

  "Footer CTA Popup":
    "border-orange-200 bg-orange-50 text-orange-700",

  "Product Page Popup":
    "border-emerald-200 bg-emerald-50 text-emerald-700",

  Website:
    "border-gray-200 bg-gray-50 text-gray-600",
};

function SourceBadge({ source }) {
  const label = source || "Website";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-[12px] font-bold ${sourceClasses[label] ||
        sourceClasses.Website
        }`}
    >
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#E8E1F3] bg-white p-5 shadow-[0_10px_30px_rgba(49,29,91,0.05)]">
      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8C84A2]">
        {label}
      </p>

      <p className="mt-3 text-[30px] font-bold text-[#6030C6]">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}) {
  return (
    <div className="min-h-[88px] rounded-[18px] border border-[#EEE6FB] bg-[#FBF8FF] p-4 shadow-[0_10px_24px_rgba(49,29,91,0.035)]">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8B83A0]">
        <Icon className="h-4 w-4 text-[#FF8626]" />

        {label}
      </div>

      <div className="mt-2 break-words text-[14px] leading-6 text-[#2A2238]">
        {children}
      </div>
    </div>
  );
}

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

export default function AdminInquiriesPage() {
  const { token, user } =
    useAdminAuth();

  const canView =
    isSuperAdmin(user) ||
    hasPermission(
      user,
      "inquiries",
      "view"
    );

  const canEdit =
    isSuperAdmin(user) ||
    hasPermission(
      user,
      "inquiries",
      "edit"
    );

  const canDelete =
    isSuperAdmin(user) ||
    hasPermission(
      user,
      "inquiries",
      "delete"
    );

  const [
    inquiries,
    setInquiries,
  ] = useState([]);

  const [
    stats,
    setStats,
  ] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    savingId,
    setSavingId,
  ] = useState("");

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pages,
    setPages,
  ] = useState(1);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    selectedInquiry,
    setSelectedInquiry,
  ] = useState(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  const loadInquiries =
    async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await fetchInquiries({
            token,

            search:
              search.trim(),

            status:
              statusFilter === "all"
                ? ""
                : statusFilter,

            page,

            limit:
              PAGE_SIZE,
          });

        setInquiries(
          data.inquiries || []
        );

        setStats(
          data.stats || {
            total: 0,
            unread: 0,
            read: 0,
          }
        );

        setTotal(
          data.total || 0
        );

        setPages(
          data.pages || 1
        );
      } catch (
      loadError
      ) {
        setError(
          loadError.message ||
          "Unable to load inquiries."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadInquiries();
  }, [
    token,
    page,
    statusFilter,
    search,
  ]);

  const openInquiry =
    async (inquiry) => {
      setSelectedInquiry(
        inquiry
      );

      setError("");

      try {
        const data =
          await fetchInquiryById({
            token,
            id: inquiry._id,
          });

        if (
          data.inquiry
        ) {
          setSelectedInquiry(
            data.inquiry
          );

          setInquiries(
            (current) =>
              current.map(
                (item) =>
                  item._id ===
                    data.inquiry._id
                    ? data.inquiry
                    : item
              )
          );

          await loadInquiries();
        }
      } catch (
      loadError
      ) {
        setError(
          loadError.message ||
          "Unable to load inquiry details."
        );
      }
    };

  const changeStatus =
    async (
      inquiryId,
      status
    ) => {
      const previous =
        inquiries;

      const previousSelected =
        selectedInquiry;

      try {
        setSavingId(
          inquiryId
        );

        setError("");

        const data =
          await updateInquiryStatus({
            token,
            id: inquiryId,
            status,
          });

        const updated =
          data.inquiry;

        setInquiries(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                  inquiryId
                  ? updated
                  : item
            )
        );

        setSelectedInquiry(
          (current) =>
            current &&
              current._id ===
              inquiryId
              ? updated
              : current
        );

        await loadInquiries();
      } catch (
      updateError
      ) {
        setInquiries(
          previous
        );

        setSelectedInquiry(
          previousSelected
        );

        setError(
          updateError.message ||
          "Unable to update status."
        );
      } finally {
        setSavingId("");
      }
    };

  const confirmDelete =
    async () => {
      if (
        !deleteTarget?._id
      ) {
        return;
      }

      try {
        setDeleting(true);
        setError("");

        await deleteInquiryRequest({
          token,
          id:
            deleteTarget._id,
        });

        if (
          selectedInquiry?._id ===
          deleteTarget._id
        ) {
          setSelectedInquiry(
            null
          );
        }

        setDeleteTarget(
          null
        );

        await loadInquiries();
      } catch (
      deleteError
      ) {
        setError(
          deleteError.message ||
          "Unable to delete inquiry."
        );
      } finally {
        setDeleting(false);
      }
    };

  if (!canView) {
    return (
      <AdminAccessDenied
        title="Access Denied"
        description="You do not have access to this module."
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      {/* Header */}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF8626]">
          Customer Enquiries
        </p>

        <h1 className="mt-2 text-[30px] font-bold text-[#171717]">
          Inquiries
        </h1>

        <p className="mt-2 text-[15px] text-[#777]">
          View and manage website enquiries.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total"
          value={
            stats.total
          }
        />

        <StatCard
          label="Unread"
          value={
            stats.unread
          }
        />

        <StatCard
          label="Read"
          value={
            stats.read
          }
        />
      </div>

      {/* Filters */}
      <div className="mt-7 rounded-2xl border border-[#E8E1F3] bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="flex h-[46px] items-center rounded-xl border border-[#DDD7E8] px-3 focus-within:border-[#6030C6]">
            <Search className="h-4 w-4 text-[#999]" />

            <input
              value={
                search
              }
              onChange={(
                event
              ) => {
                setSearch(
                  event.target.value
                );

                setPage(1);
              }}
              placeholder="Search name, email, phone, product or message..."
              className="h-full w-full bg-transparent px-3 text-[14px] outline-none"
            />
          </div>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) => {
              setStatusFilter(
                event.target.value
              );

              setPage(1);
            }}
            className="h-[46px] rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] outline-none focus:border-[#6030C6]"
          >
            <option value="all">
              All Statuses
            </option>

            {STATUSES.map(
              (status) => (
                <option
                  key={
                    status
                  }
                  value={
                    status
                  }
                >
                  {status}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {error &&
        !selectedInquiry &&
        !deleteTarget ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
          {error}
        </div>
      ) : null}

      {/* List */}
      <div className="mt-6">
        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#E8E1F3] bg-white">
            <Loader2 className="h-7 w-7 animate-spin text-[#6030C6]" />
          </div>
        ) : inquiries.length ===
          0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCD3EA] bg-white px-5 text-center">
            <MessageSquare className="h-8 w-8 text-[#6030C6]" />

            <h3 className="mt-4 text-[17px] font-bold">
              No inquiries found
            </h3>

            <p className="mt-2 text-[14px] text-[#888]">
              New website enquiries will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-[18px] border border-[#E8E1F3] bg-white lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#FBF8FF]">
                    <tr className="text-left text-[12px] font-bold uppercase tracking-[0.08em] text-[#8B83A0]">
                      <th className="px-5 py-4">
                        Customer
                      </th>

                      <th className="px-5 py-4">
                        Phone
                      </th>

                      <th className="px-5 py-4">
                        Product
                      </th>

                      <th className="px-5 py-4">
                        Source
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F3EEF9]">
                    {inquiries.map(
                      (
                        inquiry
                      ) => (
                        <tr
                          key={
                            inquiry._id
                          }
                          className={
                            normalizeStatus(
                              inquiry.status
                            ) ===
                              "Unread"
                              ? "bg-orange-50/30 hover:bg-orange-50/60"
                              : "hover:bg-[#FCFAFF]"
                          }
                        >
                          <td className="px-5 py-4">
                            <p className="text-[15px] font-bold text-[#222]">
                              {
                                inquiry.fullName
                              }
                            </p>

                            {inquiry.email ? (
                              <p className="mt-1 text-[13px] text-[#777]">
                                {
                                  inquiry.email
                                }
                              </p>
                            ) : null}
                          </td>

                          <td className="px-5 py-4 text-[14px] text-[#555]">
                            {
                              inquiry.phone
                            }
                          </td>

                          <td className="px-5 py-4 text-[14px] text-[#555]">
                            {inquiry.productInterest ||
                              "Not specified"}
                          </td>

                          <td className="px-5 py-4">
                            <SourceBadge
                              source={
                                inquiry.source
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-[13px] text-[#666]">
                            {formatDate(
                              inquiry.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <Badge
                              status={
                                inquiry.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openInquiry(
                                    inquiry
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-[#F3EEFB] px-3 py-2 text-[13px] font-bold text-[#6030C6]"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget(
                                    inquiry
                                  )
                                }
                                disabled={
                                  !canDelete
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-bold text-red-600 disabled:opacity-40"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="grid gap-4 lg:hidden">
              {inquiries.map(
                (
                  inquiry
                ) => (
                  <article
                    key={
                      inquiry._id
                    }
                    className={`rounded-[18px] border p-5 ${normalizeStatus(
                      inquiry.status
                    ) === "Unread"
                        ? "border-orange-200 bg-orange-50/30"
                        : "border-[#E8E1F3] bg-white"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[17px] font-bold">
                          {
                            inquiry.fullName
                          }
                        </h3>

                        <p className="mt-1 text-[13px] text-[#777]">
                          {
                            inquiry.phone
                          }
                        </p>
                      </div>

                      <Badge
                        status={
                          inquiry.status
                        }
                      />
                    </div>

                    <p className="mt-4 text-[14px] text-[#555]">
                      {inquiry.productInterest ||
                        "No product selected"}
                    </p>

                    <div className="mt-3">
                      <SourceBadge
                        source={
                          inquiry.source
                        }
                      />
                    </div>

                    <p className="mt-2 text-[13px] text-[#888]">
                      {formatDate(
                        inquiry.createdAt
                      )}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openInquiry(
                            inquiry
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F3EEFB] px-4 py-3 text-[13px] font-bold text-[#6030C6]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(
                            inquiry
                          )
                        }
                        disabled={
                          !canDelete
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600 disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading &&
        pages > 1 ? (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#E8E1F3] bg-white p-4">
          <p className="text-[14px] text-[#666]">
            Page {page} of{" "}
            {pages} · {total} inquiries
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={
                page <= 1
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      current - 1,
                      1
                    )
                )
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDD7E8] px-4 text-[13px] font-bold disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <button
              type="button"
              disabled={
                page >= pages
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.min(
                      current + 1,
                      pages
                    )
                )
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDD7E8] px-4 text-[13px] font-bold disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* View Modal - No Internal Scroll */}
      {selectedInquiry ? (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#17112D]/55 p-3 backdrop-blur-[3px] sm:p-4">
          <div className="w-full max-w-[960px] overflow-hidden rounded-[26px] bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between bg-[linear-gradient(135deg,#6030C6,#6E3DE2,#FF8626)] px-6 py-5 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
                  Inquiry Details
                </p>

                <h2 className="mt-2 text-[26px] font-bold leading-tight">
                  {
                    selectedInquiry.fullName
                  }
                </h2>

                <p className="mt-2 text-[13px] text-white/85">
                  {selectedInquiry.productInterest ||
                    "General Inquiry"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedInquiry(
                    null
                  );

                  setError("");
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6">
              {error ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-600">
                  {error}
                </div>
              ) : null}

              {/* Details Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow
                  icon={
                    UserRound
                  }
                  label="Full Name"
                >
                  {
                    selectedInquiry.fullName
                  }
                </DetailRow>

                <DetailRow
                  icon={
                    Phone
                  }
                  label="Phone"
                >
                  {
                    selectedInquiry.phone
                  }
                </DetailRow>

                <DetailRow
                  icon={
                    Mail
                  }
                  label="Email"
                >
                  {selectedInquiry.email ||
                    "Not provided"}
                </DetailRow>

                <DetailRow
                  icon={
                    MessageSquare
                  }
                  label="Product Interest"
                >
                  {selectedInquiry.productInterest ||
                    "Not specified"}
                </DetailRow>

                <DetailRow
                  icon={
                    MessageSquare
                  }
                  label="Source"
                >
                  <SourceBadge
                    source={
                      selectedInquiry.source
                    }
                  />
                </DetailRow>

                <DetailRow
                  icon={
                    MapPin
                  }
                  label="Location"
                >
                  {selectedInquiry.location ||
                    "Not provided"}
                </DetailRow>
              </div>

              {/* Message */}
              <div className="mt-4 rounded-[18px] border border-[#EEE6FB] bg-[#FBF8FF] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8B83A0]">
                  Message
                </p>

                <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-[#2A2238]">
                  {selectedInquiry.message ||
                    "No message provided"}
                </p>
              </div>

              {/* Status */}
              <div className="mt-4 rounded-[18px] border border-[#DDD0F4] bg-[#FBF8FF] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6030C6]">
                      Inquiry Status
                    </p>

                    <p className="mt-1 text-[13px] text-[#777]">
                      Mark this inquiry as read or unread.
                    </p>
                  </div>

                  <Badge
                    status={
                      selectedInquiry.status
                    }
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <select
                    value={
                      normalizeStatus(
                        selectedInquiry.status
                      )
                    }
                    onChange={(
                      event
                    ) =>
                      changeStatus(
                        selectedInquiry._id,
                        event.target.value
                      )
                    }
                    disabled={
                      !canEdit ||
                      savingId ===
                      selectedInquiry._id
                    }
                    className="h-[44px] flex-1 rounded-xl border border-[#DDD7E8] bg-white px-4 text-[14px] font-bold outline-none focus:border-[#6030C6] disabled:opacity-60"
                  >
                    {STATUSES.map(
                      (
                        status
                      ) => (
                        <option
                          key={
                            status
                          }
                          value={
                            status
                          }
                        >
                          {
                            status
                          }
                        </option>
                      )
                    )}
                  </select>

                  {savingId ===
                    selectedInquiry._id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#6030C6]" />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between border-t border-[#EEE6FB] bg-white px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(
                    selectedInquiry
                  )
                }
                disabled={
                  !canDelete
                }
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-200 px-5 text-[14px] font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedInquiry(
                    null
                  )
                }
                className="h-11 rounded-xl border border-[#DDD7E8] px-6 text-[14px] font-bold text-[#666] transition hover:bg-[#FBF8FF]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Modal */}
      {deleteTarget ? (
        <div className="fixed inset-0 z-[230] flex items-center justify-center bg-[#17112D]/55 p-4">
          <div className="w-full max-w-[440px] rounded-[20px] bg-white p-6 shadow-2xl">
            <Trash2 className="h-7 w-7 text-red-600" />

            <h3 className="mt-5 text-[21px] font-bold">
              Delete inquiry?
            </h3>

            <p className="mt-3 text-[14px] text-[#777]">
              Delete inquiry from{" "}
              <strong>
                {
                  deleteTarget.fullName
                }
              </strong>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
                className="h-11 rounded-xl border border-[#DDD7E8] px-4 text-[14px] font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={
                  confirmDelete
                }
                className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-4 text-[14px] font-bold text-white disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}

                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}