import {
  CheckCircle2,
  MapPin,
  Navigation,
} from "lucide-react";

const points = [
  "Premium quality roofing solutions",
  "On-time delivery and support",
  "Custom solutions for every project",
  "Experienced technical team",
];

export default function ContactMap() {
  return (
    <section className="w-full bg-white pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="grid gap-5 lg:grid-cols-[1.8fr_1fr]">
          {/* Left Map */}
          <div className="relative overflow-hidden rounded-[18px] border border-[#E8E8E8] bg-white shadow-sm">
            <div className="h-[340px] w-full sm:h-[390px] lg:h-[420px]">
              <iframe
                title="Perroqueta Materials Science Private Limited - Avinashi"
                src="https://www.google.com/maps?q=11.1864612,77.2863818&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Info Card */}
            <div className="absolute left-5 top-5 w-[280px] max-w-[calc(100%-40px)] rounded-[14px] bg-white p-5 shadow-xl sm:left-7 sm:top-7 sm:w-[320px]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0EAFB] text-[#6030C6]">
                  <MapPin
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    Perroqueta
                  </h3>

                  <p className="mt-1 text-[13px] leading-5 text-[#666666]">
                    Roofing &amp; Building Solutions
                  </p>

                  <p className="text-[13px] leading-5 text-[#666666]">
                    Avinashi, Tamil Nadu, India
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps?q=11.1864612,77.2863818"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#6030C6] transition duration-300 hover:text-[#FF8626]"
              >
                Get Directions

                <Navigation
                  className="h-4 w-4"
                  strokeWidth={1.9}
                />
              </a>
            </div>
          </div>

          {/* Right Why Choose Card */}
          <div className="relative overflow-hidden rounded-[18px] bg-[#15104A] p-7 text-white shadow-sm sm:p-8 lg:p-10">
            {/* Decorative Glow */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#6030C6]/30 blur-3xl" />

            <div className="relative z-10">
              {/* Heading */}
              <h2 className="text-[30px] font-bold leading-[1.15] text-white sm:text-[34px] lg:text-[36px]">
                Why Choose Perroqueta?
              </h2>

              {/* Orange Line */}
              <div className="mt-4 h-[2px] w-[48px] bg-[#FF8626]" />

              {/* Benefits */}
              <div className="mt-8 space-y-6">
                {points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-[1px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8A4C24]">
                      <CheckCircle2
                        className="h-[18px] w-[18px] text-[#FFB27A]"
                        strokeWidth={2}
                      />
                    </div>

                    <p className="text-[16px] font-medium leading-7 text-white/95 sm:text-[17px]">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {/* Decorative Line Art */}
              <div className="pointer-events-none absolute bottom-[-10px] right-[-10px] opacity-20">
                <svg
                  width="200"
                  height="100"
                  viewBox="0 0 200 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}