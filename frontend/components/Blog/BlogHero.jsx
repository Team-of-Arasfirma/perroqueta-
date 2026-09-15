import Link from "next/link";

export default function BlogHero() {
  return (
    <section className="relative min-h-[470px] w-full overflow-hidden bg-[#FBFAFD]">
      {/* Soft Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[40px] h-[300px] w-[300px] rounded-full bg-[#6030C6]/8 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[5%] h-[260px] w-[260px] rounded-full bg-[#FF8626]/8 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6030C608_1px,transparent_1px),linear-gradient(to_bottom,#6030C608_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[470px] w-full max-w-[1600px] items-center px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Left Content */}
        <div className="max-w-[620px] lg:max-w-[calc(100%_-_450px)] xl:max-w-[620px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#FF8626]">
            Our Blog
          </p>

          <h1 className="mt-4 max-w-[600px] text-[36px] font-bold leading-[1.08] text-[#171717] sm:text-[42px] lg:text-[50px] xl:text-[54px]">
            Practical Ideas for
            <span className="block text-[#6030C6]">
              Better Building Decisions.
            </span>
          </h1>

          <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#666] sm:text-[16px]">
            Explore roofing insights, material guides, project ideas and
            industry knowledge curated to help you build with more clarity and
            confidence.
          </p>

          <Link
            href="#latest-blogs"
            className="mt-7 inline-flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-[#6030C6] to-[#FF8626] px-7 py-[14px] text-[15px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Explore Articles

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

        {/* Right Side Line Art */}
        <div className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="relative h-[320px] w-[420px]">
            {/* Main document outline */}
            <div className="absolute left-[90px] top-[20px] h-[265px] w-[230px] rounded-[26px] border-2 border-[#6030C6]/25 bg-white/70 shadow-[0_20px_50px_rgba(96,48,198,0.06)]">
              <div className="absolute left-7 top-8 h-[8px] w-[85px] rounded-full bg-[#FF8626]/70" />

              <div className="absolute left-7 top-[60px] h-[9px] w-[160px] rounded-full bg-[#6030C6]/70" />
              <div className="absolute left-7 top-[82px] h-[7px] w-[175px] rounded-full bg-[#D8D0E8]" />
              <div className="absolute left-7 top-[101px] h-[7px] w-[145px] rounded-full bg-[#E5DFF0]" />

              <div className="absolute left-7 top-[135px] h-[70px] w-[175px] rounded-[16px] border border-[#6030C6]/15 bg-[#F6F2FC]" />

              <div className="absolute left-7 bottom-[32px] h-[7px] w-[175px] rounded-full bg-[#E5DFF0]" />
              <div className="absolute left-7 bottom-[15px] h-[7px] w-[120px] rounded-full bg-[#EEEAF5]" />
            </div>

            {/* Pen / marker shape */}
            <div className="absolute right-[32px] top-[85px] h-[145px] w-[18px] rotate-[26deg] rounded-full bg-gradient-to-b from-[#6030C6] to-[#FF8626] shadow-[0_10px_25px_rgba(96,48,198,0.16)]" />

            <div className="absolute right-[20px] top-[208px] h-[22px] w-[22px] rotate-[26deg] rounded-[6px] bg-[#FF8626]" />

            {/* Roofing sketch line */}
            <svg
              viewBox="0 0 180 110"
              className="absolute bottom-[5px] left-[10px] h-[125px] w-[190px]"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M18 80L70 35L120 60L160 28"
                stroke="#6030C6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.65"
              />

              <path
                d="M32 80V95H145V52"
                stroke="#FF8626"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />

              <circle cx="70" cy="35" r="6" fill="#FF8626" />
            </svg>

            {/* Small accents */}
            <div className="absolute left-[35px] top-[42px] h-[12px] w-[12px] rounded-full bg-[#FF8626]" />
            <div className="absolute right-[70px] bottom-[40px] h-[16px] w-[16px] rounded-full border-2 border-[#6030C6]/40" />
          </div>
        </div>
      </div>
    </section>
  );
}