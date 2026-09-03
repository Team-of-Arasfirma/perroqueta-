import {
  Factory,
  Building2,
  House,
  Wheat,
  Landmark,
  SunMedium,
} from "lucide-react";

const industries = [
  {
    title: "Industrial",
    icon: Factory,
  },
  {
    title: "Commercial",
    icon: Building2,
  },
  {
    title: "Residential",
    icon: House,
  },
  {
    title: "Agriculture",
    icon: Wheat,
  },
  {
    title: "Institutional",
    icon: Landmark,
  },
  {
    title: "Solar Projects",
    icon: SunMedium,
  },
];

export default function IndustriesWeServe() {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[30px] font-bold uppercase text-[#6030C6] sm:text-[34px]">
            Industries We Serve
          </h2>

          <p className="mt-2 text-[15px] text-[#333333]">
            Solutions for Every Industry
          </p>
        </div>

        {/* Industry Cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {industries.map((industry) => {
            const Icon = industry.icon;

            return (
              <div
                key={industry.title}
                className="group flex min-h-[190px] flex-col items-center justify-center rounded-[18px] border border-[#E5DDF1] bg-white px-4 py-6 text-center shadow-[0_6px_20px_rgba(65,40,110,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CFC0E9] hover:shadow-[0_14px_35px_rgba(65,40,110,0.10)]"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2ECFB] text-[#6030C6] transition-all duration-300 group-hover:bg-[#6030C6] group-hover:text-white">
                  <Icon
                    className="h-7 w-7"
                    strokeWidth={1.8}
                  />
                </div>

                {/* Label */}
                <h3 className="mt-5 text-[15px] font-semibold text-[#222222]">
                  {industry.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}