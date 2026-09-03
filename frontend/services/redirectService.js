const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const parse = async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Request failed."); return data; };
const request = async (path, options = {}) => parse(await fetch(API_BASE + path, { ...options, cache: "no-store", headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), Authorization: "Bearer " + options.token } }));
export const fetchRedirects = ({ token, search = "", active = "", statusCode = "", page = 1, limit = 20 }) => { const p = new URLSearchParams({ page, limit }); if (search) p.set("search", search); if (active) p.set("active", active); if (statusCode) p.set("statusCode", statusCode); return request("/api/redirects?" + p, { token }); };
export const fetchRedirectById = ({ token, id }) => request("/api/redirects/" + id, { token });
export const createRedirect = ({ token, payload }) => request("/api/redirects", { token, method: "POST", body: JSON.stringify(payload) });
export const updateRedirect = ({ token, id, payload }) => request("/api/redirects/" + id, { token, method: "PUT", body: JSON.stringify(payload) });
export const updateRedirectStatus = ({ token, id, active }) => request("/api/redirects/" + id + "/status", { token, method: "PATCH", body: JSON.stringify({ active }) });
export const deleteRedirect = ({ token, id }) => request("/api/redirects/" + id, { token, method: "DELETE" });
