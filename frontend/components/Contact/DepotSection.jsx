"use client";

import { MapPin, Phone, Building2, Network, ArrowUpRight } from "lucide-react";

const depots = [
  {
    id: 1,
    name: "Chennai",
    phone: "+91 74489 77787",
  },
  {
    id: 2,
    name: "Madurai",
    phone: "+91 82708 77787",
  },
  {
    id: 3,
    name: "Salem",
    phone: "+91 70941 77787",
  },
  {
    id: 4,
    name: "Thoothukudi",
    phone: "+91 84898 77787",
  },
  {
    id: 5,
    name: "Erode",
    phone: "+91 74499 77787",
  },
  {
    id: 6,
    name: "Visakhapatnam",
    phone: "+91 81242 77787",
  },
  {
    id: 7,
    name: "Telangana",
    phone: "+91 85248 77787",
  },
  {
    id: 8,
    name: "Vijayawada",
    phone: "+91 84281 55565",
  },
  {
    id: 9,
    name: "Mangaluru",
    phone: "+91 70925 77787",
  },
];

const headOffice = {
  address:
    "D.No-4/333/18, Chinnathottam, Avinashilingampalayam, Palangarai, Avinashi, Tiruppur, Tamil Nadu - 641 654.",
  phone: "+91 95140 77787",
};

export default function DepotSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F8F6FC] py-16 sm:py-20">
      <div className="pointer-events-none absolute left-[-120px] top-10 h-[260px] w-[260px] rounded-full bg-[#6030C6]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-130px] right-[-100px] h-[300px] w-[300px] rounded-full bg-[#FF8626]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="mx-auto max-w-[780px] text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#6030C6] shadow-sm">
            <Network className="h-4 w-4" />
            Our Network
          </p>

          <h2 className="mt-4 text-[32px] font-extrabold leading-tight text-[#171717] sm:text-[44px]">
            Our Depots
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-[#666666]">
            Connect with your nearest Perroqueta depot for product enquiries,
            availability and support.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {depots.map((depot, index) => (
            <div
              key={depot.id}
              style={{ animationDelay: `${index * 80}ms` }}
              className="depot-card group relative overflow-hidden rounded-[26px] border border-[#E7DDF4] bg-white p-[1px] shadow-[0_16px_35px_rgba(40,24,80,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#CDBDEB] hover:shadow-[0_24px_60px_rgba(96,48,198,0.14)]"
            >
              <div className="absolute inset-x-0 top-0 h-[4px] bg-[linear-gradient(90deg,#6030C6,#7A45E5,#FF8626)]" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#6030C6]/10 transition-all duration-500 group-hover:scale-125 group-hover:bg-[#FF8626]/10" />

              <div className="relative flex min-h-[128px] items-center gap-3 rounded-[25px] bg-white p-4 sm:gap-5 sm:p-6 lg:gap-3 lg:p-4 xl:gap-5 xl:p-6">
                <div className="flex h-12 w-12 shrink-0 sm:h-14 sm:w-14 lg:h-12 lg:w-12 xl:h-14 xl:w-14 items-center justify-center rounded-[18px] bg-[#F0EAFB] text-[#6030C6] transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#6030C6] group-hover:text-white">
                  <MapPin className="h-7 w-7" strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="[overflow-wrap:anywhere] text-[19px] font-extrabold text-[#171717] transition-colors duration-300 group-hover:text-[#6030C6]">
                    {depot.name}
                  </h3>

                  <a
                    href={`tel:${depot.phone.replace(/\s+/g, "")}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FAF7FF] px-3 py-2 text-[14px] font-semibold text-[#666666] transition hover:bg-[#6030C6] hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    {depot.phone}
                  </a>
                </div>

                <ArrowUpRight className="h-5 w-5 text-[#C4B6DC] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#6030C6]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-[28px] bg-[#151515] shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="relative grid gap-7 p-7 sm:p-9 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-[#6030C6]/25 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-90px] left-[30%] h-52 w-52 rounded-full bg-[#FF8626]/20 blur-3xl" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#FF8626,#FFB36B)] text-white shadow-[0_15px_35px_rgba(255,134,38,0.28)]">
              <Building2 className="h-8 w-8" strokeWidth={1.8} />
            </div>

            <div className="relative">
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#FF8626]">
                Head Office
              </p>

              <h3 className="mt-2 text-[22px] font-extrabold leading-tight text-white sm:text-[26px]">
                Perroqueta Materials Science India Private Limited
              </h3>

              <p className="mt-4 max-w-[900px] text-[14px] leading-7 text-white/70">
                {headOffice.address}
              </p>
            </div>

            <a
              href={`tel:${headOffice.phone.replace(/\s+/g, "")}`}
              className="relative inline-flex w-fit items-center gap-2 rounded-2xl bg-[#6030C6] px-6 py-4 text-[15px] font-bold text-white transition hover:-translate-y-1 hover:bg-[#5127AE] hover:shadow-[0_18px_35px_rgba(96,48,198,0.35)]"
            >
              <Phone className="h-5 w-5" />
              {headOffice.phone}
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .depot-card {
          animation: depotFadeUp 0.65s ease both;
        }

        .depot-card::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.65),
            transparent
          );
          transition: transform 0.8s ease;
          z-index: 2;
          pointer-events: none;
        }

        .depot-card:hover::before {
          transform: translateX(120%);
        }

        @keyframes depotFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}