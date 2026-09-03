const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const parse = async (response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
};

export const fetchCareers = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') query.set(key, String(value)); });
  const response = await fetch(`${API_BASE}/api/careers${query.toString() ? `?${query}` : ''}`, { cache: 'no-store' });
  return parse(response);
};

export const fetchCareerBySlug = async (slug) => {
  const response = await fetch(`${API_BASE}/api/careers/slug/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  return parse(response);
};

export const saveCareer = async ({ token, id, career }) => {
  const response = await fetch(`${API_BASE}/api/careers${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(career) });
  return parse(response);
};

export const deleteCareer = async ({ token, id }) => {
  const response = await fetch(`${API_BASE}/api/careers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  return parse(response);
};

export const submitCareerApplication = async (formData) => {
  const response = await fetch(`${API_BASE}/api/applications`, { method: 'POST', body: formData });
  return parse(response);
};
