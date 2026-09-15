import Image from "next/image";

export default function StatsBanner() {
  const stats = [
    {
      value: "7+",
      label: "Products",
      icon: "/assets/Icons/layers.svg",
      bg: "#5B36D6",
    },
    {
      value: "1000+",
      label: "Projects",
      icon: "/assets/Icons/building-2.svg",
      bg: "#FF8A22",
    },
    {
      value: "2+",
      label: "Years Experience",
      icon: "/assets/Icons/users.svg",
      bg: "#4A6CE7",
    },
    {
      value: "Pan-India",
      label: "Delivery",
      icon: "/assets/Icons/earth.svg",
      bg: "#F4B225",
    },
  ];

  return (
    <div className="relative z-30 mx-auto -mt-[34px] w-[calc(100%-40px)] max-w-[1180px]">
      <div className="grid grid-cols-2 gap-x-5 gap-y-6 rounded-[18px] border border-[#EEEAF5] bg-white px-5 py-5 shadow-[0_12px_34px_rgba(49,29,91,0.12)] lg:grid-cols-4 lg:gap-0 sm:px-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex min-w-0 flex-col items-center gap-3 text-center sm:flex-row sm:text-left lg:px-5 ${index > 0 ? "lg:border-l lg:border-[#EEEAF5]" : ""}`}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: stat.bg }}
            >
              <Image
                src={stat.icon}
                alt=""
                aria-hidden="true"
                width={28}
                height={28}
                className="h-[28px] w-[28px] object-contain brightness-0 invert"
              />
            </div>

            <div>
              <p className="text-[24px] sm:text-[30px] font-bold leading-none tracking-[-0.02em] text-[#171717]">
                {stat.value}
              </p>

              <p className="mt-2 text-[14px] font-medium leading-tight text-[#666]">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}