const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN_KEY = "perroquetaAdminToken";
const USER_KEY = "perroquetaAdminUser";

const storage = (remember) => (remember ? localStorage : sessionStorage);

export const getAuth = () => {
  if (typeof window === "undefined") return { token: "", user: null };
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  const userValue = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return { token, user: userValue ? JSON.parse(userValue) : null };
};

export const saveAuth = (data, remember) => {
  const target = storage(remember);
  const other = storage(!remember);
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
  target.setItem(TOKEN_KEY, data.token);
  target.setItem(USER_KEY, JSON.stringify(data.user));
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const loginAdmin = async (credentials) => {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to sign in.");
  return data;
};

export const getCurrentAdmin = async (token) => {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unauthorized");
  return response.json();
};
