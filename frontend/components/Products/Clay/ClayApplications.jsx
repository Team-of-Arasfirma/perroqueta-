import {
  Home,
  Hotel,
  Landmark,
  Building2,
  Coffee,
  Trees,
} from "lucide-react";

const applications = [
  {
    icon: Home,
    title: "Residential Interiors",
    description:
      "Suitable for homes that require a natural and traditional ceiling appearance.",
  },
  {
    icon: Hotel,
    title: "Hotels & Resorts",
    description:
      "Adds a warm clay finish to hospitality and resort interior spaces.",
  },
  {
    icon: Coffee,
    title: "Restaurants & Cafes",
    description:
      "Suitable for interior spaces designed around natural and traditional themes.",
  },
  {
    icon: Landmark,
    title: "Heritage-Style Projects",
    description:
      "Can support architectural projects where traditional clay aesthetics are important.",
  },
  {
    icon: Building2,
    title: "Architectural Interiors",
    description:
      "Suitable for selected interior ceiling applications and decorative spaces.",
  },
  {
    icon: Trees,
    title: "Eco-Themed Spaces",
    description:
      "Works well in spaces designed around natural materials and earthy finishes.",
  },
];

export default function ClayApplications() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="max-w-[760px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            Applications
          </p>

          <h2 className="mt-3 text-[30px] font-bold leading-tight text-[#171717] sm:text-[36px]">
            Designed for Natural Interior Spaces
          </h2>

          <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-[#666666]">
            Clay ceiling tiles can be used in interior applications where a
            warm, traditional and natural finish is preferred.
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