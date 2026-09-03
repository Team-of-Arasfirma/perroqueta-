const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const parseJson = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchAdminUsers = async ({ token }) => {
  const response = await fetch(`${API_BASE}/api/admin/users`, {
    cache: "no-store",
    headers: authHeaders(token),
  });

  return parseJson(response);
};

export const fetchAdminUserById = async ({ token, id }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/${encodeURIComponent(id)}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });

  return parseJson(response);
};

export const createAdminUser = async ({ token, payload }) => {
  const response = await fetch(`${API_BASE}/api/admin/users`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJson(response);
};

export const updateAdminUser = async ({ token, id, payload }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJson(response);
};

export const updateAdminUserStatus = async ({ token, id, isActive }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive }),
  });

  return parseJson(response);
};

export const deleteAdminUser = async ({ token, id }) => {
  const response = await fetch(`${API_BASE}/api/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  return parseJson(response);
};
