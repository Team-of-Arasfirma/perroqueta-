"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchBlogs } from "@/services/blogService";
import { Check, CircleAlert, ExternalLink, FileText, Globe, Layers, Monitor, Search, Smartphone, Sparkles } from "lucide-react";
import AdminAccessDenied from "@/components/Admin/AccessDenied";
import { useAdminAuth } from "@/components/Admin/AdminAuthProvider";
import { hasPermission } from "@/lib/adminPermissions";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perroqueta.com";
const SITE_ROOT = new URL("/", SITE_URL).href.toLowerCase();
const defaultDescription = "Perroqueta roofing, building materials and architectural solutions.";
// Match the public root metadata and the resolved titles of page-level fallbacks.
const pages = [
  { key: "home", name: "Home", route: "/", title: "Perroqueta", description: defaultDescription },
  { key: "about", name: "About", route: "/about", title: "Perroqueta", description: defaultDescription },
  { key: "project", name: "Project", route: "/project", title: "Projects | Perroqueta", description: "Explore roofing, building materials and structural projects completed by Perroqueta." },
  { key: "careers", name: "Careers", route: "/careers", title: "Careers | Perroqueta", description: "Explore career opportunities at Perroqueta and join our growing team in roofing, building materials and structural solutions." },
  { key: "products", name: "Products", route: "/products", title: "Products | Perroqueta", description: "Explore Perroqueta roofing, wall, clay and structural product solutions." },
  { key: "blog", name: "Blog", route: "/blog", title: "Blog | Perroqueta", description: "Explore roofing insights, building material guides, industry updates and expert articles from Perroqueta." },
];

const fields = [
  { key: "metaTitle", fallback: "title", label: "SEO Title", min: 50, max: 60 },
  { key: "metaDescription", fallback: "description", label: "Meta Description", min: 150, max: 160 },
];
const statuses = [
  { key: "custom", label: "Custom SEO", tone: "bg-[#F1E9FF] text-[#6030C6]", icon: Sparkles },
  { key: "default", label: "Using Default", tone: "bg-[#F0EEF4] text-[#62596F]", icon: FileText },
  { key: "review", label: "Needs Review", tone: "bg-[#FFF0E3] text-[#9B4709]", icon: CircleAlert },
];
const postStatuses = statuses.map((status) => status.key === "custom" ? { ...status, label: "Configured" } : status);
const summaryItems = [{ key: "total", label: "Total Pages", tone: "bg-[#F1E9FF] text-[#6030C6]", icon: Layers }, ...statuses];
const panel = "min-w-0 rounded-2xl border border-[#E8E1F3] bg-white";
const control = "w-full min-w-0 rounded-xl border border-[#DDD7E8] bg-white px-3.5 py-2.5 text-sm text-[#221A31] outline-none focus:border-[#6030C6] focus:ring-2 focus:ring-[#6030C6]/15";
const countCharacters = (value) => [...value].length;
const pageUrl = (page) => new URL(page.route, SITE_URL).href;
const normalizeTitle = (title) => title.toLowerCase().replace(/\s+/g, " ");

function metadataFor(page, values) {
  const customTitle = values?.metaTitle?.trim() || "";
  const customDescription = values?.metaDescription?.trim() || "";
  return {
    customTitle,
    customDescription,
    title: page.isPost ? `${customTitle || page.title} | Perroqueta` : customTitle || page.title,
    description: customDescription || page.description,
  };
}

