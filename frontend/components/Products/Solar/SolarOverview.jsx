import {
  Sun,
  PanelsTopLeft,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: Sun,
    title: "Solar Support Structure",
    description:
      "Designed to support solar module installation for rooftop and ground-mounted systems.",
  },
  {
    icon: PanelsTopLeft,
    title: "Flexible Configuration",
    description:
      "Suitable for different panel layouts and project-based solar structure requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Strong Structural Support",
    description:
      "Built to provide reliable support for solar panel installations across multiple project types.",
  },
  {
    icon: Wrench,
    title: "Installation Friendly",
    description:
      "Designed for practical assembly and installation based on project requirements.",
  },
];

export default function SolarOverview() {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
              Product Overview
            </p>

            <h2 className="mt-3 max-w-[650px] text-[30px] font-bold leading-[1.15] text-[#171717] sm:text-[36px]">
              Reliable Structures for Solar Installations
            </h2>

            <p className="mt-5 max-w-[700px] text-[15px] leading-7 text-[#5F5F5F]">
              Perroqueta Solar Structures are designed to support solar panel
              installations across rooftop and ground-mounted applications.
            </p>

            <p className="mt-4 max-w-[700px] text-[15px] leading-7 text-[#5F5F5F]">
              The structure can be configured according to site conditions,
              panel layout and project installation requirements.
            </p>
          </div>

          <div className="rounded-[18px] bg-[#F1ECFB] p-7 sm:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#FF8626]">
              Built for Solar Projects
            </p>

            <h3 className="mt-3 text-[26px] font-bold leading-tight text-[#171717]">
              Support That Matches the Installation
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-[#5F5F5F]">
              Available for both rooftop and ground-mounted solar structure
              applications.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-[14px] border border-[#E8E3F0] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#F0EAFB] text-[#6030C6]">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-[18px] font-semibold text-[#171717]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-[14px] leading-6 text-[#666666]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}