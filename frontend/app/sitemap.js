import { buildSiteUrl } from '@/lib/blogContent';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const staticRoutes = [
  '/',
  '/about',
  '/blog',
  '/contact',
  '/careers',
  '/products',
  '/project',
].map((path) => ({
  url: buildSiteUrl(path),
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: path === '/' ? 1 : 0.7,
}));

export default async function sitemap() {
  let blogRoutes = [];

  try {
    const response = await fetch(`${API_BASE}/api/blogs?published=true&limit=all`);
    const data = await response.json();

    blogRoutes = (data.blogs || []).map((blog) => ({
      url: buildSiteUrl(`/blog/${blog.slug}`),
      lastModified: blog.updatedAt || blog.publishedAt || blog.createdAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    blogRoutes = [];
  }

  return [...staticRoutes, ...blogRoutes];
}
