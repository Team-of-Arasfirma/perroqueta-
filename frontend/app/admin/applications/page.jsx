"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Search,
  Trash2,
  ExternalLink,
  CalendarDays,
  BriefcaseBusiness,
  Phone,
  Mail,
  MapPin,
  FileText,
  UserRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { hasPermission, isSuperAdmin } from "@/lib/adminPermissions";
import { fetchCareers } from "@/services/careerService";

import {
  deleteApplication as deleteApplicationRequest,
  fetchApplicationById,
  fetchApplications,
  updateApplicationStatus,
} from "@/services/applicationService";

import {
  formatApplicationDate,
  getApplicationStatusStyles,
  getApplicationStatusLabel,
  APPLICATION_STATUSES,
} from "@/lib/applicationUtils";

const PAGE_SIZE = 20;

const statusMeta = {
  Total: "text-[#6030C6]",
  New: "text-[#6030C6]",
  Shortlisted: "text-[#FF8626]",
  Hired: "text-emerald-600",
};

const formatExperience = (value = "") =>
  value || "Not specified";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E8E1F3] bg-white p-5 shadow-[0_10px_30px_rgba(49,29,91,0.05)]">
      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8C84A2]">
        {label}
      </p>

      <p
        className={`mt-3 text-[30px] font-bold ${
          statusMeta[label] || "text-[#171717]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({ children, status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-bold ${getApplicationStatusStyles(
        status
      )}`}
    >
      {children}
    </span>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}) {
  return (
    <div className="rounded-[16px] border border-[#EEE6FB] bg-[#FBF8FF] p-4">
      <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#8B83A0]">
        <Icon className="h-4 w-4 text-[#FF8626]" />

        {label}
      </div>

      <div className="mt-2 text-[15px] leading-6 text-[#2A2238]">
        {children}
      </div>
    </div>
  );
}