function reviewMetadata(page, values, settings, postTitles) {
  const metadata = metadataFor(page, values);
  const notes = fields.flatMap(({ key, label, min, max }) => {
    const value = values?.[key]?.trim() || "";
    if (!value) return [{ text: `${label} is blank. The page uses its default ${key === "metaTitle" ? "title" : "description"}.`, warning: Boolean(metadata.customTitle || metadata.customDescription) }];
    const count = countCharacters(value);
    if (count < min) return [{ text: `${label} is shorter than the recommended ${min}–${max} characters.`, warning: true }];
    if (count > max) return [{ text: `${label} exceeds the recommended ${min}–${max} characters.`, warning: true }];
    return [];
  });
  const duplicates = page.isPost
    ? postTitles.get(normalizeTitle(metadata.title)).filter((other) => other.key !== page.key)
    : pages.filter((other) => {
      if (other.key === page.key) return false;
      const otherMetadata = metadataFor(other, settings[other.key]);
      return normalizeTitle(metadata.title) === normalizeTitle(otherMetadata.title);
    });
  if (duplicates.length) {
    notes.push({
      text: `The effective title is also used by ${duplicates.map(({ name }) => name).join(", ")}.`,
      warning: page.isPost || Boolean(metadata.customTitle || duplicates.some(({ key }) => settings[key]?.metaTitle?.trim())),
    });
  }
  const status = !metadata.customTitle && !metadata.customDescription
    ? "default"
    : notes.some(({ warning }) => warning) ? "review" : "custom";
  return { ...metadata, notes, status };
}

function preparePosts(blogs) {
  const posts = blogs.map((blog) => ({
    key: blog._id,
    name: blog.title,
    title: blog.title,
    description: blog.excerpt || "",
    route: "/" + (blog.categorySlug
      ? [blog.categorySlug, blog.subCategorySlug, blog.slug].filter(Boolean).join("/")
      : "blog/" + blog.slug),
    isPost: true,
    published: blog.published && blog.status === "Published",
    values: { metaTitle: blog.metaTitle, metaDescription: blog.metaDescription },
  }));
  const titles = new Map();
  for (const post of posts) {
    const title = normalizeTitle(metadataFor(post, post.values).title);
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(post);
  }
  return posts.map((post) => ({ ...post, review: reviewMetadata(post, post.values, null, titles) }));
}

