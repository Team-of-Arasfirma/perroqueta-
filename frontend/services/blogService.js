const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const query = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : "";
};

const parse = async (response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
};

export const fetchBlogs = async (params = {}) =>
  parse(await fetch(`${API_BASE}/api/blogs${query(params)}`, { cache: "no-store" }));

export const fetchBlogBySlug = async (slug) =>
  parse(await fetch(`${API_BASE}/api/blogs/${encodeURIComponent(String(slug || "").trim())}`, { cache: "no-store" }));

export const fetchBlogById = async ({ token, id }) =>
  parse(await fetch(`${API_BASE}/api/blogs/admin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }));

export const fetchBlogCategories = async () =>
  parse(await fetch(`${API_BASE}/api/blogs/categories`, { cache: "no-store" }));

export const fetchBlogSubCategories = async (categorySlug = "") =>
  parse(await fetch(`${API_BASE}/api/blogs/sub-categories${query({ categorySlug })}`, { cache: "no-store" }));

export const saveBlog = async ({ token, id, formData }) =>
  parse(await fetch(`${API_BASE}/api/blogs${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }));

export const deleteBlog = async ({ token, id }) =>
  parse(await fetch(`${API_BASE}/api/blogs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }));

