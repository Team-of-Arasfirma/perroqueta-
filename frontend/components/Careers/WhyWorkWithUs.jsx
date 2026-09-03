import {
  Users,
  TrendingUp,
  Lightbulb,
  Award,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Collaborative Team",
    description:
      "Work with a supportive team where ideas, ownership and teamwork are valued.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Build your skills through real projects, practical experience and continuous learning.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Driven",
    description:
      "Be part of a team that explores better materials, smarter methods and new possibilities.",
  },
  {
    icon: Award,
    title: "Meaningful Work",
    description:
      "Contribute to roofing, building and structural projects that create lasting value.",
  },
  {
    icon: HeartHandshake,
    title: "People First",
    description:
      "We believe strong teams are built through respect, communication and mutual support.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Culture",
    description:
      "Work in an environment focused on dependable execution, safety and high standards.",
  },
];

export default function WhyWorkWithUs() {
  return (
    <section className="w-full bg-[#FBFBFB] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Heading */}
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            Why Perroqueta
          </p>

          <h2 className="mt-3 text-[28px] font-bold leading-tight text-[#171717] sm:text-[34px]">
            Grow With a Team That Builds Better
          </h2>

          <p className="mt-4 text-[14px] leading-6 text-[#666666]">
            At Perroqueta, you get the opportunity to learn, contribute and
            grow while working on real-world projects across roofing, building
            materials and structural solutions.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-[14px] border border-[#E8E3F2] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#CDBBF0] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#F2EDFC] text-[#6030C6] transition duration-300 group-hover:bg-[#6030C6] group-hover:text-white">
                  <Icon
                    className="h-6 w-6"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-5 text-[18px] font-semibold text-[#1B1B1B]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[14px] leading-6 text-[#666666]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}