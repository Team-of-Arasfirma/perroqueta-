import {
  ShieldCheck,
  ThermometerSnowflake,
  PanelsTopLeft,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: ThermometerSnowflake,
    title: "Thermal Insulation",
    description:
      "PUF panels are designed to support temperature-controlled building applications.",
  },
  {
    icon: ShieldCheck,
    title: "Durable Construction",
    description:
      "Panel construction is suitable for commercial and industrial building requirements.",
  },
  {
    icon: PanelsTopLeft,
    title: "Modular Panel System",
    description:
      "Designed for structured wall and roofing applications with custom project dimensions.",
  },
  {
    icon: Wrench,
    title: "Flexible Installation",
    description:
      "Custom width and length options support different project and installation requirements.",
  },
];

export default function PUFOverview() {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
              Product Overview
            </p>

            <h2 className="mt-3 max-w-[650px] text-[30px] font-bold leading-[1.15] text-[#171717] sm:text-[36px]">
              Insulated Panels for Modern Building Requirements
            </h2>

            <p className="mt-5 max-w-[700px] text-[15px] leading-7 text-[#5F5F5F]">
              Perroqueta PUF Panels are designed for insulated building
              applications that require practical thermal performance and
              project-based panel dimensions.
            </p>

            <p className="mt-4 max-w-[700px] text-[15px] leading-7 text-[#5F5F5F]">
              Available in thicknesses from 20 mm to 150 mm with width and
              length based on project requirements, they can support multiple
              commercial and industrial applications.
            </p>
          </div>

          <div className="rounded-[18px] bg-[#F1ECFB] p-7 sm:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#FF8626]">
              Project-Based Solutions
            </p>

            <h3 className="mt-3 text-[26px] font-bold leading-tight text-[#171717]">
              Built Around Your Requirement
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-[#5F5F5F]">
              Multiple thickness options and customized width and length make
              PUF panels suitable for different project configurations.
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