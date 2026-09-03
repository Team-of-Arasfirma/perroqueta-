import { notFound } from "next/navigation";
import BlogDetails from "@/components/Blog/BlogDetails";
import { fetchBlogBySlug } from "@/services/blogService";
import { buildCanonicalUrl } from "@/lib/blogContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { segments } = await params;
  const blogSlug = Array.isArray(segments) ? segments[segments.length - 1] : "";
  try {
    const { blog } = await fetchBlogBySlug(blogSlug);
    const path = blog.subCategorySlug ? "/" + blog.categorySlug + "/" + blog.subCategorySlug + "/" + blog.slug : "/" + blog.categorySlug + "/" + blog.slug;
    return { title: blog.metaTitle || blog.title, description: blog.metaDescription || blog.excerpt, alternates: { canonical: buildCanonicalUrl(blog.canonicalUrl, path) } };
  } catch {
    return { title: slug };
  }
}

export default async function CleanBlogPage({ params }) {
  const { segments } = await params;
  const parts = Array.isArray(segments) ? segments : [];
  const blogSlug = parts[parts.length - 1];
  if (!blogSlug) notFound();
  let blog;
  try {
    ({ blog } = await fetchBlogBySlug(blogSlug));
  } catch {
    notFound();
  }
  return <BlogDetails blog={blog} />;
}

