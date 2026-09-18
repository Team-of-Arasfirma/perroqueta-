"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const products = [
  {
    title: "UPVC Roofing Solutions",
    image: "/assets/products/upv1.png",
    href: "/products/upvc-roofing-sheets",
  },
  {
    title: "Stone Coated Roofing",
    image: "/assets/products/stone-coated.png",
    href: "/products/stone-coated-roofing",
  },
  {
    title: "Ceramic Roofing Tiles",
    image: "/assets/products/ceramic.png",
    href: "/products/ceramic-roofing-tiles",
  },
  {
    title: "WPC Interior Wall Panels",
    image: "/assets/products/wpc/wpc-1.png",
    href: "/products/wpc-interior-wall-panels",
  },
  {
    title: "PUF Panels",
    image: "/assets/products/puf/Roofpanel1.png",
    href: "/products/puf-panels",
  },
  {
    title: "Clay Ceiling Tiles",
    image: "/assets/products/clay-ceiling.png",
    href: "/products/clay-ceiling-tiles",
  },
  {
    title: "Terracotta Clay Jali",
    image: "/assets/products/terracotta-jali.png",
    href: "/products/terracotta-clay-jali",
  },
  {
    title: "Solar Structures",
    image: "/assets/products/solar.png",
    href: "/products/solar-structures",
  },
];

export default function ProductsSection() {
  const scrollRef = useRef(null);

  const scrollCards = (direction) => {
    if (!scrollRef.current) return;

    const cardWidth = 260;
    const gap = 24;

    scrollRef.current.scrollBy({
      left: direction === "next" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-14 sm:py-16">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[280px_1fr] lg:gap-14 lg:px-12 xl:px-[62px]">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">
            Our Products
          </p>

          <h2 className="mt-3 text-[34px] font-bold leading-[1.08] text-[#111111] sm:text-[40px]">
            Built for Strength.
            <br />
            Designed for Life.
          </h2>

          <p className="mt-4 max-w-[300px] text-[15px] leading-7 text-[#4D4D4D]">
            Explore our wide range of premium roofing and building materials for
            every need.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex w-fit items-center gap-3 rounded-xl border border-[#6030C6] px-5 py-3 text-[14px] font-semibold text-[#6030C6] transition hover:bg-[#6030C6] hover:text-white"
          >
            View Products

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Product Carousel */}
        <div className="relative min-w-0">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <Link
                key={product.title}
                href={product.href}
                className="group block w-[78vw] max-w-[260px] shrink-0 snap-start overflow-hidden rounded-[18px] border border-[#E8E1F3] bg-white shadow-[0_8px_24px_rgba(49,29,91,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#D7C8F3] hover:shadow-[0_16px_32px_rgba(49,29,91,0.12)] sm:w-[260px]"
              >
                {/* Product Image */}
                <div className="relative h-[214px] w-full overflow-hidden bg-[#FAF8FD]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 78vw, 260px"
                    loading="lazy"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Product Content */}
                <div className="p-5">
                  <h3 className="min-h-[48px] text-[17px] font-bold leading-[1.2] text-[#171717]">
                    {product.title}
                  </h3>

                  <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#6030C6] transition-all group-hover:gap-3">
                    Explore

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollCards("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9CBF5] bg-white text-[#6030C6] shadow-sm transition hover:border-[#6030C6] hover:bg-[#F7F3FF]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next products"
              onClick={() => scrollCards("next")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9CBF5] bg-white text-[#6030C6] shadow-sm transition hover:border-[#6030C6] hover:bg-[#F7F3FF]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}