"use client";

import { useRef } from "react";

const testimonials = [
  {
    quote:
      "The material quality and installation support were very good. The team handled our requirements smoothly.",
    name: "Mani",
    role: "Project Contractor",
  },
  {
    quote:
      "We were impressed with the product quality, timely delivery, and overall coordination from the Perroqueta team.",
    name: "Madhan",
    role: "Business Owner",
  },
  {
    quote:
      "A dependable team with strong product knowledge and practical solutions for roofing and building materials.",
    name: "Vetri",
    role: "Architect",
  },
  {
    quote:
      "Good service, clear communication, and quality materials. We are satisfied with the overall experience.",
    name: "Mohan",
    role: "Customer",
  },
  {
    quote:
      "Perroqueta delivered reliable materials with good coordination and professional project support.",
    name: "Vicky",
    role: "Builder",
  }
];

export default function TestimonialsSection() {
  const scrollRef = useRef(null);

  const scrollCards = (direction) => {
    if (!scrollRef.current) return;

    const cardWidth = 340;
    const gap = 24;

    scrollRef.current.scrollBy({
      left: direction === "next" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-12 xl:px-[62px]">
        {/* Left content */}
        <div className="flex flex-col justify-start pt-1">
          <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">
            What Our Clients Say
          </p>

          <h2 className="mt-4 text-[32px] font-bold leading-[1.08] text-[#111111] sm:text-[36px]">
            Trusted by Builders.
            <br />
            Loved by Clients.
          </h2>
        </div>

        {/* Right testimonial area */}
        <div className="relative min-w-0">
          {/* Top navigation */}
          <div className="mb-5 flex justify-end gap-3">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => scrollCards("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D5D5D5] bg-white text-black transition hover:border-[#6030C6] hover:text-[#6030C6]"
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
              aria-label="Next testimonials"
              onClick={() => scrollCards("next")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D5D5D5] bg-white text-black transition hover:border-[#6030C6] hover:text-[#6030C6]"
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

          {/* Testimonial cards */}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="flex min-h-[260px] w-[82vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-[16px] border border-[#E5E5E5] bg-white p-7"
              >
                <div>
                  <p className="text-[38px] font-bold leading-none text-[#6030C6]">
                    “
                  </p>

                  <p className="mt-5 text-[16px] leading-7 text-[#4D4D4D]">
                    {testimonial.quote}
                  </p>
                </div>

                <div className="mt-8">
                  <p className="text-[16px] font-semibold text-[#111111]">
                    {testimonial.name}
                  </p>

                  <p className="mt-1 text-[14px] text-[#777777]">
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}