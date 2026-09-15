import Image from "next/image";

const stats = [
  {
    value: "7+",
    label: "Products",
    subLabel: "Categories",
    color: "bg-[#5A36C8]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="m12 3-8 4 8 4 8-4-8-4Z" />
        <path d="m4 11 8 4 8-4" />
        <path d="m4 15 8 4 8-4" />
      </svg>
    ),
  },
  {
    value: "1000+",
    label: "Projects",
    subLabel: "Completed",
    color: "bg-[#FF8A22]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M4 21V9l8-5 8 5v12" />
        <path d="M9 21v-5h6v5" />
        <path d="M8 11h2M14 11h2" />
      </svg>
    ),
  },
  {
    value: "2+",
    label: "Years",
    subLabel: "Experience",
    color: "bg-[#4D6FE5]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "Pan-India",
    label: "Delivery",
    subLabel: "Network",
    color: "bg-[#F4B325]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a15 15 0 0 1 0 18" />
        <path d="M12 3a15 15 0 0 0 0 18" />
      </svg>
    ),
  },
];

export default function WhoWeAre() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 xl:gap-16 xl:px-[62px]">
        {/* Left Content */}
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-[#5A36C8]">
            Company Overview
          </p>

          <h2 className="mt-3 max-w-[480px] text-[34px] font-bold leading-[1.05] text-[#171717] sm:text-[38px] lg:text-[42px]">
            Building Excellence
            <br />
            Since Day One.
          </h2>

          <p className="mt-5 max-w-[540px] text-[15px] leading-6 text-[#4F4F4F]">
            Perroqueta is a trusted name in roofing and building solutions. We
            provide high-quality products that combine strength, durability,
            and aesthetics for every type of construction.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0 lg:grid-cols-2 lg:gap-y-8 xl:grid-cols-4 xl:gap-y-0">
            {stats.map((stat, index) => (
              <div
                key={stat.value}
                className={`relative min-w-0 pr-4 ${
                  index !== stats.length - 1
                    ? "sm:border-r sm:border-[#D9D9D9] lg:border-r-0 xl:border-r"
                    : ""
                } ${index !== 0 ? "sm:pl-5 lg:pl-0 xl:pl-5" : ""}`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${stat.color}`}
                >
                  {stat.icon}
                </div>

                <p className="mt-3 text-[17px] font-bold leading-none text-[#171717]">
                  {stat.value}
                </p>

                <p className="mt-1 text-[14px] font-medium text-[#222]">
                  {stat.label}
                </p>

                <p className="text-[13px] text-[#666]">
                  {stat.subLabel}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Mosaic */}
        <div className="relative">
          <div className="grid h-[min(110vw,440px)] grid-cols-2 gap-3 sm:h-[500px]">
            {/* Left Full Height Image */}
            <div className="relative overflow-hidden rounded-[14px] bg-[#E7E7E7]">
              <Image
                src="/assets/about/h3.JPG"
                alt="Perroqueta roofing project"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Right Side */}
            <div className="grid grid-rows-2 gap-3">
              {/* Top Right */}
              <div className="relative overflow-hidden rounded-[14px] bg-[#E7E7E7]">
                <Image
                  src="/assets/about/why.JPG"
                  alt="Perroqueta building materials"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              {/* Bottom Right */}
              <div className="relative overflow-hidden rounded-[14px] bg-[#E7E7E7]">
                <Image
                  src="/assets/about/h4.JPG"
                  alt="Perroqueta completed project"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Center Badge */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF7F22] text-center text-white shadow-lg sm:h-[104px] sm:w-[104px]">
            <p className="text-[12px] font-medium leading-[1.35] sm:text-[13px]">
              Trusted by
              <br />
              1000+
              <br />
              Customers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
