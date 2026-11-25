"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductExpertise({ products }) {
  const scrollRef = useRef(null);

  const scrollProducts = (direction) => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(scrollRef.current).columnGap) || 0;
    const scrollAmount = card.getBoundingClientRect().width + gap;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Heading */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
              What We Offer
            </p>

            <h2 className="mt-2 text-[30px] font-bold text-[#6030C6] sm:text-[34px]">
              Our Products Expertise
            </h2>
          </div>

          {/* Desktop Arrows */}
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollProducts("left")}
              aria-label="Previous products"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#6030C6] text-[#6030C6] transition hover:bg-[#6030C6] hover:text-white"
            >
              <ChevronLeft size={21} />
            </button>

            <button
              type="button"
              onClick={() => scrollProducts("right")}
              aria-label="Next products"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6030C6] text-white transition hover:bg-[#4E26A8]"
            >
              <ChevronRight size={21} />
            </button>
          </div>
        </div>

        {/* Horizontal Product Scroll */}
        <div
          ref={scrollRef}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <Link
              key={product.slug}
              href={product.href}
              className="group w-[260px] max-w-full shrink-0 snap-start overflow-hidden rounded-[12px] border border-[#DCDCDC] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[290px] lg:w-[300px]"
            >
              {/* Product Image */}
              <div className="relative h-[190px] w-full overflow-hidden bg-[#F7F7F7]">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 639px) 260px, (max-width: 1023px) 290px, 300px"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              {/* Content */}
              <div className="min-h-[135px] px-5 py-5 text-center">
                <h3 className="text-[16px] font-semibold leading-5 text-[#171717] transition-colors group-hover:text-[#6030C6]">
                  {product.title}
                </h3>

                <p className="mt-2 text-[13px] leading-5 text-[#666666]">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Arrows */}
        <div className="mt-5 flex justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => scrollProducts("left")}
            aria-label="Previous products"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#6030C6] text-[#6030C6]"
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            onClick={() => scrollProducts("right")}
            aria-label="Next products"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6030C6] text-white"
          >
            <ChevronRight size={21} />
          </button>
        </div>
      </div>
    </section>
  );
}