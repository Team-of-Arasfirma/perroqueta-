'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchBlogs } from '@/services/blogService';

export default function BlogSection() {
  const scrollRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await fetchBlogs({ published: true, limit: 4 });
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err.message || 'Unable to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const scrollCards = (direction) => {
    if (!scrollRef.current) return;

    const cardWidth = 340;
    const gap = 24;

    scrollRef.current.scrollBy({
      left: direction === 'next' ? cardWidth + gap : -(cardWidth + gap),
      behavior: 'smooth',
    });
  };

  const skeletonCards = Array.from({ length: 4 }, (_, index) => index);

  return (
    <section className="w-full border-t border-[#D9D9D9] bg-white py-16">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-12 xl:px-[62px]">
        <div className="flex flex-col justify-start pt-1">
          <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">
            Latest From Our Blog
          </p>

          <h2 className="mt-4 text-[32px] font-bold leading-[1.08] text-[#111111] sm:text-[36px]">
            News & Insights
          </h2>

          <p className="mt-4 max-w-[280px] text-[16px] leading-6 text-[#4D4D4D]">
            Stay updated with the latest trends, tips, and insights in roofing and construction.
          </p>

          <Link
            href="/blog"
            className="mt-6 inline-flex w-fit items-center gap-3 rounded-[8px] border border-[#6030C6] px-5 py-3 text-[16px] font-medium text-[#6030C6] transition hover:bg-[#6030C6] hover:text-white"
          >
            View All Blogs
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="relative min-w-0">
          <div className="mb-5 flex justify-end gap-3">
            <button
              type="button"
              aria-label="Previous blogs"
              onClick={() => scrollCards('prev')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D5D5D5] bg-white text-black transition hover:border-[#6030C6] hover:text-[#6030C6]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next blogs"
              onClick={() => scrollCards('next')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D5D5D5] bg-white text-black transition hover:border-[#6030C6] hover:text-[#6030C6]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div ref={scrollRef} className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {skeletonCards.map((index) => (
                <div key={index} className="w-[82vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#E2E2E2] bg-white">
                  <div className="h-[220px] w-full animate-pulse bg-[#EAEAEA]" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-[#EAEAEA]" />
                    <div className="h-6 w-full animate-pulse rounded-full bg-[#EAEAEA]" />
                    <div className="h-6 w-4/5 animate-pulse rounded-full bg-[#EAEAEA]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-[16px] border border-dashed border-[#D8CFE6] bg-[#FBFBFB] px-6 text-center text-[14px] text-[#666]">
              {error}
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-[16px] border border-dashed border-[#D8CFE6] bg-[#FBFBFB] px-6 text-center text-[14px] text-[#666]">
              No published blogs yet.
            </div>
          ) : (
            <div ref={scrollRef} className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {blogs.map((blog) => (
                <Link
                  key={blog._id || blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="group w-[82vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#E2E2E2] bg-white"
                >
                  <div className="relative h-[220px] w-full overflow-hidden bg-[#D3D3D3]">
                    {blog.featuredImage?.url ? (
                      <Image
                        src={blog.featuredImage.url}
                        alt={blog.featuredImage.altText || blog.title}
                        fill
                        sizes="340px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>

                  <div className="p-5">
                    <h3 className="min-h-[52px] text-[18px] font-bold leading-[1.2] text-[#111111]">
                      {blog.title}
                    </h3>

                    <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-[#6030C6]">
                      Read More
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
