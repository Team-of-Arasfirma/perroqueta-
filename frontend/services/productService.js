const productApi = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/products";

async function request(token, path, { method = "GET", body } = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  const multipart = body instanceof FormData;
  if (body && !multipart) headers["Content-Type"] = "application/json";
  const response = await fetch(productApi + path, {
    method, headers, cache: "no-store",
    body: multipart ? body : body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Product request failed (${response.status}).`);
  return result;
}

export const listProducts = async (token) => (await request(token, "/admin")).products;
export const getProduct = async (token, key) =>
  (await request(token, "/admin/" + encodeURIComponent(key))).product;
export const saveProduct = async (token, id, body) =>
  (await request(token, id ? "/" + encodeURIComponent(id) : "", { method: id ? "PUT" : "POST", body })).product;

export async function uploadProductImage(token, file, alt) {
  const body = new FormData();
  body.append("image", file);
  body.append("alt", alt ?? "");
  return (await request(token, "/media", { method: "POST", body })).media;
}
