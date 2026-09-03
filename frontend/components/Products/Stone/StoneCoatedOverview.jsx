import {
  ShieldCheck,
  CloudSun,
  Volume2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Long-Lasting Protection",
    description:
      "Stone coated roofing combines a strong metal base with a protective surface finish for long-term durability.",
  },
  {
    icon: CloudSun,
    title: "Weather Resistant",
    description:
      "Designed to withstand sun, rain and changing weather conditions while maintaining performance.",
  },
  {
    icon: Volume2,
    title: "Noise Reduction",
    description:
      "The stone chip coating helps reduce rain impact noise compared with conventional bare metal roofing.",
  },
  {
    icon: Sparkles,
    title: "Premium Appearance",
    description:
      "Available in multiple profiles and colors to suit modern, traditional and premium architectural styles.",
  },
];

export default function StoneCoatedOverview() {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Left Content */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
              Product Overview
            </p>

            <h2 className="mt-3 max-w-[650px] text-[30px] font-bold leading-[1.15] text-[#171717] sm:text-[36px]">
              Premium Roofing with Strength and Style
            </h2>

            <p className="mt-5 max-w-[700px] text-[15px] leading-7 text-[#5F5F5F]">
              Perroqueta stone coated roofing sheets combine the strength of a
              metal roofing system with the premium appearance of natural stone
              finishes.
            </p>

            <p className="mt-4 max-w-[700px] text-[15px] leading-7 text-[#5F5F5F]">
              With multiple profiles and color options, they are suitable for
              residential, commercial and architectural projects where both
              performance and visual appeal are important.
            </p>
          </div>

          {/* Right Highlight */}
          <div className="rounded-[18px] bg-[#F1ECFB] p-7 sm:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#FF8626]">
              Designed to Stand Out
            </p>

            <h3 className="mt-3 text-[26px] font-bold leading-tight text-[#171717]">
              A Roof That Adds Character
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-[#5F5F5F]">
              Choose from Tradix, Tile-O, Milan and Shingles profiles with a
              range of finishes to match different architectural styles.
            </p>
          </div>
        </div>

        {/* Features */}
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