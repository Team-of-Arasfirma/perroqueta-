const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const parseJson = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
};

export const submitApplication = async (formData) => {
  const response = await fetch(`${API_BASE}/api/applications`, {
    method: 'POST',
    body: formData,
  });

  return parseJson(response);
};

export const fetchApplications = async ({ token, ...params } = {}) => {
  const response = await fetch(`${API_BASE}/api/applications${buildQueryString(params)}`, {
    cache: 'no-store',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return parseJson(response);
};

export const fetchApplicationById = async ({ token, id }) => {
  const response = await fetch(`${API_BASE}/api/applications/${encodeURIComponent(id)}`, {
    cache: 'no-store',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return parseJson(response);
};

export const updateApplicationStatus = async ({ token, id, status }) => {
  const response = await fetch(`${API_BASE}/api/applications/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  return parseJson(response);
};

export const deleteApplication = async ({ token, id }) => {
  const response = await fetch(`${API_BASE}/api/applications/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJson(response);
};