export default function AdminApplicationsPage() {
  const { token, user } = useAdminAuth();
  const canView = isSuperAdmin(user) || hasPermission(user, "applications", "view");
  const canEdit = isSuperAdmin(user) || hasPermission(user, "applications", "edit");
  const canDelete = isSuperAdmin(user) || hasPermission(user, "applications", "delete");

  const [applications, setApplications] =
    useState([]);

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    shortlisted: 0,
    hired: 0,
  });

  const [careerOptions, setCareerOptions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    loadingCareers,
    setLoadingCareers,
  ] = useState(true);

  const [error, setError] =
    useState("");

  const [savingId, setSavingId] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    careerFilter,
    setCareerFilter,
  ] = useState("all");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  const loadApplications =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await fetchApplications({
            token,

            search:
              search.trim(),

            status:
              statusFilter ===
              "all"
                ? ""
                : statusFilter,

            careerId:
              careerFilter ===
              "all"
                ? ""
                : careerFilter,

            page,
            limit: PAGE_SIZE,
          });

        setApplications(
          data.applications || []
        );

        setStats(
          data.stats || {
            total: 0,
            new: 0,
            shortlisted: 0,
            hired: 0,
          }
        );

        setTotal(
          data.total || 0
        );

        setPages(
          data.pages || 1
        );

        if (
          page >
            (data.pages || 1) &&
          (data.pages || 1) > 0
        ) {
          setPage(
            data.pages || 1
          );
        }
      } catch (loadError) {
        setError(
          loadError.message ||
            "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

  const loadCareers =
    async () => {
      try {
        setLoadingCareers(
          true
        );

        const data =
          await fetchCareers({
            limit: 100,
          });

        setCareerOptions(
          data.careers || []
        );
      } catch (loadError) {
        setError(
          loadError.message ||
            "Unable to load careers."
        );
      } finally {
        setLoadingCareers(
          false
        );
      }
    };

  useEffect(() => {
    if (!token) return;

    loadApplications();
  }, [
    token,
    page,
    statusFilter,
    careerFilter,
    search,
  ]);

  useEffect(() => {
    loadCareers();
  }, []);

  const refreshApplications =
    async () => {
      await loadApplications();
    };

  const openApplication =
    async (application) => {
      setSelectedApplication(
        application
      );

      setError("");

      try {
        const response =
          await fetchApplicationById(
            {
              token,
              id: application._id,
            }
          );

        if (
          response.application
        ) {
          setSelectedApplication(
            response.application
          );
        }
      } catch (loadError) {
        setError(
          loadError.message ||
            "Unable to load application details."
        );
      }
    };

  const updateStatus = async (
    applicationId,
    status
  ) => {
    const previousApplications =
      applications;

    const previousSelected =
      selectedApplication;

    try {
      setSavingId(
        applicationId
      );

      setError("");

      const response =
        await updateApplicationStatus(
          {
            token,
            id: applicationId,
            status,
          }
        );

      const updatedApplication =
        response.application;

      setApplications(
        (current) =>
          current.map(
            (application) =>
              application._id ===
              applicationId
                ? updatedApplication
                : application
          )
      );

      setSelectedApplication(
        (current) =>
          current &&
          current._id ===
            applicationId
            ? updatedApplication
            : current
      );
    } catch (updateError) {
      setApplications(
        previousApplications
      );

      setSelectedApplication(
        previousSelected
      );

      setError(
        updateError.message ||
          "Unable to update application status."
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

        await deleteApplicationRequest(
          {
            token,
            id: deleteTarget._id,
          }
        );

        setDeleteTarget(null);

        if (
          selectedApplication?._id ===
          deleteTarget._id
        ) {
          setSelectedApplication(
            null
          );
        }

        await refreshApplications();
      } catch (deleteError) {
        setError(
          deleteError.message ||
            "Unable to delete application."
        );
      } finally {
        setDeleting(false);
      }
    };

  const getResumeExtension = (
    application
  ) => {
    const name =
      application?.resume
        ?.originalName || "";

    return name
      .split(".")
      .pop()
      ?.toLowerCase();
  };

  const openResume = (
    application
  ) => {
    const resumeUrl =
      application?.resume?.url;

    if (!resumeUrl) {
      setError(
        "Resume is not available."
      );

      return;
    }

    setError("");

    window.open(
      resumeUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const selectedCareer =
    selectedApplication?.career
      ?.title ||
    selectedApplication?.careerTitle ||
    "Job details unavailable";

  const selectedResumeUrl =
    selectedApplication?.resume
      ?.url || "";

  const selectedResumeName =
    selectedApplication?.resume
      ?.originalName ||
    "Resume";

  const selectedResumeExtension =
    getResumeExtension(
      selectedApplication
    );

  if (!canView) {
    return <AdminAccessDenied title="Access Denied" description="You do not have access to this module." />;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF8626]">
            Recruitment
          </p>

          <h2 className="mt-2 text-[30px] font-bold text-[#171717]">
            Applications
          </h2>

          <p className="mt-2 text-[15px] text-[#777777]">
            Manage job applicants and hiring status.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total"
          value={
            stats.total || 0
          }
        />

        <StatCard
          label="New"
          value={
            stats.new || 0
          }
        />

        <StatCard
          label="Shortlisted"
          value={
            stats.shortlisted ||
            0
          }
        />

        <StatCard
          label="Hired"
          value={
            stats.hired || 0
          }
        />
      </div>

      {/* Filters */}
      <div className="mt-7 rounded-2xl border border-[#E8E1F3] bg-white p-4 shadow-[0_10px_30px_rgba(49,29,91,0.05)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_190px_250px]">
          <div className="flex h-[46px] items-center rounded-xl border border-[#E3DDEA] px-3 focus-within:border-[#6030C6]">
            <Search className="h-4 w-4 shrink-0 text-[#999]" />

            <input
              value={search}
              onChange={(
                event
              ) => {
                setSearch(
                  event.target
                    .value
                );

                setPage(1);
              }}
              placeholder="Search applicant name, email, phone or job title..."
              className="h-full w-full bg-transparent px-3 text-[14px] text-[#333] outline-none"
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
                event.target
                  .value
              );

              setPage(1);
            }}
            className="h-[46px] rounded-xl border border-[#E3DDEA] bg-white px-4 text-[14px] text-[#555] outline-none focus:border-[#6030C6]"
          >
            <option value="all">
              All Statuses
            </option>

            {APPLICATION_STATUSES.map(
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

          <select
            value={
              careerFilter
            }
            onChange={(
              event
            ) => {
              setCareerFilter(
                event.target
                  .value
              );

              setPage(1);
            }}
            className="h-[46px] rounded-xl border border-[#E3DDEA] bg-white px-4 text-[14px] text-[#555] outline-none focus:border-[#6030C6]"
          >
            <option value="all">
              {loadingCareers
                ? "Loading careers..."
                : "All Careers"}
            </option>

            {careerOptions.map(
              (career) => (
                <option
                  key={
                    career._id
                  }
                  value={
                    career._id
                  }
                >
                  {
                    career.title
                  }
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {error &&
      !selectedApplication &&
      !deleteTarget ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
          {error}
        </div>
      ) : null}

      {/* Applications */}
      <div className="mt-6">
        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#E8E1F3] bg-white">
            <Loader2 className="h-7 w-7 animate-spin text-[#6030C6]" />
          </div>
        ) : applications.length ===
          0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCD3EA] bg-white px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EEFB]">
              <FileText className="h-6 w-6 text-[#6030C6]" />
            </div>

            <h3 className="mt-4 text-[17px] font-bold text-[#333]">
              No applications found.
            </h3>

            <p className="mt-2 text-[14px] text-[#888]">
              Try adjusting the search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-[18px] border border-[#E8E1F3] bg-white lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#F0EAFB]">
                  <thead className="bg-[#FBF8FF]">
                    <tr className="text-left text-[12px] font-bold uppercase tracking-[0.1em] text-[#8B83A0]">
                      <th className="px-5 py-4">
                        Applicant
                      </th>

                      <th className="px-5 py-4">
                        Job
                      </th>

                      <th className="px-5 py-4">
                        Contact
                      </th>

                      <th className="px-5 py-4">
                        Experience
                      </th>

                      <th className="px-5 py-4">
                        Applied Date
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
                    {applications.map(
                      (
                        application
                      ) => (
                        <tr
                          key={
                            application._id
                          }
                          className="align-top transition hover:bg-[#FCFAFF]"
                        >
                          <td className="px-5 py-4">
                            <p className="text-[16px] font-bold text-[#222]">
                              {
                                application.fullName
                              }
                            </p>

                            <p className="mt-1 text-[13px] text-[#777]">
                              {
                                application.email
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-[14px] font-semibold text-[#2A2238]">
                              {
                                application.careerTitle
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4 text-[14px] text-[#555]">
                            <p>
                              {
                                application.phone
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4 text-[14px] text-[#555]">
                            {formatExperience(
                              application.experience
                            )}
                          </td>

                          <td className="px-5 py-4 text-[14px] text-[#555]">
                            {formatApplicationDate(
                              application.appliedAt ||
                                application.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <Badge
                              status={
                                application.status
                              }
                            >
                              {getApplicationStatusLabel(
                                application.status
                              )}
                            </Badge>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openApplication(
                                    application
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3EEFB] px-3 py-2 text-[13px] font-bold text-[#6030C6] transition hover:bg-[#E8DBFB]"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              <button
                                type="button"
                                disabled={
                                  !application
                                    .resume
                                    ?.url
                                }
                                onClick={() =>
                                  openResume(
                                    application
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF2E7] px-3 py-2 text-[13px] font-bold text-[#C45F13] transition hover:bg-[#FFE6CF] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <ExternalLink className="h-4 w-4" />

                                Resume
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteTarget(application)} disabled={!canDelete}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-bold text-red-600 transition hover:bg-red-100"
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

            {/* Mobile Cards */}
            <div className="grid gap-4 lg:hidden">
              {applications.map(
                (
                  application
                ) => (
                  <article
                    key={
                      application._id
                    }
                    className="rounded-[18px] border border-[#E8E1F3] bg-white p-5 shadow-[0_10px_30px_rgba(49,29,91,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[17px] font-bold text-[#222]">
                          {
                            application.fullName
                          }
                        </h3>

                        <p className="mt-1 text-[13px] text-[#777]">
                          {
                            application.email
                          }
                        </p>
                      </div>

                      <Badge
                        status={
                          application.status
                        }
                      >
                        {getApplicationStatusLabel(
                          application.status
                        )}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-3 text-[14px] text-[#555]">
                      <p className="flex items-start gap-2">
                        <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8626]" />

                        <span>
                          {
                            application.careerTitle
                          }
                        </span>
                      </p>

                      <p className="flex items-start gap-2">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8626]" />

                        <span>
                          {
                            application.phone
                          }
                        </span>
                      </p>

                      <p className="flex items-start gap-2">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8626]" />

                        <span>
                          {formatApplicationDate(
                            application.appliedAt ||
                              application.createdAt
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() =>
                          openApplication(
                            application
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F3EEFB] px-4 py-3 text-[13px] font-bold text-[#6030C6]"
                      >
                        <Eye className="h-4 w-4" />

                        View
                      </button>

                      <button
                        type="button"
                        disabled={
                          !application
                            .resume?.url
                        }
                        onClick={() =>
                          openResume(
                            application
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF2E7] px-4 py-3 text-[13px] font-bold text-[#C45F13] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ExternalLink className="h-4 w-4" />

                        Resume
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(application)} disabled={!canDelete}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600"
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
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E8E1F3] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-[#666]">
            Showing page {page}{" "}
            of {pages} · {total}{" "}
            total applications
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      current -
                        1,
                      1
                    )
                )
              }
              disabled={
                page <= 1
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDD7E8] px-4 text-[13px] font-bold text-[#666] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />

              Prev
            </button>

            <button
              type="button"
              onClick={() =>
                setPage(
                  (current) =>
                    Math.min(
                      current +
                        1,
                      pages
                    )
                )
              }
              disabled={
                page >= pages
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDD7E8] px-4 text-[13px] font-bold text-[#666] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next

              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Application Details Modal */}
      {selectedApplication ? (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#17112D]/55 p-3 backdrop-blur-[3px] sm:p-6">
          <div className="flex max-h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-[22px] border border-[#E8E1F3] bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#EEE6FB] bg-[linear-gradient(135deg,#6030C6_0%,#6E3DE2_55%,#FF8626_130%)] px-5 py-5 text-white sm:px-7 sm:py-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                  Applicant Details
                </p>

                <h3 className="mt-2 text-[26px] font-bold sm:text-[30px]">
                  {
                    selectedApplication.fullName
                  }
                </h3>

                <p className="mt-2 text-[14px] font-medium text-white/85">
                  {
                    selectedCareer
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedApplication(
                    null
                  );

                  setError("");
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#6030C6]"
              >
                <span className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {error ? (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
                  {error}
                </div>
              ) : null}

              {/* Applicant Info */}
              <div className="grid gap-4 lg:grid-cols-2">
                <DetailRow
                  icon={UserRound}
                  label="Full Name"
                >
                  {
                    selectedApplication.fullName
                  }
                </DetailRow>

                <DetailRow
                  icon={Mail}
                  label="Email"
                >
                  {
                    selectedApplication.email
                  }
                </DetailRow>

                <DetailRow
                  icon={Phone}
                  label="Phone"
                >
                  {
                    selectedApplication.phone
                  }
                </DetailRow>

                <DetailRow
                  icon={
                    BriefcaseBusiness
                  }
                  label="Experience"
                >
                  {formatExperience(
                    selectedApplication.experience
                  )}
                </DetailRow>

                <DetailRow
                  icon={
                    BriefcaseBusiness
                  }
                  label="Current Company"
                >
                  {selectedApplication.currentCompany ||
                    "Not specified"}
                </DetailRow>

                <DetailRow
                  icon={MapPin}
                  label="Current Location"
                >
                  {selectedApplication.currentLocation ||
                    "Not specified"}
                </DetailRow>

                <DetailRow
                  icon={
                    CalendarDays
                  }
                  label="Applied Date"
                >
                  {formatApplicationDate(
                    selectedApplication.appliedAt ||
                      selectedApplication.createdAt
                  )}
                </DetailRow>

                <DetailRow
                  icon={
                    BriefcaseBusiness
                  }
                  label="Applied Position"
                >
                  {
                    selectedCareer
                  }
                </DetailRow>
              </div>

              {/* Message + Status */}
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Message */}
                <div className="rounded-[18px] border border-[#EEE6FB] bg-[#FBF8FF] p-5">
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8B83A0]">
                    Message
                  </p>

                  <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-[#2A2238]">
                    {selectedApplication.message ||
                      "No message provided."}
                  </p>
                </div>

                {/* Status */}
                <div className="rounded-[18px] border border-[#DDD0F4] bg-[linear-gradient(135deg,#FBF8FF_0%,#F7F2FF_100%)] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">
                        Application Status
                      </p>

                      <p className="mt-2 text-[14px] text-[#746C80]">
                        Update the hiring status for this applicant.
                      </p>
                    </div>

                    <Badge
                      status={
                        selectedApplication.status
                      }
                    >
                      {getApplicationStatusLabel(
                        selectedApplication.status
                      )}
                    </Badge>
                  </div>

                  <div className="mt-5">
                    <label className="text-[13px] font-bold text-[#3B3347]">
                      Change Status
                    </label>

                    <div className="mt-2 flex items-center gap-3">
                      <select
                        value={
                          selectedApplication.status
                        }
                        onChange={(
                          event
                        ) =>
                          updateStatus(
                            selectedApplication._id,
                            event
                              .target
                              .value
                          )
                        }
                        disabled={
                          savingId ===
                          selectedApplication._id
                        }
                        className="h-[48px] min-w-0 flex-1 rounded-xl border border-[#D7CAE9] bg-white px-4 text-[14px] font-bold text-[#342C40] outline-none transition focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {APPLICATION_STATUSES.map(
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
                      selectedApplication._id ? (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#DDD0F4] bg-white">
                          <Loader2 className="h-5 w-5 animate-spin text-[#6030C6]" />
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[13px] text-[#756D80]">
                      <span>
                        Current Status:
                      </span>

                      <span className="font-bold text-[#342C40]">
                        {getApplicationStatusLabel(
                          selectedApplication.status
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="mt-5 rounded-[18px] border border-[#EEE6FB] bg-white p-5 shadow-[0_8px_25px_rgba(49,29,91,0.04)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3EEFB]">
                      <FileText className="h-5 w-5 text-[#6030C6]" />
                    </div>

                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8B83A0]">
                        Resume
                      </p>

                      <p className="mt-2 break-all text-[15px] font-bold text-[#2A2238]">
                        {
                          selectedResumeName
                        }
                      </p>

                      <p className="mt-1 text-[12px] text-[#888]">
                        {selectedResumeExtension ===
                        "pdf"
                          ? "PDF Resume · Opens in a new browser tab"
                          : selectedResumeExtension ===
                              "doc" ||
                            selectedResumeExtension ===
                              "docx"
                          ? "Word document · Browser preview depends on browser support"
                          : "Resume file"}
                      </p>
                    </div>
                  </div>

                  {selectedResumeUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        openResume(
                          selectedApplication
                        )
                      }
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-5 text-[14px] font-bold text-white transition hover:bg-[#5127AE]"
                    >
                      <ExternalLink className="h-4 w-4" />

                      {selectedResumeExtension ===
                      "pdf"
                        ? "View Resume"
                        : "Open Resume"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#E9E5ED] px-5 text-[14px] font-bold text-[#999]"
                    >
                      <FileText className="h-4 w-4" />

                      No Resume
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#EEE6FB] bg-white px-5 py-4 sm:flex-row sm:justify-between sm:px-7">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedApplication)} disabled={!canDelete}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-[14px] font-bold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />

                Delete Application
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedApplication(
                    null
                  );

                  setError("");
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#DDD7E8] px-5 text-[14px] font-bold text-[#666] transition hover:bg-[#F7F4FC]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation */}
      {deleteTarget ? (
        <div className="fixed inset-0 z-[230] flex items-center justify-center bg-[#17112D]/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[440px] rounded-[20px] border border-[#E8E1F3] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h3 className="mt-5 text-[21px] font-bold text-[#222]">
              Delete application from{" "}
              {
                deleteTarget.fullName
              }
              ?
            </h3>

            <p className="mt-3 text-[14px] leading-6 text-[#777]">
              This removes the application record and attempts to remove the resume from Cloudinary as well.
            </p>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(
                    null
                  );

                  setError("");
                }}
                disabled={
                  deleting
                }
                className="h-[44px] rounded-xl border border-[#DDD7E8] px-4 text-[14px] font-semibold text-[#666]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  confirmDelete
                }
                disabled={
                  deleting
                }
                className="flex h-[44px] items-center gap-2 rounded-xl bg-red-600 px-4 text-[14px] font-semibold text-white disabled:opacity-60"
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
