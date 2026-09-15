import {
  ShieldCheck,
  Sparkles,
  Clock3,
  Headphones,
  Shield,
  Sprout,
} from "lucide-react";

const features = [
  {
    title: "Premium Quality",
    description: "High-grade raw materials and advanced technology.",
    icon: ShieldCheck,
  },
  {
    title: "Durability",
    description: "Products designed to withstand harsh conditions.",
    icon: Sparkles,
  },
  {
    title: "Timely Delivery",
    description: "Pan-India delivery network ensures on-time supply.",
    icon: Clock3,
  },
  {
    title: "Expert Support",
    description: "Technical guidance and dedicated customer support.",
    icon: Headphones,
  },
  {
    title: "Sustainable Solutions",
    description: "Eco-friendly and energy efficient solutions.",
    icon: Shield,
  },
  {
    title: "Value for Money",
    description: "Best quality products that offer long-term value.",
    icon: Sprout,
  },
];

export default function WhyChooseAbout() {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="overflow-hidden rounded-[16px] border border-[#EEEEEE] bg-white">
          <div className="grid lg:grid-cols-[30%_70%]">
            {/* Left Content */}
            <div className="relative overflow-hidden bg-[#F6F3FD] px-5 py-9 min-[375px]:px-8 pb-20 sm:px-10 lg:px-9 lg:pt-10 lg:pb-20">
              {/* Decorative Shapes */}
              <div className="absolute -right-16 top-[-55px] h-[180px] w-[180px] rounded-full bg-[#F7D9D2]/60" />

              <div className="absolute -left-20 bottom-[-90px] h-[210px] w-[210px] rounded-full bg-[#DDD3F5]/70" />

              <div className="absolute bottom-[35px] left-[90px] h-8 w-8 rounded-full bg-[#FF9147]" />

              <div className="absolute bottom-[38px] right-[75px] h-6 w-6 rounded-full bg-[#7B57D9]" />

              {/* Text */}
              <div className="relative z-10">
                <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
                  Why Choose Perroqueta
                </p>

                <h2 className="mt-4 max-w-[380px] text-[28px] min-[375px]:text-[30px] font-bold leading-[1.08] text-[#171717] sm:text-[32px] lg:text-[34px]">
                  Quality You Can Trust.
                  <span className="block">
                    Performance You Deserve.
                  </span>
                </h2>
              </div>
            </div>

            {/* Right Features */}
            <div className="bg-white px-5 py-9 min-[375px]:px-7 sm:px-10 lg:px-10 lg:py-10 xl:px-12">
              <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-10">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-[2px] shrink-0 text-[#6030C6]">
                        <Icon
                          size={24}
                          strokeWidth={1.7}
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[16px] font-semibold leading-5 text-[#6030C6]">
                          {feature.title}
                        </h3>

                        <p className="mt-2 max-w-[220px] text-[13px] leading-5 text-[#555555]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}