import {
  Home,
  Building2,
  Hotel,
  Store,
  Landmark,
  Warehouse,
} from "lucide-react";

const applications = [
  {
    icon: Home,
    title: "Residential Homes",
    description:
      "Ideal for villas, independent houses and premium residential roofing.",
  },
  {
    icon: Hotel,
    title: "Resorts & Hotels",
    description:
      "Adds a premium architectural finish to hospitality and resort projects.",
  },
  {
    icon: Building2,
    title: "Commercial Buildings",
    description:
      "Suitable for offices, commercial properties and modern developments.",
  },
  {
    icon: Store,
    title: "Showrooms",
    description:
      "Creates an attractive roof profile for retail and showroom buildings.",
  },
  {
    icon: Landmark,
    title: "Institutional Projects",
    description:
      "Suitable for schools, community buildings and institutional structures.",
  },
  {
    icon: Warehouse,
    title: "Architectural Projects",
    description:
      "Works well for specialized roofing where visual design is a priority.",
  },
];

export default function StoneCoatedApplications() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="max-w-[760px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            Applications
          </p>

          <h2 className="mt-3 text-[30px] font-bold leading-tight text-[#171717] sm:text-[36px]">
            Designed for Premium Roofing Projects
          </h2>

          <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-[#666666]">
            Stone coated roofing is suitable for projects that need durable
            weather protection together with a distinctive architectural look.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-[15px] border border-[#EAEAEA] bg-[#FBFBFB] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D5C6F1] hover:bg-white hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#F0EAFB] text-[#6030C6] transition duration-300 group-hover:bg-[#6030C6] group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-[18px] font-semibold text-[#171717]">
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