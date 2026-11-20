const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPageMetadata(pageKey, fallback = {}) {
  try {
    const response = await fetch(`${API_BASE}/api/seo/public/${pageKey}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return fallback;

    const { setting } = await response.json();
    const title = setting?.metaTitle?.trim();
    const description = setting?.metaDescription?.trim();
    return {
      ...fallback,
      ...(title && { title: { absolute: title } }),
      ...(description && { description }),
    };
  } catch {
    return fallback;
  }
}
