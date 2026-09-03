"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import BlogRichTextEditor from "@/components/Admin/BlogRichTextEditor";
import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { hasPermission, isSuperAdmin } from "@/lib/adminPermissions";
import { buildSiteUrl, formatBlogDate } from "@/lib/blogContent";
import {
  deleteBlog,
  fetchBlogCategories,
  fetchBlogSubCategories,
  fetchBlogs,
  saveBlog,
} from "@/services/blogService";

const slugify = (value = "") => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = {
  title: "", slug: "", category: "", categorySlug: "", subCategory: "", subCategorySlug: "",
  date: today(), status: "Published", content: "", coverImageAltText: "",
  metaTitle: "", metaDescription: "", image: null, removeCoverImage: false,
};

export default function AdminBlogsPage() {
  const { token, user } = useAdminAuth();
  const canView = isSuperAdmin(user) || hasPermission(user, "blogs", "view");
  const canCreate = isSuperAdmin(user) || hasPermission(user, "blogs", "create");
  const canEdit = isSuperAdmin(user) || hasPermission(user, "blogs", "edit");
  const canDelete = isSuperAdmin(user) || hasPermission(user, "blogs", "delete");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categoryMode, setCategoryMode] = useState("existing");
  const [subCategoryMode, setSubCategoryMode] = useState("existing");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("perroquetaAdminToken") || localStorage.getItem("adminToken") || localStorage.getItem("token") : "");

  const load = async () => {
    try {
      setLoading(true);
      const [blogData, categoryData] = await Promise.all([
        fetchBlogs({ status: "all", published: "all" }),
        fetchBlogCategories(),
      ]);
      setBlogs(blogData.blogs || []);
      setCategories(categoryData.categories || []);
    } catch (err) { setError(err.message || "Unable to load blogs."); }
    finally { setLoading(false); }
  };

  useEffect(() => { Promise.resolve().then(load); }, []);
  useEffect(() => {
    if (!form.categorySlug) { Promise.resolve().then(() => setSubCategories([])); return; }
    fetchBlogSubCategories(form.categorySlug).then((data) => setSubCategories(data.subCategories || [])).catch(() => setSubCategories([]));
  }, [form.categorySlug]);

  const filteredBlogs = useMemo(() => blogs.filter((blog) => {
    const q = search.trim().toLowerCase();
    return (!q || [blog.title, blog.slug, blog.category, blog.subCategory].some((value) => value?.toLowerCase().includes(q)))
      && (statusFilter === "all" || blog.status?.toLowerCase() === statusFilter || (statusFilter === "published" && blog.published) || (statusFilter === "draft" && !blog.published));
  }), [blogs, search, statusFilter]);

  const setValue = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const openAdd = () => {
    setEditing(null); setForm({ ...emptyForm, date: today() }); setPreview(""); setCategoryMode("new"); setSubCategoryMode("new"); setError(""); setModal(true);
  };
  const openEdit = (blog) => {
    setEditing(blog);
    setForm({
      ...emptyForm,
      title: blog.title || "", slug: blog.slug || "", category: blog.category || "",
      categorySlug: blog.categorySlug || "", subCategory: blog.subCategory || "",
      subCategorySlug: blog.subCategorySlug || "", date: blog.date ? new Date(blog.date).toISOString().slice(0, 10) : today(),
      status: blog.status || (blog.published ? "Published" : "Draft"), content: blog.content || "",
      coverImageAltText: blog.featuredImage?.altText || blog.title || "",
      metaTitle: blog.metaTitle || "", metaDescription: blog.metaDescription || "",
      image: null, removeCoverImage: false,
    });
    setPreview(blog.coverImage || blog.featuredImage?.url || "");
    setCategoryMode("existing"); setSubCategoryMode(blog.subCategory ? "existing" : "new"); setError(""); setModal(true);
  };
  const close = () => { if (!saving) { setModal(false); setEditing(null); setPreview(""); } };

  const changeCategory = (value) => {
    const selected = categories.find((item) => item.categorySlug === value);
    setForm((current) => ({ ...current, category: selected?.name || "", categorySlug: value, subCategory: "", subCategorySlug: "" }));
    setSubCategoryMode("existing");
  };

  const selectFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setError("Use JPG, JPEG, PNG or WEBP under 10MB."); return;
    }
    setValue("image", file); setValue("removeCoverImage", false); setPreview(URL.createObjectURL(file)); setError("");
  };

  const removeImage = () => { setValue("image", null); setValue("removeCoverImage", true); setPreview(""); };

  const submit = async (event) => {
    event.preventDefault();
    if (!authToken) { setError("Admin authentication token is missing."); return; }
    if (!form.title.trim() || !form.category.trim() || !form.categorySlug.trim() || !form.content.trim()) {
      setError("Title, category, category slug and content are required."); return;
    }
    try {
      setSaving(true); setError("");
      const data = new FormData();
      const values = {
        title: form.title.trim(), slug: form.slug.trim() || slugify(form.title), category: form.category.trim(),
        categorySlug: form.categorySlug.trim() || slugify(form.category), subCategory: form.subCategory.trim(),
        subCategorySlug: form.subCategorySlug.trim() || slugify(form.subCategory), date: form.date,
        status: form.status, published: String(form.status === "Published"), content: form.content,
        coverImageAltText: form.coverImageAltText.trim(), metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(), removeCoverImage: String(form.removeCoverImage),
      };
      Object.entries(values).forEach(([key, value]) => data.append(key, value));
      if (form.image) data.append("coverImage", form.image);
      await saveBlog({ token: authToken, id: editing?._id, formData: data });
      await load(); close();
    } catch (err) { setError(err.message || "Unable to save blog."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !authToken) return;
    try { await deleteBlog({ token: authToken, id: deleteTarget._id }); setDeleteTarget(null); await load(); }
    catch (err) { setError(err.message || "Unable to delete blog."); }
  };

  if (!canView) return <AdminAccessDenied title="Access Denied" description="You do not have access to this module." />;

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#FF8626]">Blog Management</p><h1 className="mt-2 text-3xl font-bold text-[#171717]">Blogs</h1></div>
        <button type="button" onClick={openAdd} disabled={!canCreate} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6030C6] px-5 text-sm font-semibold text-white disabled:opacity-50"><Plus className="h-4 w-4" />Add Blog</button>
      </div>
      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#E8E1F3] bg-white p-4 md:flex-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, slug, category..." className="h-11 flex-1 rounded-xl border border-[#E3DDEA] px-4 text-sm outline-none focus:border-[#6030C6]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-xl border border-[#E3DDEA] bg-white px-4 text-sm"><option value="all">All Statuses</option><option value="published">Published</option><option value="draft">Draft</option></select>
      </div>
      {error && !modal && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#E8E1F3] bg-white">
        {loading ? <div className="flex min-h-[240px] items-center justify-center"><Loader2 className="animate-spin text-[#6030C6]" /></div> : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#FBF9FF] text-xs uppercase tracking-wider text-[#6B5A82]"><tr><th className="px-4 py-4">S.No</th><th className="px-4 py-4">Image</th><th className="px-4 py-4">Title</th><th className="px-4 py-4">Category</th><th className="px-4 py-4">Slug</th><th className="px-4 py-4">Date</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Actions</th></tr></thead>
            <tbody>{filteredBlogs.map((blog, index) => <tr key={blog._id} className="border-t border-[#F0ECF5]"><td className="px-4 py-4">{index + 1}</td><td className="px-4 py-3">{(blog.coverImage || blog.featuredImage?.url) ? <img src={blog.coverImage || blog.featuredImage.url} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <ImagePlus className="h-6 w-6 text-[#B8ADC9]" />}</td><td className="max-w-[220px] px-4 py-4 font-semibold text-[#222]">{blog.title}</td><td className="px-4 py-4">{blog.category}</td><td className="max-w-[220px] truncate px-4 py-4 text-[#6B5A82]">{blog.slug}</td><td className="whitespace-nowrap px-4 py-4">{formatBlogDate(blog.date || blog.createdAt)}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${blog.status === "Draft" || !blog.published ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>{blog.status || (blog.published ? "Published" : "Draft")}</span></td><td className="px-4 py-4"><div className="flex gap-2"><button type="button" disabled={!canEdit} onClick={() => openEdit(blog)} className="rounded-lg border border-[#DDD7E8] p-2 text-[#6030C6] disabled:opacity-40"><Edit3 className="h-4 w-4" /></button><button type="button" disabled={!canDelete} onClick={() => setDeleteTarget(blog)} className="rounded-lg border border-red-200 p-2 text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody>
          </table>
        )}
      </div>

{modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171126]/55 p-3 backdrop-blur-[2px] sm:p-6">
          <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-[1160px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(25,12,55,0.25)] sm:max-h-[calc(100vh-3rem)]">
            <div className="flex shrink-0 items-center justify-between border-b border-[#EEEAF5] bg-white px-5 py-4 sm:px-8 sm:py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF8626]">Blog Management</p>
                <h2 className="mt-1 text-[22px] font-bold text-[#171717] sm:text-[26px]">{editing ? "Edit Blog" : "Add Blog"}</h2>
              </div>
              <button type="button" onClick={close} disabled={saving} aria-label="Close modal" className="flex h-10 w-10 items-center justify-center rounded-full text-[#777] transition hover:bg-[#F7F3FC] hover:text-[#6030C6] disabled:opacity-40"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto bg-[#FCFBFE] px-5 py-5 sm:px-8 sm:py-7">
                {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

                <div className="grid gap-5 lg:grid-cols-2">
                  <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5 shadow-[0_5px_20px_rgba(40,20,80,0.025)] sm:p-6">
                    <div className="mb-5"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">Article Details</p><p className="mt-1 text-xs text-[#888]">Set the title and URL details for this blog.</p></div>
                    <div className="space-y-4">
                      <label className="block text-[13px] font-bold text-[#333]">Blog Title<input value={form.title} onChange={(e) => setValue("title", e.target.value)} placeholder="Enter blog title" className="mt-2 h-11 w-full rounded-xl border border-[#DAD4E5] px-3.5 text-sm font-normal outline-none placeholder:text-[#AAA] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" /></label>
                      <label className="block text-[13px] font-bold text-[#333]">Blog Slug<input value={form.slug} onChange={(e) => setValue("slug", slugify(e.target.value))} placeholder={slugify(form.title) || "blog-slug"} className="mt-2 h-11 w-full rounded-xl border border-[#DAD4E5] px-3.5 text-sm font-normal outline-none placeholder:text-[#AAA] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" /></label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-[13px] font-bold text-[#333]">Date<input type="date" value={form.date} onChange={(e) => setValue("date", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#DAD4E5] px-3.5 text-sm font-normal outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" /></label>
                        <label className="block text-[13px] font-bold text-[#333]">Status<select value={form.status} onChange={(e) => setValue("status", e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#DAD4E5] bg-white px-3.5 text-sm font-normal outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"><option>Published</option><option>Draft</option></select></label>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5 shadow-[0_5px_20px_rgba(40,20,80,0.025)] sm:p-6">
                    <div className="mb-5"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">Taxonomy</p><p className="mt-1 text-xs text-[#888]">Organize this article for your readers.</p></div>
                    <div className="space-y-5">
                      <div>
                        <p className="text-[13px] font-bold text-[#333]">Category</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => setCategoryMode("existing")} className={categoryMode === "existing" ? "rounded-full bg-[#6030C6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm" : "rounded-full border border-[#DAD4E5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#6B5A82]"}>Select Existing</button>
                          <button type="button" onClick={() => setCategoryMode("new")} className={categoryMode === "new" ? "rounded-full bg-[#6030C6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm" : "rounded-full border border-[#DAD4E5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#6B5A82]"}>Create New</button>
                        </div>
                        {categoryMode === "existing" ? <select value={form.categorySlug} onChange={(e) => changeCategory(e.target.value)} className="mt-3 h-11 w-full rounded-xl border border-[#DAD4E5] bg-white px-3.5 text-sm outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"><option value="">Select category</option>{categories.map((item) => <option key={item.categorySlug} value={item.categorySlug}>{item.name}</option>)}</select> : <input value={form.category} onChange={(e) => { setValue("category", e.target.value); setValue("categorySlug", slugify(e.target.value)); }} placeholder="Category name" className="mt-3 h-11 w-full rounded-xl border border-[#DAD4E5] px-3.5 text-sm outline-none placeholder:text-[#AAA] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" />}
                      </div>
                      <label className="block text-[13px] font-bold text-[#333]">Category Slug<input value={form.categorySlug} onChange={(e) => setValue("categorySlug", slugify(e.target.value))} placeholder="category-slug" className="mt-2 h-11 w-full rounded-xl border border-[#DAD4E5] px-3.5 text-sm font-normal outline-none placeholder:text-[#AAA] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" /></label>
                      <div>
                        <p className="text-[13px] font-bold text-[#333]">Sub Category <span className="text-xs font-normal text-[#999]">(optional)</span></p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => setSubCategoryMode("existing")} className={subCategoryMode === "existing" ? "rounded-full bg-[#6030C6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm" : "rounded-full border border-[#DAD4E5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#6B5A82]"}>Select Existing</button>
                          <button type="button" onClick={() => setSubCategoryMode("new")} className={subCategoryMode === "new" ? "rounded-full bg-[#6030C6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm" : "rounded-full border border-[#DAD4E5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#6B5A82]"}>Create New</button>
                        </div>
                        {subCategoryMode === "existing" ? <select value={form.subCategorySlug} onChange={(e) => { const item = subCategories.find((row) => row.subCategorySlug === e.target.value); setForm((current) => ({ ...current, subCategory: item?.name || "", subCategorySlug: e.target.value })); }} className="mt-3 h-11 w-full rounded-xl border border-[#DAD4E5] bg-white px-3.5 text-sm outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10"><option value="">No sub-category</option>{subCategories.map((item) => <option key={item.subCategorySlug} value={item.subCategorySlug}>{item.name}</option>)}</select> : <input value={form.subCategory} onChange={(e) => { setValue("subCategory", e.target.value); setValue("subCategorySlug", slugify(e.target.value)); }} placeholder="Optional sub-category" className="mt-3 h-11 w-full rounded-xl border border-[#DAD4E5] px-3.5 text-sm outline-none placeholder:text-[#AAA] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" />}
                      </div>
                      <label className="block text-[13px] font-bold text-[#333]">Sub Category Slug<input value={form.subCategorySlug} onChange={(e) => setValue("subCategorySlug", slugify(e.target.value))} placeholder="sub-category-slug" className="mt-2 h-11 w-full rounded-xl border border-[#DAD4E5] px-3.5 text-sm font-normal outline-none placeholder:text-[#AAA] focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" /></label>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5 shadow-[0_5px_20px_rgba(40,20,80,0.025)] sm:p-6">
                    <div className="mb-5"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">Cover Image</p><p className="mt-1 text-xs text-[#888]">JPG, PNG or WEBP up to 10MB.</p></div>
                    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFC4E2] bg-[#FBF9FF] px-4 py-5 text-center hover:border-[#6030C6]">
                      <ImagePlus className="h-7 w-7 text-[#6030C6]" /><span className="mt-2 text-sm font-semibold text-[#4D3A6A]">Choose cover image</span><span className="mt-1 max-w-full truncate text-xs text-[#999]">{form.image?.name || (preview ? "Current cover image" : "No file selected")}</span>
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={selectFile} className="sr-only" />
                    </label>
                    {preview && <div className="mt-4 rounded-2xl border border-[#E8E1F3] bg-[#FBF9FF] p-3"><img src={preview} alt="Cover preview" className="max-h-48 w-full rounded-xl object-cover" /><button type="button" onClick={removeImage} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Remove Image</button></div>}
                  </section>

                  <section className="rounded-2xl border border-[#E8E1F3] bg-white p-5 sm:p-6 lg:col-span-2">
                    <div className="mb-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">
                        Content
                      </p>
                      <p className="mt-1 text-xs text-[#888]">
                        Write and format the main article content.
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-[13px] font-bold text-[#333]">
                        Blog Content
                      </p>

                      <BlogRichTextEditor
                        value={form.content}
                        onChange={(content) => setValue("content", content)}
                        placeholder="Write your blog content here..."
                      />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#E4DBF1] bg-[#F8F5FC] p-5 sm:p-6 lg:col-span-2">
                    <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">Search Engine Listing</p><h3 className="mt-1 text-lg font-bold text-[#21143A]">SEO preview</h3></div><p className="text-xs text-[#888]">Recommended lengths: 60 / 160 characters</p></div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="block text-[13px] font-bold text-[#333]"><span className="flex items-center justify-between">Meta Title <span className={form.metaTitle.length > 60 ? "text-xs font-normal text-red-600" : "text-xs font-normal text-[#888]"}>{form.metaTitle.length}/60</span></span><input value={form.metaTitle} onChange={(e) => setValue("metaTitle", e.target.value)} placeholder="SEO title" className="mt-2 h-11 w-full rounded-xl border border-[#DAD4E5] bg-white px-3.5 text-sm font-normal outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" />{form.metaTitle.length > 60 && <span className="mt-1 block text-xs font-normal text-red-600">Recommended maximum is 60 characters.</span>}</label>
                      <label className="block text-[13px] font-bold text-[#333]"><span className="flex items-center justify-between">Meta Description <span className={form.metaDescription.length > 160 ? "text-xs font-normal text-red-600" : "text-xs font-normal text-[#888]"}>{form.metaDescription.length}/160</span></span><textarea value={form.metaDescription} onChange={(e) => setValue("metaDescription", e.target.value)} placeholder="SEO description" className="mt-2 min-h-28 w-full resize-y rounded-xl border border-[#DAD4E5] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/10" />{form.metaDescription.length > 160 && <span className="mt-1 block text-xs font-normal text-red-600">Recommended maximum is 160 characters.</span>}</label>
                    </div>
                    <div className="mt-5 rounded-2xl border border-[#E7E0F0] bg-white p-5"><p className="text-[11px] font-medium text-[#16804A]">{buildSiteUrl(form.subCategorySlug ? "/" + (form.categorySlug || "category") + "/" + form.subCategorySlug + "/" + (form.slug || "blog-slug") : "/" + (form.categorySlug || "category") + "/" + (form.slug || "blog-slug"))}</p><p className="mt-2 text-base font-bold leading-6 text-[#3B35A5]">{form.metaTitle || form.title || "Your blog title will appear here"}</p><p className="mt-1 text-sm leading-6 text-[#666]">{form.metaDescription || "Your meta description will appear here."}</p></div>
                  </section>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#EEEAF5] bg-white px-5 py-4 sm:px-8">
                <button type="button" onClick={close} className="rounded-xl border border-[#DAD4E5] bg-white px-5 py-2.5 text-sm font-semibold text-[#5B4A76] hover:border-[#6030C6] hover:text-[#6030C6]">Cancel</button>
                <button type="submit" disabled={saving || (editing ? !canEdit : !canCreate)} className="rounded-xl bg-[#6030C6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5127AE] disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving..." : editing ? "Update Blog" : "Create Blog"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">Delete blog?</h2><p className="mt-2 text-sm text-[#666]">This will permanently delete “{deleteTarget.title}”.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl border px-4 py-2 text-sm">Cancel</button><button type="button" onClick={confirmDelete} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button></div></div></div>}
    </div>
  );
}



