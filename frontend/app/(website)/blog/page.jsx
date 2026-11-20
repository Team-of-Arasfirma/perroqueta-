import BlogHero from "@/components/Blog/BlogHero";
import BlogGrid from "@/components/Blog/BlogGrid";
import { getPageMetadata } from "@/lib/pageSeo";
import { fetchBlogs } from "@/services/blogService";

export const dynamic = "force-dynamic";
const fallbackMetadata = {
  title: "Blog",
  description: "Explore roofing insights, building material guides, industry updates and expert articles from Perroqueta.",
  alternates: { canonical: "/blog" },
};

export function generateMetadata() {
  return getPageMetadata("blog", fallbackMetadata);
}

export default async function BlogPage() {
  let blogs = [];
  try { blogs = (await fetchBlogs({ published: true })).blogs || []; } catch (error) { console.error("Blog listing load error:", error); }
  return <main className="bg-[#FBFBFB] [&_article_h2]:break-words"><BlogHero /><BlogGrid blogs={blogs} /></main>;
}

