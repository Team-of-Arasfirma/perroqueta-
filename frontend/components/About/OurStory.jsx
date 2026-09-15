import Link from "next/link";
import {
  Flag,
  Lightbulb,
  Handshake,
  Rocket,
} from "lucide-react";

const timeline = [
  {
    title: "Our Beginning",
    description:
      "Started our journey with a goal to deliver reliable roofing solutions.",
    icon: Flag,
  },
  {
    title: "Growth & Expansion",
    description:
      "Expanded our product range and strengthened our pan-India presence.",
    icon: Lightbulb,
  },
  {
    title: "Building Trust",
    description:
      "Earned the trust of thousands through consistent quality.",
    icon: Handshake,
  },
  {
    title: "Future Ready",
    description:
      "Continuously innovating to build a stronger, sustainable tomorrow.",
    icon: Rocket,
  },
];

export default function OurStory() {
  return (
    <section className="w-full bg-[#F7F4FF] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 xl:grid-cols-[0.34fr_0.66fr] lg:px-12 xl:gap-16 xl:px-[62px]">
        
        {/* Left Content */}
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#5A36C8]">
            Our Story
          </p>

          <h2 className="mt-3 max-w-[366px] text-[34px] font-bold leading-[1.08] text-[#171717] sm:text-[38px] lg:text-[42px]">
            From a Vision to a
            <br />
            Trusted Reality
          </h2>

          <p className="mt-5 max-w-[430px] text-[15px] leading-6 text-[#4F4F4F]">
            Founded with a vision to revolutionize the roofing industry,
            Perroqueta has grown into a reliable partner for builders,
            contractors, and architects. Our commitment to quality, innovation,
            and customer satisfaction drives everything we do.
          </p>

          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-3 rounded-[8px] border border-[#6030C6] px-4 py-[10px] text-[14px] font-medium text-[#6030C6] transition hover:bg-[#6030C6] hover:text-white"
          >
            View Projects

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Timeline */}
        <div className="relative pt-3 xl:pt-5">
          
          {/* Dashed Line */}
          <div className="absolute left-[8%] right-[8%] top-[55px] hidden border-t-2 border-dashed border-[#BBA9EA] xl:block" />

          <div className="relative z-10 grid gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            {timeline.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="text-center"
                >
                  {/* Icon Circle */}
                  <div className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#5C35C6] shadow-[0_10px_26px_rgba(92,53,198,0.22)]">
                    <Icon
                      size={38}
                      strokeWidth={1.7}
                      className="text-white"
                    />
                  </div>

                  <h3 className="mt-6 text-[16px] font-bold text-[#171717]">
                    {item.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-[190px] text-[14px] leading-5 text-[#4F4F4F]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}