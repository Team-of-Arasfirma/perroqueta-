"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { hasPermission, isSuperAdmin } from "@/lib/adminPermissions";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const initialForm = {
  title: "",
  location: "",
  status: "Completed",
  published: true,
  image: null,
};

export default function AdminProjectsPage() {
  const { token, user } = useAdminAuth();
  const canView = isSuperAdmin(user) || hasPermission(user, "projects", "view");
  const canCreate = isSuperAdmin(user) || hasPermission(user, "projects", "create");
  const canEdit = isSuperAdmin(user) || hasPermission(user, "projects", "edit");
  const canDelete = isSuperAdmin(user) || hasPermission(user, "projects", "delete");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImagePreview, setOriginalImagePreview] = useState("");
  const [error, setError] = useState("");

  const [deleteProjectData, setDeleteProjectData] =
    useState(null);

  const [deleting, setDeleting] = useState(false);

  const getToken = () => {
    if (token) return token;

    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("perroquetaAdminToken") ||
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        ""
      );
    }

    return "";
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/projects`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load projects."
        );
      }

      setProjects(data.projects || []);
    } catch (err) {
      setError(
        err.message || "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const filteredProjects = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !keyword ||
        project.title
          ?.toLowerCase()
          .includes(keyword) ||
        project.location
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        !statusFilter ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const resetForm = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(initialForm);
    setImagePreview("");
    setOriginalImagePreview("");
    setEditingProject(null);
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      title: project.title || "",
      location: project.location || "",
      status: project.status || "Completed",
      published: project.published ?? true,
      image: null,
    });

    const existingImageUrl = project.image?.url || "";

    setOriginalImagePreview(existingImageUrl);
    setImagePreview(existingImageUrl);

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    resetForm();
    setModalOpen(false);
  };

  const handleChange = (event) => {
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
    }));
  };

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Image size must be below 10MB."
      );
      return;
    }

    if (
      imagePreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(
      URL.createObjectURL(file)
    );

    setError("");
  };

  const handleCancelSelectedImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(editingProject ? originalImagePreview : "");
    setError("");
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(
        "Project title is required."
      );
      return;
    }

    if (!form.location.trim()) {
      setError(
        "Project location is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "location",
        form.location.trim()
      );

      formData.append(
        "status",
        form.status
      );

      formData.append(
        "published",
        String(form.published)
      );

      if (form.image) {
        formData.append(
          "image",
          form.image
        );
      }

      const authToken =
        getToken();

      if (!authToken) {
        throw new Error(
          "Admin authentication token is missing."
        );
      }

      const url = editingProject
        ? `${API_BASE}/api/projects/${editingProject._id}`
        : `${API_BASE}/api/projects`;

      const response = await fetch(
        url,
        {
          method: editingProject
            ? "PUT"
            : "POST",

          headers: {
            Authorization: `Bearer ${authToken}`,
          },

          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to ${
              editingProject
                ? "update"
                : "create"
            } project.`
        );
      }

      await fetchProjects();

      closeModal();
    } catch (err) {
      setError(
        err.message ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !deleteProjectData?._id
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const authToken =
        getToken();

      if (!authToken) {
        throw new Error(
          "Admin authentication token is missing."
        );
      }

      const response =
        await fetch(
          `${API_BASE}/api/projects/${deleteProjectData._id}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete project."
        );
      }

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project._id !==
            deleteProjectData._id
        )
      );

      setDeleteProjectData(null);
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!canView) {
    return <AdminAccessDenied title="Access Denied" description="You do not have access to this module." />;
  }

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#FF8626]">
            Project Management
          </p>

          <h2 className="mt-2 text-[28px] font-bold text-[#171717]">
            Projects
          </h2>

          <p className="mt-2 text-[14px] text-[#777777]">
            Add, edit and manage website projects.
          </p>
        </div>

        <button
          onClick={openAddModal} disabled={!canCreate}
          className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5127AE]"
        >
          <Plus className="h-4 w-4" />

          Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#E8E1F3] bg-white p-4 md:flex-row">
        <div className="flex h-[44px] flex-1 items-center rounded-xl border border-[#E3DDEA] px-3 focus-within:border-[#6030C6]">
          <Search className="h-4 w-4 shrink-0 text-[#999]" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search project or location..."
            className="h-full w-full bg-transparent px-3 text-[13px] text-[#333] outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="h-[44px] rounded-xl border border-[#E3DDEA] bg-white px-4 text-[13px] text-[#555] outline-none focus:border-[#6030C6]"
        >
          <option value="">
            All Status
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Ongoing">
            Ongoing
          </option>

          <option value="Upcoming">
            Upcoming
          </option>
        </select>
      </div>

      {error && !modalOpen && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Project Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#E8E1F3] bg-white">
            <Loader2 className="h-7 w-7 animate-spin text-[#6030C6]" />
          </div>
        ) : filteredProjects.length ===
          0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCD3EA] bg-white px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EEFB]">
              <ImagePlus className="h-6 w-6 text-[#6030C6]" />
            </div>

            <h3 className="mt-4 text-[16px] font-bold text-[#333]">
              No projects found
            </h3>

            <p className="mt-2 text-[13px] text-[#888]">
              Add your first project or change the current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map(
              (project) => (
                <article
                  key={project._id}
                  className="overflow-hidden rounded-xl border border-[#E8E1F3] bg-white"
                >
                  {/* Square Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#F4F4F4]">
                    {project.image?.url ? (
                      <Image
                        src={
                          project.image
                            .url
                        }
                        alt={
                          project.title
                        }
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImagePlus className="h-9 w-9 text-[#B8ADC9]" />
                      </div>
                    )}

                    {/* Status */}
                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-bold sm:px-3 sm:text-[10px] ${
                          project.status ===
                          "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : project.status ===
                              "Ongoing"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {
                          project.status
                        }
                      </span>
                    </div>

                    {/* Published */}
                    <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm sm:h-8 sm:w-8 ${
                          project.published
                            ? "bg-white text-emerald-600"
                            : "bg-white text-[#999]"
                        }`}
                        title={
                          project.published
                            ? "Published"
                            : "Hidden"
                        }
                      >
                        {project.published ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    

                    <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-5 text-[#222] sm:text-[15px]">
                      {project.title}
                    </h3>

                    <div className="mt-2 flex items-start gap-1.5 text-[10px] text-[#777] sm:text-[12px]">
                      <MapPin className="mt-[1px] h-3.5 w-3.5 shrink-0 text-[#FF8626]" />

                      <span className="line-clamp-1">
                        {
                          project.location
                        }
                      </span>
                    </div>

                    

                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#EFEAF5] pt-3">
                      <button
                        onClick={() => openEditModal(project)} disabled={!canEdit}
                        className="flex h-8 items-center gap-1.5 rounded-lg bg-[#F3EEFB] px-2.5 text-[10px] font-semibold text-[#6030C6] transition hover:bg-[#E9DFFC] sm:px-3 sm:text-[11px]"
                      >
                        <Edit3 className="h-3.5 w-3.5" />

                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteProjectData(project)} disabled={!canDelete}
                        className="flex h-8 items-center gap-1.5 rounded-lg bg-red-50 px-2.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-100 sm:px-3 sm:text-[11px]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />

                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[22px] bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EEEAF5] bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6030C6]">
                  {editingProject
                    ? "Edit Project"
                    : "New Project"}
                </p>

                <h3 className="mt-1 text-[21px] font-bold text-[#222]">
                  {editingProject
                    ? "Update Project"
                    : "Add Project"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#777] hover:bg-[#F4F0FA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="text-[13px] font-semibold text-[#333]">
                  Project Image
                </label>

                <p className="mt-1 text-[11px] text-[#888]">
                  Recommended image size: 1200 × 1200 px. The full image will be visible without cropping.
                </p>

                <div className="relative mx-auto mt-3 w-full max-w-[420px]">
                  <label className="block cursor-pointer">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-dashed border-[#D8CFE6] bg-[#F4F4F4]">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Project preview"
                          fill
                          sizes="420px"
                          className="object-contain p-2"
                          unoptimized={imagePreview.startsWith("blob:")}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-8 text-center">
                          <div>
                            <ImagePlus className="mx-auto h-9 w-9 text-[#6030C6]" />

                            <p className="mt-3 text-[13px] font-semibold text-[#444]">
                              Click to upload project image
                            </p>

                            <p className="mt-1 text-[11px] text-[#999]">
                              JPG, PNG or WEBP · Maximum 10MB
                            </p>
                          </div>
                        </div>
                      )}

                      {imagePreview && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/20 hover:opacity-100">
                          <span className="rounded-lg bg-white px-4 py-2 text-[12px] font-semibold text-[#6030C6] shadow">
                            Change Image
                          </span>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {form.image && imagePreview && (
                    <button
                      type="button"
                      onClick={handleCancelSelectedImage}
                      className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                      aria-label="Cancel selected image"
                      title="Cancel selected image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-[13px] font-semibold text-[#333]">
                    Project Title *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter project title"
                    className="mt-2 h-[48px] w-full rounded-xl border border-[#DDD7E8] px-4 text-[13px] outline-none focus:border-[#6030C6]"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-[#333]">
                    Location *
                  </label>

                  <input
                    name="location"
                    value={
                      form.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: Chennai"
                    className="mt-2 h-[48px] w-full rounded-xl border border-[#DDD7E8] px-4 text-[13px] outline-none focus:border-[#6030C6]"
                  />
                </div>

                

                <div>
                  <label className="text-[13px] font-semibold text-[#333]">
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                    className="mt-2 h-[48px] w-full rounded-xl border border-[#DDD7E8] bg-white px-4 text-[13px] outline-none focus:border-[#6030C6]"
                  >
                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Ongoing">
                      Ongoing
                    </option>

                    <option value="Upcoming">
                      Upcoming
                    </option>
                  </select>
                </div>
              </div>

              {/* Published */}
              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-[#F8F5FC] px-4 py-4">
                <input
                  type="checkbox"
                  name="published"
                  checked={
                    form.published
                  }
                  onChange={
                    handleChange
                  }
                  className="h-4 w-4 accent-[#6030C6]"
                />

                <div>
                  <p className="text-[13px] font-semibold text-[#333]">
                    Publish Project
                  </p>

                  <p className="mt-1 text-[11px] text-[#888]">
                    Published projects can be displayed on the public website.
                  </p>
                </div>
              </label>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#EEEAF5] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                  className="h-[46px] rounded-xl border border-[#DDD7E8] px-5 text-[13px] font-semibold text-[#666] transition hover:bg-[#F7F4FC]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-6 text-[13px] font-semibold text-white transition hover:bg-[#5127AE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingProject
                    ? "Update Project"
                    : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteProjectData && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[430px] rounded-[20px] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <h3 className="mt-5 text-[20px] font-bold text-[#222]">
              Delete Project?
            </h3>

            <p className="mt-3 text-[13px] leading-6 text-[#777]">
              Are you sure you want to delete{" "}
              <strong className="text-[#333]">
                {
                  deleteProjectData.title
                }
              </strong>
              ? The uploaded Cloudinary image will also be removed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteProjectData(
                    null
                  )
                }
                disabled={deleting}
                className="h-[44px] rounded-xl border border-[#DDD7E8] px-4 text-[13px] font-semibold text-[#666]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={deleting}
                className="flex h-[44px] items-center gap-2 rounded-xl bg-red-600 px-4 text-[13px] font-semibold text-white disabled:opacity-60"
              >
                {deleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
