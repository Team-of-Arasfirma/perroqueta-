"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white">
      {/* ================= MOBILE / TABLET HERO ================= */}
      <div className="block lg:hidden">
        {/* Video */}
        <div className="relative h-[230px] w-full overflow-hidden bg-[#F3F3F3] sm:h-[320px] md:h-[360px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/Hero/stone.png"
            className="h-full w-full object-cover object-center"
          >
            <source
              src="/assets/Hero/perroqueta-hero.mp4"
              type="video/mp4"
            />
          </video>

          {/* Very light overlay */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Content */}
        <div className="bg-white px-5 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-10">
          <div className="mx-auto w-full max-w-[700px] animate-hero-content">
            {/* Small Title */}
            <p className="text-[13px] font-bold leading-5 text-[#FF8626] sm:text-[14px]">
              Built for Strength. Designed for Life.
            </p>

            {/* Heading */}
            <h1 className="mt-3 text-[34px] font-bold leading-[1.08] text-[#171717] sm:text-[42px] md:text-[48px]">
              Premium Materials
              <span className="block">
                for Modern Buildings
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[560px] text-[15px] font-medium leading-7 text-[#4B4B4B] sm:text-[16px]">
              Reliable roofing and architectural materials designed for
              residential, commercial, and industrial projects.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-[#6030C6] to-[#FF8626] px-6 text-[15px] font-semibold text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto sm:px-7"
              >
                Explore Products
                <ArrowIcon />
              </Link>

              <Link
                href="/project"
                className="inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-[14px] border-2 border-[#6030C6] bg-white px-6 text-[15px] font-semibold text-[#6030C6] transition duration-300 hover:-translate-y-1 hover:bg-[#F8F5FF] sm:w-auto sm:px-7"
              >
                View Projects
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP HERO ================= */}
      <div className="relative hidden h-[740px] w-full overflow-hidden bg-black lg:block xl:h-[780px]">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/Hero/stone.png"
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source
            src="/assets/Hero/perroqueta-hero.mp4"
            type="video/mp4"
          />
        </video>

        {/* Very Light Dark Overlay */}
        <div className="absolute inset-0 bg-black/5" />

        {/* Desktop Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/32 via-black/8 to-transparent" />

        {/* Bottom Soft Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black/5 to-transparent" />

        {/* Purple Glow */}
        <div className="pointer-events-none absolute -left-[100px] top-[-100px] h-[340px] w-[340px] rounded-full bg-[#6030C6]/6 blur-3xl" />

        {/* Orange Glow */}
        <div className="pointer-events-none absolute bottom-[-120px] right-[2%] h-[320px] w-[320px] rounded-full bg-[#FF8626]/6 blur-3xl" />

        {/* Desktop Content */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-12 xl:px-[62px]">
          <div className="w-full max-w-[700px] animate-hero-content">
            {/* Small Title */}
            <p className="mb-4 text-[16px] font-semibold text-[#FF9B4A]">
              Built for Strength. Designed for Life.
            </p>

            {/* Heading */}
            <h1 className="max-w-[700px] text-[58px] font-bold leading-[1.06] text-white xl:text-[62px]">
              Premium Materials
              <span className="block">
                for Modern Buildings
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-[560px] text-[16px] font-medium leading-7 text-white/90">
              Reliable roofing and architectural materials designed for
              residential, commercial, and industrial projects.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-[#6030C6] to-[#FF8626] px-7 text-[16px] font-semibold text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Explore Products
                <ArrowIcon />
              </Link>

              <Link
                href="/project"
                className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[14px] border border-white/70 bg-black/5 px-7 text-[16px] font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-black/15"
              >
                View Projects
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}