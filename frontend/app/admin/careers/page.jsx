"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { getAuth } from "@/services/adminAuthService";
import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { hasPermission, isSuperAdmin } from "@/lib/adminPermissions";
import {
  deleteCareer,
  fetchCareers,
  saveCareer,
} from "@/services/careerService";

const blank = {
  title: "",
  slug: "",
  department: "",
  location: "",
  jobType: "Full Time",
  workMode: "On Site",
  experience: "",
  salary: "",
  openings: 1,
  applicationDeadline: "",
  shortDescription: "",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: "",
  status: "Open",
  published: false,
  metaTitle: "",
  metaDescription: "",
};

const types = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
];

const modes = [
  "On Site",
  "Hybrid",
  "Remote",
];

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const asLines = (value = "") =>
  Array.isArray(value)
    ? value.join("\n")
    : value || "";

function Field({
  label,
  hint,
  children,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="flex items-center justify-between gap-3 text-[12px] font-bold text-[#3D3748]">
        <span>{label}</span>

        {hint && (
          <span className="font-normal text-[#9B94A8]">
            {hint}
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function Card({
  eyebrow,
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-[18px] border border-[#E8E1F3] bg-white p-5 shadow-[0_8px_30px_rgba(96,48,198,0.04)] sm:p-6 ${className}`}
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6030C6]">
          {eyebrow}
        </p>

        <h3 className="mt-1 text-[18px] font-bold text-[#241D32]">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function Input({
  className = "",
  ...props
}) {
  return (
    <input
      {...props}
      className={`mt-2 h-11 w-full rounded-xl border border-[#DDD7E8] bg-white px-3.5 text-[13px] text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10 ${className}`}
    />
  );
}

function Select({
  children,
  ...props
}) {
  return (
    <select
      {...props}
      className="mt-2 h-11 w-full rounded-xl border border-[#DDD7E8] bg-white px-3.5 text-[13px] text-[#292331] outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"
    >
      {children}
    </select>
  );
}

function Textarea({
  className = "",
  ...props
}) {
  return (
    <textarea
      {...props}
      className={`mt-2 w-full resize-y rounded-xl border border-[#DDD7E8] bg-white px-3.5 py-3 text-[13px] leading-6 text-[#292331] outline-none transition placeholder:text-[#B1ABB9] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10 ${className}`}
    />
  );
}

function PublishToggle({
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() =>
        onChange(!checked)
      }
      className="flex w-full items-center justify-between rounded-xl border border-[#E8E1F3] bg-[#FBF9FE] p-4 text-left"
    >
      <span>
        <span className="block text-[13px] font-bold text-[#342C40]">
          Publish Job
        </span>

        <span className="mt-1 block text-[11px] leading-5 text-[#8A8396]">
          Published jobs can appear on the public Careers page.
        </span>
      </span>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#6030C6]"
            : "bg-[#D9D3E2]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        >
          {checked && (
            <Check className="h-4 w-4 p-0.5 text-[#6030C6]" />
          )}
        </span>
      </span>
    </button>
  );
}

export default function CareersAdminPage() {
  const [careers, setCareers] =
    useState([]);

  const { user } = useAdminAuth();
  const canView = isSuperAdmin(user) || hasPermission(user, "careers", "view");
  const canCreate = isSuperAdmin(user) || hasPermission(user, "careers", "create");
  const canEdit = isSuperAdmin(user) || hasPermission(user, "careers", "edit");
  const canDelete = isSuperAdmin(user) || hasPermission(user, "careers", "delete");

  const [form, setForm] =
    useState(blank);

  const [editing, setEditing] =
    useState(null);

  const [modal, setModal] =
    useState(false);

  const [remove, setRemove] =
    useState(null);

  const [filters, setFilters] =
    useState({
      search: "",
      status: "",
      department: "",
      jobType: "",
    });

  const [state, setState] =
    useState({
      loading: true,
      saving: false,
      error: "",
    });

  const load = () =>
    fetchCareers({
      ...filters,
      limit: 100,
    })
      .then((data) =>
        setCareers(
          data.careers || []
        )
      )
      .catch((error) =>
        setState((prev) => ({
          ...prev,
          error: error.message,
        }))
      )
      .finally(() =>
        setState((prev) => ({
          ...prev,
          loading: false,
        }))
      );

  useEffect(() => {
    load();
  }, [
    filters.search,
    filters.status,
    filters.department,
    filters.jobType,
  ]);

  const stats = {
    total: careers.length,

    open: careers.filter(
      (item) =>
        item.status === "Open"
    ).length,

    closed: careers.filter(
      (item) =>
        item.status === "Closed"
    ).length,

    drafts: careers.filter(
      (item) =>
        !item.published
    ).length,
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...blank,
    });

    setState((prev) => ({
      ...prev,
      error: "",
    }));

    setModal(true);
  };

  const openEdit = (career) => {
    setEditing(career);

    setForm({
      ...career,

      salary:
        career.salary || "",

      applicationDeadline:
        career.applicationDeadline?.slice(
          0,
          10
        ) || "",

      responsibilities:
        asLines(
          career.responsibilities
        ),

      requirements:
        asLines(
          career.requirements
        ),

      skills:
        asLines(
          career.skills
        ),
    });

    setState((prev) => ({
      ...prev,
      error: "",
    }));

    setModal(true);
  };

  const closeModal = () => {
    if (!state.saving) {
      setModal(false);
    }
  };

  const change = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

      ...(name === "title" &&
      !editing
        ? {
            slug:
              slugify(value),
          }
        : {}),
    }));
  };

  const submit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.department.trim() ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      setState((prev) => ({
        ...prev,
        error:
          "Please complete all required fields.",
      }));

      return;
    }

    setState((prev) => ({
      ...prev,
      saving: true,
      error: "",
    }));

    try {
      await saveCareer({
        token:
          getAuth().token,

        id:
          editing?._id,

        career: {
          ...form,

          salary:
            form.salary
              ? Number(
                  form.salary
                )
              : "",

          openings:
            Math.max(
              Number(
                form.openings
              ) || 1,
              1
            ),

          responsibilities:
            form.responsibilities
              .split("\n")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),

          requirements:
            form.requirements
              .split("\n")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),

          skills:
            form.skills
              .split("\n")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean),
        },
      });

      setModal(false);

      await load();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error.message,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        saving: false,
      }));
    }
  };

  const removeJob = async () => {
    setState((prev) => ({
      ...prev,
      saving: true,
    }));

    try {
      await deleteCareer({
        token:
          getAuth().token,

        id:
          remove._id,
      });

      setRemove(null);

      await load();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error.message,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        saving: false,
      }));
    }
  };

  if (!canView) {
    return <AdminAccessDenied title="Access Denied" description="You do not have access to this module." />;
  }

  return (
    <main className="min-h-full bg-[#FBF9FE]">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6030C6]">
              Careers
            </p>

            <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-[#241D32]">
              Career Management
            </h1>

            <p className="mt-2 text-[13px] text-[#777080]">
              Manage open roles, publishing and job details.
            </p>
          </div>

          <button
            onClick={openCreate} disabled={!canCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-5 py-3 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(96,48,198,0.2)] transition hover:bg-[#5127AE]"
          >
            <Plus className="h-4 w-4" />
            Add Job
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Total Jobs",
              stats.total,
              "text-[#6030C6]",
            ],

            [
              "Open Jobs",
              stats.open,
              "text-emerald-600",
            ],

            [
              "Closed Jobs",
              stats.closed,
              "text-[#777080]",
            ],

            [
              "Drafts",
              stats.drafts,
              "text-[#FF8626]",
            ],
          ].map(
            ([
              label,
              value,
              color,
            ]) => (
              <div
                key={label}
                className="rounded-[16px] border border-[#E8E1F3] bg-white p-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9B94A8]">
                  {label}
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${color}`}
                >
                  {value}
                </p>
              </div>
            )
          )}
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 rounded-[18px] border border-[#E8E1F3] bg-white p-4 shadow-[0_8px_30px_rgba(96,48,198,0.03)] md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#DDD7E8] px-3">
            <Search className="h-4 w-4 text-[#A39CAC]" />

            <input
              value={
                filters.search
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search:
                    e.target.value,
                })
              }
              placeholder="Search by job title, department or location"
              className="h-11 w-full text-[13px] outline-none placeholder:text-[#B1ABB9]"
            />
          </div>

          {[
            [
              "status",
              "Status",
              [
                "Open",
                "Closed",
              ],
            ],

            [
              "department",
              "Department",
              [
                "Sales",
                "Engineering",
                "Marketing",
              ],
            ],

            [
              "jobType",
              "Job Type",
              types,
            ],
          ].map(
            ([
              name,
              label,
              values,
            ]) => (
              <select
                key={name}
                value={
                  filters[
                    name
                  ]
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [name]:
                      e.target
                        .value,
                  })
                }
                className="h-11 rounded-xl border border-[#DDD7E8] bg-white px-3 text-[13px] text-[#4B4454]"
              >
                <option value="">
                  {label}
                </option>

                {values.map(
                  (value) => (
                    <option
                      key={
                        value
                      }
                    >
                      {
                        value
                      }
                    </option>
                  )
                )}
              </select>
            )
          )}
        </div>

        {state.error &&
          !modal && (
            <p className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-[13px] text-red-600">
              {
                state.error
              }
            </p>
          )}

        {/* Career List */}
        {state.loading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="animate-spin text-[#6030C6]" />
          </div>
        ) : careers.length ===
          0 ? (
          <div className="mt-5 rounded-[18px] border border-dashed border-[#D8CFE6] bg-white p-16 text-center">
            <BriefcaseBusiness className="mx-auto h-8 w-8 text-[#B9ACCF]" />

            <p className="mt-4 text-[16px] font-bold text-[#3D3748]">
              No careers found
            </p>

            <p className="mt-2 text-[13px] text-[#8A8396]">
              Create a job or adjust the filters to see results.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {careers.map(
              (career) => (
                <article
                  key={
                    career._id
                  }
                  className="rounded-[18px] border border-[#E8E1F3] bg-white p-5 transition hover:border-[#CDBBEA] hover:shadow-[0_8px_30px_rgba(96,48,198,0.07)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-[17px] font-bold text-[#292331]">
                        {
                          career.title
                        }
                      </h2>

                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#888190]">
                        <MapPin className="h-3.5 w-3.5 text-[#FF8626]" />

                        {
                          career.department
                        }{" "}
                        ·{" "}
                        {
                          career.location
                        }
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        career.status ===
                        "Open"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {
                        career.status
                      }
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#66606E]">
                    <span className="rounded-full bg-[#F5F1FB] px-3 py-1">
                      {
                        career.jobType
                      }
                    </span>

                    {career.salary && (
                      <span className="rounded-full bg-[#F5F1FB] px-3 py-1">
                        ₹
                        {Number(
                          career.salary
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}

                    <span className="rounded-full bg-[#F5F1FB] px-3 py-1">
                      {
                        career.openings
                      }{" "}
                      opening(s)
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 ${
                        career.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {career.published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  <div className="mt-5 flex justify-end gap-2 border-t border-[#F0EDF5] pt-4">
                    <button
                      onClick={() => openEdit(career)} disabled={!canEdit}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3EEFB] px-3 py-2 text-[11px] font-bold text-[#6030C6]"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => setRemove(career)} disabled={!canDelete}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#17112D]/55 p-3 backdrop-blur-[3px] sm:p-6">
          <form
            onSubmit={
              submit
            }
            className="flex max-h-[94vh] w-full max-w-[1280px] flex-col overflow-hidden rounded-[22px] bg-[#FBF9FE] shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E8E1F3] bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6030C6]">
                  {editing
                    ? "Edit Job"
                    : "New Job"}
                </p>

                <h2 className="mt-1 text-[21px] font-bold text-[#241D32]">
                  {editing
                    ? "Update Career Opportunity"
                    : "Create Career Opportunity"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#777080] transition hover:bg-[#F3EEFB] hover:text-[#6030C6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
                {/* Left */}
                <div className="space-y-5">
                  <Card
                    eyebrow="01 · Role setup"
                    title="Basic Information"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Job Title *">
                        <Input
                          name="title"
                          value={
                            form.title
                          }
                          onChange={
                            change
                          }
                          placeholder="e.g. Senior Sales Executive"
                          required
                        />
                      </Field>

                      <Field label="Department *">
                        <Input
                          name="department"
                          value={
                            form.department
                          }
                          onChange={
                            change
                          }
                          placeholder="e.g. Sales"
                          required
                        />
                      </Field>

                      <Field label="Location *">
                        <Input
                          name="location"
                          value={
                            form.location
                          }
                          onChange={
                            change
                          }
                          placeholder="e.g. Avinashi, Tamil Nadu"
                          required
                        />
                      </Field>

                      <Field label="Job Type *">
                        <Select
                          name="jobType"
                          value={
                            form.jobType
                          }
                          onChange={
                            change
                          }
                        >
                          {types.map(
                            (
                              value
                            ) => (
                              <option
                                key={
                                  value
                                }
                              >
                                {
                                  value
                                }
                              </option>
                            )
                          )}
                        </Select>
                      </Field>

                      <Field label="Work Mode">
                        <Select
                          name="workMode"
                          value={
                            form.workMode
                          }
                          onChange={
                            change
                          }
                        >
                          {modes.map(
                            (
                              value
                            ) => (
                              <option
                                key={
                                  value
                                }
                              >
                                {
                                  value
                                }
                              </option>
                            )
                          )}
                        </Select>
                      </Field>

                      <Field label="Experience">
                        <Input
                          name="experience"
                          value={
                            form.experience
                          }
                          onChange={
                            change
                          }
                          placeholder="2 - 4 Years or 3+ Years"
                        />
                      </Field>

                      {/* Salary */}
                      <Field
                        label="Salary"
                        hint="Monthly INR · Optional"
                      >
                        <div className="mt-2 flex h-11 overflow-hidden rounded-xl border border-[#DDD7E8] bg-white transition focus-within:border-[#6030C6] focus-within:ring-2 focus-within:ring-[#6030C6]/10">
                          <span className="flex w-12 shrink-0 items-center justify-center border-r border-[#DDD7E8] bg-[#F8F5FC] text-[16px] font-bold text-[#6030C6]">
                            ₹
                          </span>

                          <input
                            type="number"
                            name="salary"
                            min="0"
                            step="1"
                            value={
                              form.salary
                            }
                            onChange={
                              change
                            }
                            placeholder="35000"
                            className="h-full w-full bg-white px-3.5 text-[13px] text-[#292331] outline-none placeholder:text-[#B1ABB9]"
                          />
                        </div>
                      </Field>

                      <Field label="Openings">
                        <Input
                          name="openings"
                          type="number"
                          min="1"
                          value={
                            form.openings
                          }
                          onChange={
                            change
                          }
                        />
                      </Field>

                      <Field
                        label="Application Deadline"
                        hint="Optional"
                      >
                        <Input
                          name="applicationDeadline"
                          type="date"
                          value={
                            form.applicationDeadline
                          }
                          onChange={
                            change
                          }
                        />
                      </Field>
                    </div>

                    {/* Auto URL */}
                    <div className="mt-4 rounded-xl border border-[#E8E1F3] bg-[#FBF9FE] px-4 py-3">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-[#8A8396]">
                        Job URL
                      </span>

                      <span className="mt-1 block truncate text-[12px] text-[#6030C6]">
                        perroqueta.com/careers/
                        {form.slug ||
                          "job-slug"}
                      </span>

                      <span className="mt-1 block text-[10px] text-[#9B94A8]">
                        Automatically generated from the job title.
                      </span>
                    </div>
                  </Card>

                  {/* Job Content */}
                  <Card
                    eyebrow="02 · Role content"
                    title="Job Content"
                  >
                    <Field label="Short Description">
                      <Textarea
                        name="shortDescription"
                        value={
                          form.shortDescription
                        }
                        onChange={
                          change
                        }
                        rows={2}
                        placeholder="A concise summary for the careers listing."
                      />
                    </Field>

                    <Field
                      label="Job Description *"
                      className="mt-4"
                    >
                      <Textarea
                        name="description"
                        value={
                          form.description
                        }
                        onChange={
                          change
                        }
                        rows={6}
                        placeholder="Describe the role, team and opportunity."
                        required
                      />
                    </Field>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <Field
                        label="Responsibilities"
                        hint="One per line"
                      >
                        <Textarea
                          name="responsibilities"
                          value={
                            form.responsibilities
                          }
                          onChange={
                            change
                          }
                          rows={4}
                          placeholder={
                            "Handle customer enquiries\nCoordinate with sales team"
                          }
                        />
                      </Field>

                      <Field
                        label="Requirements"
                        hint="One per line"
                      >
                        <Textarea
                          name="requirements"
                          value={
                            form.requirements
                          }
                          onChange={
                            change
                          }
                          rows={4}
                          placeholder={
                            "2+ years experience\nGood communication"
                          }
                        />
                      </Field>

                      <Field
                        label="Skills"
                        hint="One per line"
                      >
                        <Textarea
                          name="skills"
                          value={
                            form.skills
                          }
                          onChange={
                            change
                          }
                          rows={4}
                          placeholder={
                            "Sales\nCRM\nCommunication"
                          }
                        />
                      </Field>
                    </div>
                  </Card>
                </div>

                {/* Right */}
                <div className="space-y-5">
                  <Card
                    eyebrow="03 · Visibility"
                    title="Status & Publishing"
                  >
                    <Field label="Status">
                      <Select
                        name="status"
                        value={
                          form.status
                        }
                        onChange={
                          change
                        }
                      >
                        <option>
                          Open
                        </option>

                        <option>
                          Closed
                        </option>
                      </Select>
                    </Field>

                    <div className="mt-4">
                      <PublishToggle
                        checked={
                          form.published
                        }
                        onChange={(
                          value
                        ) =>
                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,
                              published:
                                value,
                            })
                          )
                        }
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          form.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {form.published
                          ? "Published"
                          : "Draft"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          form.status ===
                          "Open"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {
                          form.status
                        }
                      </span>
                    </div>
                  </Card>

                  {/* SEO */}
                  <Card
                    eyebrow="04 · Search appearance"
                    title="SEO Settings"
                  >
                    <Field
                      label="Meta Title"
                      hint={`${form.metaTitle.length} / 60`}
                    >
                      <Input
                        name="metaTitle"
                        value={
                          form.metaTitle
                        }
                        onChange={
                          change
                        }
                        placeholder="Search result title"
                      />
                    </Field>

                    <Field
                      label="Meta Description"
                      hint={`${form.metaDescription.length} / 160`}
                      className="mt-4"
                    >
                      <Textarea
                        name="metaDescription"
                        value={
                          form.metaDescription
                        }
                        onChange={
                          change
                        }
                        rows={3}
                        placeholder="Search result description"
                      />
                    </Field>

                    {(form
                      .metaTitle
                      .length >
                      60 ||
                      form
                        .metaDescription
                        .length >
                        160) && (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
                        Recommended SEO limits exceeded.
                      </p>
                    )}
                  </Card>

                  {/* Search Preview */}
                  <Card
                    eyebrow="05 · Live result"
                    title="Search Preview"
                  >
                    <div className="rounded-xl border border-[#E6E0EE] bg-white p-4">
                      <p className="truncate text-[10px] text-[#7B6B91]">
                        perroqueta.com
                        {" › "}
                        careers
                        {" › "}
                        {form.slug ||
                          "job-slug"}
                      </p>

                      <p className="mt-3 line-clamp-2 text-[15px] font-semibold leading-5 text-[#2E6B35]">
                        {form.metaTitle ||
                          form.title ||
                          "Job Title"}
                      </p>

                      <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-[#68616F]">
                        {form.metaDescription ||
                          form.shortDescription ||
                          "Job description will appear here."}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {state.error && (
              <div className="shrink-0 border-t border-red-100 bg-red-50 px-5 py-3 text-[12px] font-medium text-red-600 sm:px-7">
                {
                  state.error
                }
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#E8E1F3] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  state.saving
                }
                className="h-11 rounded-xl border border-[#DDD7E8] px-5 text-[13px] font-bold text-[#68616F] transition hover:bg-[#F8F5FC] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  state.saving
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-6 text-[13px] font-bold text-white shadow-[0_7px_18px_rgba(96,48,198,0.18)] transition hover:bg-[#5127AE] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state.saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {state.saving
                  ? "Saving..."
                  : editing
                    ? "Update Job"
                    : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {remove && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-[#17112D]/55 p-4">
          <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#241D32]">
              Delete Job?
            </h2>

            <p className="mt-3 text-[13px] leading-6 text-[#777080]">
              Delete{" "}
              <strong className="text-[#3D3748]">
                {
                  remove.title
                }
              </strong>
              ? Existing applications are preserved.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setRemove(null)
                }
                className="rounded-xl border border-[#DDD7E8] px-4 py-2.5 text-[13px] font-bold text-[#68616F]"
              >
                Cancel
              </button>

              <button
                onClick={
                  removeJob
                }
                disabled={
                  state.saving
                }
                className="rounded-xl bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-50"
              >
                {state.saving
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
