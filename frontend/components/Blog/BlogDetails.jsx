import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import {
  formatBlogDate,
  sanitizeBlogHtml,
} from "@/lib/blogContent";

export default function BlogDetails({ blog }) {
  const image =
    blog.coverImage ||
    blog.featuredImage?.url ||
    "";

  return (
    <main className="w-full bg-[#FBFBFB] [overflow-wrap:anywhere]">
      <section className="relative overflow-hidden bg-[#21143A] py-16 sm:py-24">
        {image ? (
          <Image
            src={image}
            alt={
              blog.featuredImage?.altText ||
              blog.title
            }
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-r from-[#21143A] via-[#21143A]/90 to-[#6030C6]/50" />

        <div className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Back to Blogs
          </Link>

          <p className="mt-10 inline-flex items-center gap-2 text-sm text-[#FFC08A]">
            <CalendarDays className="h-4 w-4" />
            {formatBlogDate(
              blog.date ||
                blog.publishedAt ||
                blog.createdAt
            )}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            {blog.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        {image ? (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-[#F4F4F4]">
            <Image
              src={image}
              alt={
                blog.featuredImage?.altText ||
                blog.title
              }
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        ) : null}

        <article
          className="blog-content [&_pre]:max-w-full [&_pre]:overflow-x-auto rounded-3xl border border-[#EAE2F5] bg-white p-6 shadow-sm sm:p-10"
          dangerouslySetInnerHTML={{
            __html: sanitizeBlogHtml(
              blog.content || ""
            ),
          }}
        />
      </section>
    </main>
  );
}