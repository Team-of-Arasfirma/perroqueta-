import Link from "next/link";

export default function ProductHero() {
  return (
    <section className="relative min-h-[470px] w-full overflow-hidden bg-[#F8F5FC]">
      {/* Vector Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Purple Glow */}
        <div className="absolute -left-[120px] -top-[120px] h-[360px] w-[360px] rounded-full bg-[#6030C6]/12 blur-3xl" />

        {/* Orange Glow */}
        <div className="absolute -bottom-[140px] right-[40px] h-[320px] w-[320px] rounded-full bg-[#FF8626]/14 blur-3xl" />

        {/* Decorative Circle */}
        <div className="absolute right-[8%] top-[70px] hidden h-[270px] w-[270px] rounded-full border-[32px] border-[#6030C6]/10 lg:block" />

        {/* Small Orange Circle */}
        <div className="absolute right-[25%] top-[90px] h-[70px] w-[70px] rounded-full bg-[#FF8626]/10" />

        {/* Diagonal Shape */}
        <div className="absolute -right-[120px] top-[40px] h-[420px] w-[320px] rotate-[18deg] rounded-[80px] bg-gradient-to-br from-[#6030C6]/10 to-[#FF8626]/10" />

        {/* Dot Pattern */}
        <div className="absolute bottom-[70px] right-[12%] grid grid-cols-5 gap-3 opacity-40">
          {Array.from({ length: 20 }).map((_, index) => (
            <span
              key={index}
              className="h-[5px] w-[5px] rounded-full bg-[#6030C6]"
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto flex min-h-[470px] w-full max-w-[1600px] items-center px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="max-w-[620px] lg:max-w-[calc(100%_-_430px)] xl:max-w-[620px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#FF8626]">
            Our Products
          </p>

          <h1 className="mt-4 max-w-[600px] text-[36px] font-bold leading-[1.08] text-[#171717] sm:text-[42px] lg:text-[50px] xl:text-[54px]">
            Premium Materials.
            <span className="block text-[#6030C6]">
              Built for Better Structures.
            </span>
          </h1>

          <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#666666] sm:text-[16px]">
            Explore our complete range of roofing, wall, architectural and
            building material solutions engineered for strength, durability
            and modern construction.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-[#6030C6] to-[#FF8626] px-7 py-[14px] text-[15px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Enquire Now

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

        {/* Right Vector Illustration */}
        <div className="pointer-events-none absolute right-[5%] top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="relative h-[320px] w-[390px]">
            <div className="absolute left-[20px] top-[70px] h-[170px] w-[270px] rotate-[-8deg] rounded-[28px] border border-[#6030C6]/20 bg-white/70 shadow-[0_20px_50px_rgba(96,48,198,0.08)]" />

            <div className="absolute left-[70px] top-[35px] h-[170px] w-[270px] rotate-[4deg] rounded-[28px] bg-gradient-to-br from-[#6030C6] to-[#7A4DDA] shadow-[0_20px_50px_rgba(96,48,198,0.18)]" />

            <div className="absolute left-[115px] top-[110px] h-[150px] w-[230px] rotate-[10deg] rounded-[24px] bg-gradient-to-br from-[#FF8626] to-[#FFB26B] shadow-[0_20px_50px_rgba(255,134,38,0.16)]" />

            <div className="absolute bottom-[18px] right-[20px] h-[90px] w-[90px] rounded-full border-[14px] border-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}