async function requestSeo(token, path = "", options) {
  const response = await fetch(`${API_BASE}/api/seo${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.body && { "Content-Type": "application/json" }),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.message || "Unable to access SEO settings.");
  return data;
}

export default function SeoManagementPage() {
  const { token, user } = useAdminAuth();
  if (!hasPermission(user, "seo", "view")) {
    return <AdminAccessDenied title="SEO access denied" description="You do not have permission to view SEO settings." />;
  }
  return <SeoManagement token={token} canEdit={hasPermission(user, "seo", "edit")}
    canViewPosts={hasPermission(user, "blogs", "view")} canEditPosts={hasPermission(user, "blogs", "edit")} />;
}

function SeoManagement({ token, canEdit, canViewPosts, canEditPosts }) {
  const [showPosts, setShowPosts] = useState(false);
  const [blogs, setBlogs] = useState(null);
  const [postsError, setPostsError] = useState("");
  const [postKey, setPostKey] = useState(null);
  const [postQuery, setPostQuery] = useState("");
  const [postFilter, setPostFilter] = useState("all");
  const [pageKey, setPageKey] = useState("home");
  const [settings, setSettings] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    requestSeo(token, "", { signal: controller.signal })
      .then(({ settings }) => {
        if (!controller.signal.aborted) {
          setSettings(Object.fromEntries(settings.map((setting) => [setting.pageKey, setting])));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Unable to load SEO settings. Refresh to try again.");
      });
    return () => controller.abort();
  }, [token]);

  useEffect(() => {
    if (!showPosts || !canViewPosts) return;
    let active = true;
    fetchBlogs({ status: "all", published: "all" }).then(({ blogs }) => {
      if (!active) return;
      setBlogs(blogs);
      setPostsError("");
    }).catch(() => {
      if (active) setPostsError("Unable to load blog posts. Switch tabs to try again.");
    });
    return () => { active = false; };
  }, [showPosts, canViewPosts]);

  const posts = useMemo(() => preparePosts(blogs ?? []), [blogs]);
  const post = posts.find(({ key }) => key === postKey) ?? posts[0];
  const page = pages.find(({ key }) => key === pageKey);
  const saved = settings?.[pageKey];
  const draft = drafts[pageKey] ?? saved;
  const dirty = fields.some(({ key }) => (draft?.[key] ?? "") !== (saved?.[key] ?? ""));
  const pageStatuses = settings && Object.fromEntries(
    pages.map((item) => [item.key, reviewMetadata(item, settings[item.key], settings).status]),
  );
  const summary = pageStatuses && Object.values(pageStatuses);
  const search = query.trim().toLowerCase();
  const visiblePages = pages.filter((item) => {
    if (filter !== "all" && pageStatuses?.[item.key] !== filter) return false;
    if (search === "/" || search === SITE_ROOT) return item.route === "/";
    return [item.name, item.route, pageUrl(item)].some((value) => value.toLowerCase().includes(search));
  });
  const postSearch = postQuery.trim().toLowerCase();
  const visiblePosts = posts.filter((item) => (
    (postFilter === "all" || item.review.status === postFilter) &&
    [item.name, item.route, pageUrl(item)].some((value) => value.toLowerCase().includes(postSearch))
  ));
  const review = showPosts ? post?.review : settings && reviewMetadata(page, draft, settings);
  const selected = showPosts ? post : page;
  const values = showPosts ? post?.values : draft;
  const libraryStatuses = showPosts ? postStatuses : statuses;

  function discardDraft() {
    setDrafts((current) => {
      const next = { ...current };
      delete next[pageKey];
      return next;
    });
  }

  async function save(event) {
    event.preventDefault();
    if (!canEdit || !settings || !dirty || saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const { setting } = await requestSeo(token, `/${pageKey}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(fields.map(({ key }) => [key, draft?.[key] ?? ""]))),
      });
      const updatedSettings = { ...settings, [pageKey]: setting };
      const previousStatus = pageStatuses[pageKey];
      const updatedStatus = reviewMetadata(page, setting, updatedSettings).status;
      setSettings(updatedSettings);
      // Keep the selected row visible when it leaves the current status filter.
      setFilter((current) => current === previousStatus && current !== updatedStatus ? "all" : current);
      discardDraft();
      setMessage(`SEO settings saved for ${page.name}.`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6 text-[#221A31]">
      <div>
        <h2 className="text-3xl font-black tracking-tight">SEO Management</h2>
        <p className="mt-1 text-sm text-[#716680]">Manage how your website pages appear in search results.</p>
      </div>

      <dl aria-label="SEO overview" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {summaryItems.map(({ key, label, tone, icon: Icon }) => (
          <div key={key} className={`${panel} flex flex-wrap items-center gap-x-3 gap-y-2 p-3.5 sm:p-4`}>
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`}><Icon aria-hidden="true" size={17} /></span>
            <div className="min-w-0">
              <dt className="text-xs font-semibold text-[#716680]">{label}</dt>
              <dd className="mt-0.5 text-2xl leading-none font-black">{key === "total" ? pages.length : summary?.filter((status) => status === key).length ?? "—"}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(250px,310px)_minmax(0,1fr)]">
        <section aria-labelledby="seo-library" className={`${panel} p-4 sm:p-5`}>
          <h3 id="seo-library" className="text-lg font-bold">Content Library</h3>
          {canViewPosts && (
            <div role="group" aria-label="Content type" className="mt-4 flex gap-1 rounded-xl bg-[#F4EFFA] p-1">
              {["Pages", "Blog Posts"].map((label, index) => (
                <button key={label} type="button" aria-pressed={showPosts === Boolean(index)}
                  disabled={saving} onClick={() => setShowPosts(Boolean(index))}
                  className={`flex-1 rounded-lg px-2 py-2 text-sm font-semibold ${showPosts === Boolean(index) ? "bg-white text-[#6030C6] shadow-sm" : "text-[#716680]"}`}>
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 space-y-2.5">
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute top-3 left-3.5 text-[#716680]" size={16} />
              <input type="search" aria-label={showPosts ? "Search by post title or URL" : "Search by page name or URL"}
                placeholder={showPosts ? "Search title or URL" : "Search name or URL"} value={showPosts ? postQuery : query}
                onChange={(event) => (showPosts ? setPostQuery : setQuery)(event.target.value)} className={`${control} pl-10`} />
            </div>
            <select aria-label="Filter by SEO status" className={control} value={showPosts ? postFilter : filter} disabled={showPosts ? !blogs : !settings}
              onChange={(event) => (showPosts ? setPostFilter : setFilter)(event.target.value)}>
              <option value="all">All statuses</option>
              {libraryStatuses.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <ul className={`mt-4 space-y-2 ${showPosts ? "max-h-80 overflow-y-auto p-0.5 xl:max-h-[32rem]" : ""}`}>
            {(showPosts ? visiblePosts : visiblePages).map((item) => {
              const active = item.key === selected?.key;
              const status = libraryStatuses.find(({ key }) => key === (showPosts ? item.review.status : pageStatuses?.[item.key]));
              return (
                <li key={item.key}>
                  <button type="button" aria-current={active ? "true" : undefined} disabled={saving}
                    onClick={() => {
                      if (showPosts) {
                        setPostKey(item.key);
                      } else {
                        setPageKey(item.key);
                        setMessage("");
                        if (settings) setError("");
                      }
                    }}
                    className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-[#6030C6] ${active ? "border-[#B69AEF] bg-[#F5EEFF]" : "border-[#EDE8F3] hover:bg-[#FAF7FF]"}`}>
                    <span className="min-w-0">
                      <span className={`block text-sm font-bold wrap-anywhere ${active ? "text-[#6030C6]" : ""}`}>{item.name}</span>
                      <span className="mt-0.5 block text-xs break-all text-[#716680]">{showPosts ? pageUrl(item) : item.route}</span>
                    </span>
                    {status && <span className={`rounded-full px-2 py-1 text-[11px] leading-none font-bold ${status.tone}`}>{status.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          {showPosts ? (
            <>
              {postsError && <p role="alert" className="mt-4 text-sm text-red-700">{postsError}</p>}
              {!blogs && !postsError && <p role="status" className="mt-4 text-sm text-[#716680]">Loading blog posts…</p>}
              {blogs && !visiblePosts.length && <p role="status" className="mt-4 text-sm text-[#716680]">
                {posts.length ? "No posts match your search and filter." : "No blog posts available."}
              </p>}
            </>
          ) : !visiblePages.length && <p role="status" className="mt-4 text-sm text-[#716680]">No pages match your search and filter.</p>}
        </section>

        <div className="min-w-0 space-y-5">
          {selected && <section aria-labelledby="seo-editor" className={`${panel} p-4 sm:p-6`}>
            <h3 id="seo-editor" className="text-lg font-bold">SEO Editor</h3>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <div>
                <p className="text-xs font-bold text-[#6030C6]">{showPosts ? post.published ? "Blog post" : "Blog post · Draft" : page.key === "products" ? "Product listing" : "Website page"}</p>
                <h4 className="mt-1 text-2xl font-black wrap-anywhere">{selected.name}</h4>
              </div>
              {showPosts && !post.published ? (
                <p className="text-sm break-all text-[#716680]">{pageUrl(post)}</p>
              ) : (
                <a href={pageUrl(selected)} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1.5 text-sm font-semibold text-[#6030C6] hover:underline">
                  <span className="break-all">{pageUrl(selected)}</span><ExternalLink aria-hidden="true" className="shrink-0" size={14} />
                </a>
              )}
            </div>

            {!showPosts && !settings && !error && <p role="status" className="mt-5 text-sm text-[#716680]">Loading SEO settings…</p>}
            {!showPosts && error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {!showPosts && message && <p role="status" className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}
            {review && (
              <form onSubmit={showPosts ? (event) => event.preventDefault() : save} className="mt-5 space-y-5">
                <p className="rounded-xl bg-[#F5EEFF] px-3.5 py-3 text-sm text-[#56378B]">
                  <strong>Current metadata source</strong>{" · "}
                  {showPosts ? "Read-only metadata from Blog Admin." : saved?.metaTitle?.trim() && saved?.metaDescription?.trim()
                    ? "Saved custom title and description."
                    : saved?.metaTitle?.trim()
                      ? "Saved custom title and default description."
                      : saved?.metaDescription?.trim()
                        ? "Default title and saved custom description."
                        : "Default title and description."}
                  {" "}Blank fields use the page defaults.
                </p>
                {fields.map(({ key, label, fallback, min, max }) => {
                  const value = values?.[key] ?? "";
                  const props = {
                    id: key,
                    className: control,
                    value,
                    placeholder: selected[fallback],
                    readOnly: showPosts || !canEdit || saving,
                    "aria-describedby": `${key}-count`,
                    onChange: showPosts ? undefined : (event) => {
                      setMessage("");
                      const value = event.target.value;
                      setDrafts((current) => ({
                        ...current,
                        [pageKey]: { ...(current[pageKey] ?? saved), [key]: value },
                      }));
                    },
                  };
                  return (
                    <div key={key} className="space-y-2">
                      <label htmlFor={key} className="block text-sm font-bold">{label}</label>
                      {key === "metaTitle" ? <input {...props} /> : <textarea {...props} rows={4} />}
                      <p id={`${key}-count`} className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-[#716680]">
                        <span>Recommended {min}–{max} characters</span>
                        <span className="font-semibold tabular-nums">{countCharacters(value)} characters</span>
                      </p>
                    </div>
                  );
                })}
                {!showPosts && canEdit && (
                  <div className="flex flex-wrap justify-end gap-2 border-t border-[#EDE8F3] pt-4">
                    <button type="button" disabled={!dirty || saving} onClick={() => { discardDraft(); setError(""); setMessage("Changes discarded."); }}
                      className="rounded-xl border border-[#DDD7E8] px-4 py-2.5 text-sm font-semibold text-[#56378B] enabled:hover:bg-[#F7F4FC] disabled:opacity-50">
                      Discard Changes
                    </button>
                    <button type="submit" disabled={!dirty || saving}
                      className="rounded-xl bg-[#6030C6] px-4 py-2.5 text-sm font-bold text-white enabled:hover:bg-[#5124AF] disabled:opacity-50">
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
                {showPosts && canEditPosts && (
                  <Link href={`/admin/blogs?edit=${encodeURIComponent(post.key)}`} className="inline-flex rounded-xl bg-[#6030C6] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#5124AF]">
                    Edit in Blog Admin
                  </Link>
                )}
              </form>
            )}
          </section>}

          {review && (
            <>
              <section aria-labelledby="seo-preview" className={`${panel} p-4 sm:p-6`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 id="seo-preview" className="text-lg font-bold">Search Result Preview</h3>
                  <div role="group" aria-label="Preview width" className="flex gap-1 rounded-xl bg-[#F4EFFA] p-1">
                    {[["desktop", "Desktop", Monitor], ["mobile", "Mobile", Smartphone]].map(([mode, label, Icon]) => (
                      <button key={mode} type="button" aria-pressed={previewMode === mode} onClick={() => setPreviewMode(mode)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${previewMode === mode ? "bg-white text-[#6030C6] shadow-sm" : "text-[#716680]"}`}>
                        <Icon aria-hidden="true" size={14} />{label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`mt-4 rounded-xl border border-[#E8E1F3] bg-[#FCFAFF] p-3.5 wrap-anywhere sm:p-4 ${previewMode === "mobile" ? "max-w-[350px]" : ""}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F1E9FF] text-[#6030C6]"><Globe aria-hidden="true" size={16} /></span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">Perroqueta</p>
                      <p className="text-xs text-[#716680]">{pageUrl(selected)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-lg leading-snug font-semibold text-[#6030C6]">{review.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#594F67]">{review.description}</p>
                </div>
              </section>

              <section aria-labelledby="seo-review" className={`${panel} p-4 sm:p-6`}>
                <h3 id="seo-review" className="text-lg font-bold">Metadata Review</h3>
                <ul className="mt-3 space-y-2">
                  {review.notes.length ? review.notes.map(({ text, warning }) => (
                    <li key={text} className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${warning ? "bg-[#FFF0E3] text-[#91440B]" : "bg-[#F5EEFF] text-[#56378B]"}`}>
                      <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0" size={16} />{text}
                    </li>
                  )) : (
                    <li className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-sm text-green-800">
                      <Check aria-hidden="true" className="shrink-0" size={16} />Title and description meet the length recommendations.
                    </li>
                  )}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
