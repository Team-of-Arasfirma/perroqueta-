'use client';

import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatBlogDate, truncateText } from "@/lib/blogContent";

const blogUrl = (blog) => blog.subCategorySlug
  ? `/${blog.categorySlug}/${blog.subCategorySlug}/${blog.slug}`
  : `/${blog.categorySlug}/${blog.slug}`;

export default function BlogGrid({ blogs = [] }) {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {blogs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#DCD3EA] bg-white px-6 py-20 text-center">
            <p className="text-lg font-bold text-[#222]">No blogs found</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <article key={blog._id || blog.slug} className="group overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white transition hover:-translate-y-1 hover:shadow-lg">
                {blog.coverImage || blog.featuredImage?.url ? (
                  <div className="relative h-[230px] w-full overflow-hidden bg-[#F4F4F4]">
                    <Image
                      src={blog.coverImage || blog.featuredImage.url}
                      alt={blog.featuredImage?.altText || blog.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex min-h-[240px] flex-col p-5 sm:p-6">
                  <p className="inline-flex items-center gap-1 text-xs text-[#777]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatBlogDate(blog.date || blog.publishedAt || blog.createdAt)}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-tight text-[#1B1B1B]">{blog.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#666]">{truncateText(blog.excerpt || blog.content, 180)}</p>
                  <Link href={blogUrl(blog)} className="mt-auto pt-6 text-sm font-semibold text-[#FF8626] hover:text-[#6030C6]">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

