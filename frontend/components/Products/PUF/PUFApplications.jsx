import {
  Snowflake,
  Factory,
  Warehouse,
  Building2,
  Store,
  Boxes,
} from "lucide-react";

const applications = [
  {
    icon: Snowflake,
    title: "Cold Storage",
    description:
      "Suitable for insulated cold storage building applications.",
  },
  {
    icon: Factory,
    title: "Industrial Buildings",
    description:
      "Can be used in factories and industrial structures requiring insulated panels.",
  },
  {
    icon: Warehouse,
    title: "Warehouses",
    description:
      "Suitable for warehouse walls and roofing based on project requirements.",
  },
  {
    icon: Boxes,
    title: "Storage Facilities",
    description:
      "Supports insulated storage and controlled-environment building applications.",
  },
  {
    icon: Store,
    title: "Commercial Buildings",
    description:
      "Suitable for selected commercial construction and insulated enclosure requirements.",
  },
  {
    icon: Building2,
    title: "Prefabricated Structures",
    description:
      "Can be integrated into modular and prefabricated building systems.",
  },
];

export default function PUFApplications() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="max-w-[760px]">
          <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-[#6030C6]">
            Applications
          </p>

          <h2 className="mt-3 text-[30px] font-bold leading-tight text-[#171717] sm:text-[36px]">
            Designed for Insulated Building Applications
          </h2>

          <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-[#666666]">
            PUF panels can be used across industrial, commercial and
            temperature-controlled building projects.
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