import Link from "next/link";

export default function CareerHero() {
  return (
    <section className="relative min-h-[500px] w-full overflow-hidden bg-[#FBFAFD]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[140px] top-[20px] h-[340px] w-[340px] rounded-full bg-[#6030C6]/10 blur-3xl" />

        <div className="absolute -bottom-[140px] right-[6%] h-[300px] w-[300px] rounded-full bg-[#FF8626]/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(#6030C612_1px,transparent_1px)] bg-[size:28px_28px]" />

        <div className="absolute right-[7%] top-[50px] hidden h-[250px] w-[250px] rounded-full border-[28px] border-[#6030C6]/5 lg:block" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-[500px] w-full max-w-[1600px] items-center px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Left Content */}
        <div className="max-w-[630px] lg:max-xl:max-w-[calc(100%_-_320px)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7DDF8] bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#FF8626]" />

            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#6030C6]">
              Careers at Perroqueta
            </span>
          </div>

          <h1 className="mt-5 max-w-[610px] text-[38px] font-bold leading-[1.06] text-[#171717] sm:text-[44px] lg:text-[52px] xl:text-[56px]">
            Build Your Career.
            <span className="block">
              Grow With{" "}
              <span className="text-[#6030C6]">
                Perroqueta.
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-[570px] text-[15px] leading-7 text-[#666] sm:text-[16px]">
            Join a team that values ideas, growth and meaningful work across
            roofing, building materials and modern construction solutions.
          </p>

          {/* Small benefit chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-[#E6DDF5] bg-white px-4 py-2 text-[12px] font-semibold text-[#6030C6]">
              Career Growth
            </span>

            <span className="rounded-full border border-[#FFE0C5] bg-[#FFF8F2] px-4 py-2 text-[12px] font-semibold text-[#D66A18]">
              Learning
            </span>

            <span className="rounded-full border border-[#E6DDF5] bg-white px-4 py-2 text-[12px] font-semibold text-[#6030C6]">
              Opportunity
            </span>
          </div>

          <Link
            href="#open-positions"
            className="mt-7 inline-flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-[#6030C6] to-[#FF8626] px-7 py-[14px] text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(96,48,198,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(96,48,198,0.24)]"
          >
            View Open Positions

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
          </Link>
        </div>

        {/* Right Career Visual */}
        <div className="pointer-events-none absolute right-[4%] top-1/2 hidden -translate-y-1/2 lg:block lg:max-xl:origin-right lg:max-xl:scale-[0.65]">
          <div className="relative h-[380px] w-[470px]">
            {/* Main Glass Card */}
            <div className="absolute left-[70px] top-[55px] h-[260px] w-[310px] rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_25px_70px_rgba(72,47,117,0.14)] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#999]">
                    Career Journey
                  </p>

                  <p className="mt-2 text-[19px] font-bold text-[#222]">
                    Grow With Us
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1ECFB] text-[#6030C6]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path d="M5 20V10" />
                    <path d="M12 20V4" />
                    <path d="M19 20v-7" />
                  </svg>
                </div>
              </div>

              {/* Growth Bars */}
              <div className="mt-8 flex items-end gap-4">
                <div className="flex-1">
                  <div className="h-[55px] rounded-[14px] bg-[#EEE7F8]" />
                  <p className="mt-2 text-center text-[10px] font-semibold text-[#8B83A0]">
                    Learn
                  </p>
                </div>

                <div className="flex-1">
                  <div className="h-[85px] rounded-[14px] bg-[#DCCEF3]" />
                  <p className="mt-2 text-center text-[10px] font-semibold text-[#8B83A0]">
                    Build
                  </p>
                </div>

                <div className="flex-1">
                  <div className="h-[120px] rounded-[14px] bg-gradient-to-t from-[#6030C6] to-[#8157D8]" />
                  <p className="mt-2 text-center text-[10px] font-semibold text-[#6030C6]">
                    Grow
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Profile Card */}
            <div className="absolute right-[0px] top-[35px] w-[170px] rotate-[5deg] rounded-[22px] border border-[#ECE4F7] bg-white p-4 shadow-[0_18px_45px_rgba(68,42,115,0.12)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6030C6] to-[#FF8626] text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21c1-4 3.4-6 7-6s6 2 7 6" />
                  </svg>
                </div>

                <div>
                  <div className="h-[7px] w-[65px] rounded-full bg-[#6030C6]/60" />
                  <div className="mt-2 h-[6px] w-[45px] rounded-full bg-[#DDD5E9]" />
                </div>
              </div>

              <div className="mt-4 h-[6px] w-full rounded-full bg-[#EEE9F5]" />
              <div className="mt-2 h-[6px] w-[75%] rounded-full bg-[#EEE9F5]" />
            </div>

            {/* Floating Opportunity Card */}
            <div className="absolute bottom-[15px] left-[15px] w-[180px] -rotate-[6deg] rounded-[20px] bg-gradient-to-r from-[#6030C6] to-[#7E53D2] p-4 text-white shadow-[0_20px_45px_rgba(96,48,198,0.2)]">
              <p className="text-[11px] font-semibold text-white/70">
                Opportunities
              </p>

              <p className="mt-1 text-[17px] font-bold">
                Build. Learn. Grow.
              </p>
            </div>

            {/* Orange Accent */}
            <div className="absolute right-[40px] bottom-[40px] h-[58px] w-[58px] rounded-[18px] bg-[#FF8626] shadow-[0_15px_30px_rgba(255,134,38,0.22)]" />

            {/* Decorative Dot */}
            <div className="absolute left-[20px] top-[45px] h-[16px] w-[16px] rounded-full bg-[#FF8626]" />

            <div className="absolute right-[70px] top-[0px] h-[12px] w-[12px] rounded-full bg-[#6030C6]/40" />
          </div>
        </div>
      </div>
    </section>
  );
}