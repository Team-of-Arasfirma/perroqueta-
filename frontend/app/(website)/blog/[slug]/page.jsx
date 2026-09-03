import { notFound } from "next/navigation";
import BlogDetails from "@/components/Blog/BlogDetails";
import { fetchBlogBySlug } from "@/services/blogService";
import { buildCanonicalUrl } from "@/lib/blogContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { blog } = await fetchBlogBySlug(slug);
    const path = blog.subCategorySlug ? "/" + blog.categorySlug + "/" + blog.subCategorySlug + "/" + blog.slug : "/" + blog.categorySlug + "/" + blog.slug;
    return { title: blog.metaTitle || blog.title, description: blog.metaDescription || blog.excerpt, alternates: { canonical: buildCanonicalUrl(blog.canonicalUrl, path) } };
  } catch {
    return { title: "Blog" };
  }
}

export default async function LegacyBlogPage({ params }) {
  const { slug } = await params;
  let blog;
  try {
    ({ blog } = await fetchBlogBySlug(slug));
  } catch {
    notFound();
  }
  return <BlogDetails blog={blog} />;
}

