"use client";

import Image from "next/image";
import Link from "next/link";

const featuredBlog = {
  title: "How to Choose the Right Roofing Material for Your Building",
  excerpt:
    "Understand the key factors to consider when selecting roofing materials for durability, energy efficiency and long-term performance.",
  image: "/assets/blog/blog-1.jpg",
  category: "Roofing Guide",
  date: "August 20, 2026",
  slug: "how-to-choose-the-right-roofing-material",
};

const latestBlogs = [
  {
    id: 1,
    title: "Benefits of UPVC Roofing Sheets",
    image: "/assets/blog/blog-2.jpg",
    category: "UPVC Roofing",
    date: "August 18, 2026",
    slug: "benefits-of-upvc-roofing-sheets",
  },
  {
    id: 2,
    title: "Why PUF Panels Are Ideal for Modern Buildings",
    image: "/assets/blog/blog-3.jpg",
    category: "PUF Panels",
    date: "August 15, 2026",
    slug: "why-puf-panels-are-ideal",
  },
  {
    id: 3,
    title: "Stone Coated Roofing: Style Meets Strength",
    image: "/assets/blog/blog-4.jpg",
    category: "Roofing",
    date: "August 12, 2026",
    slug: "stone-coated-roofing",
  },
];

export default function FeaturedBlog() {
  return (
    <section
      id="latest-blogs"
      className="w-full bg-[#FBFBFB] py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Heading */}
        <div className="mb-10">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            Featured Insights
          </p>

          <h2 className="mt-3 text-[28px] font-bold leading-tight text-[#171717] sm:text-[34px]">
            Latest From Our Blog
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Main Featured Blog */}
          <Link
            href={`/blog/${featuredBlog.slug}`}
            className="group overflow-hidden rounded-[14px] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
              <Image
                src={featuredBlog.image}
                alt={featuredBlog.title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px]">
                  <span className="rounded-full bg-[#FF8626] px-3 py-1 font-medium text-white">
                    {featuredBlog.category}
                  </span>

                  <span className="text-white/80">
                    {featuredBlog.date}
                  </span>
                </div>

                <h3 className="max-w-[700px] text-[24px] font-bold leading-tight text-white sm:text-[30px]">
                  {featuredBlog.title}
                </h3>

                <p className="mt-3 max-w-[650px] text-[14px] leading-[1.6] text-white/85">
                  {featuredBlog.excerpt}
                </p>
              </div>
            </div>
          </Link>

          {/* Latest Blog List */}
          <div className="flex flex-col gap-4">
            {latestBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group grid grid-cols-[120px_1fr] gap-4 rounded-[12px] border border-[#EAEAEA] bg-white p-3 transition duration-300 hover:border-[#D8C8FA] hover:shadow-md sm:grid-cols-[150px_1fr]"
              >
                <div className="relative h-[110px] overflow-hidden rounded-[9px] sm:h-[120px]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6030C6]">
                    {blog.category}
                  </p>

                  <h3 className="mt-2 text-[16px] font-semibold leading-[1.35] text-[#222222] group-hover:text-[#6030C6]">
                    {blog.title}
                  </h3>

                  <p className="mt-2 text-[12px] text-[#777777]">
                    {blog.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}