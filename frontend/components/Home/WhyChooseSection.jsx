import Image from "next/image";

const features = [
  {
    title: "Premium Quality",
    description: "High-grade raw materials and advanced technology.",
    icon: "/assets/Icons/shield-check.svg",
  },
  {
    title: "Weather Resistant",
    description: "Engineered to withstand harsh weather conditions.",
    icon: "/assets/Icons/snowflake.svg",
  },
  {
    title: "Heat Insulation",
    description: "Reduces heat transfer and keeps spaces cooler.",
    icon: "/assets/Icons/thermometer-sun.svg",
  },
  {
    title: "Fire Retardant",
    description: "Enhanced safety with fire-resistant properties.",
    icon: "/assets/Icons/flame.svg",
  },
  {
    title: "Corrosion Proof",
    description: "Rust-free, long-lasting and low maintenance.",
    icon: "/assets/Icons/shield.svg",
  },
  {
    title: "Eco Friendly",
    description: "Sustainable solutions for a better tomorrow.",
    icon: "/assets/Icons/sprout.svg",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="w-full bg-white py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid min-h-[390px] overflow-hidden rounded-[20px] border border-[#EEEAF5] shadow-[0_14px_36px_rgba(49,29,91,0.08)] lg:grid-cols-[30%_70%]">
          {/* Left section */}
          <div className="relative min-h-[320px] overflow-hidden bg-[#F3F3F5] lg:min-h-full">
            <Image
              src="/assets/why.JPG"
              alt="Why choose Perroqueta"
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#1B1230]/55 via-[#2A1B48]/10 to-transparent" />

            <div className="absolute inset-0 flex items-end px-6 pb-8 sm:px-8 lg:px-10 lg:pb-10">
              <div className="max-w-[330px]">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white">
                  Why Choose Perroqueta
                </p>

                <h2 className="mt-3 text-[30px] font-bold leading-[1.08] text-white">
                  Quality You Can Trust.
                  <br />
                  Performance You Deserve.
                </h2>
              </div>
            </div>
          </div>

          {/* Right features */}
          <div className="flex items-center bg-[#FBFBFB] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 xl:px-14">
            <div className="grid w-full gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3 xl:gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="grid grid-cols-[44px_1fr] items-start gap-3 rounded-[16px] border border-[#EEE7F8] bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(49,29,91,0.07)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EEFB]">
                    <Image
                      src={feature.icon}
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold leading-[1.2] text-[#6030C6]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 max-w-[240px] text-[13px] leading-6 text-[#666666]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
