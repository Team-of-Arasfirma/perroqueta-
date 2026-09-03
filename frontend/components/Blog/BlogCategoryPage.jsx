import Link from "next/link";
import BlogGrid from "@/components/Blog/BlogGrid";
import { fetchBlogs } from "@/services/blogService";

export default async function BlogCategoryPage({ categorySlug, subCategorySlug = "" }) {
  const data = await fetchBlogs({ published: true, categorySlug, subCategorySlug });
  const title = subCategorySlug ? subCategorySlug.replace(/-/g, " ") : categorySlug.replace(/-/g, " ");
  return (
    <main className="bg-[#FBFBFB]">
      <section className="bg-[#F4F0FC] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <Link href="/blog" className="text-sm font-semibold text-[#6030C6]">Back to Blogs</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-[#FF8626]">Blog Category</p>
          <h1 className="mt-3 text-4xl font-bold capitalize text-[#171717]">{title}</h1>
        </div>
      </section>
      <BlogGrid blogs={data.blogs || []} />
    </main>
  );
}

