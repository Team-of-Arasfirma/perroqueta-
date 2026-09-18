"use client";

import Link from "next/link";
import SolarTiltViewer from "./SolarTiltViewer";

export default function SolarHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto min-h-[820px] w-full max-w-[1600px] px-5 pb-20 pt-7 sm:px-8 sm:pb-24 lg:px-12 xl:px-[62px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[13px]">
          <Link
            href="/products"
            className="text-[#666666] transition hover:text-[#6030C6]"
          >
            Products
          </Link>

          <span className="text-[#999999]">&gt;</span>

          <span className="font-medium text-[#6030C6]">
            Solar Structures
          </span>
        </div>

        {/* Product Title */}
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          <h1 className="pointer-events-none text-center font-serif text-[46px] font-normal leading-none text-[#C4C0C0] sm:text-[62px] lg:text-[74px]">
            Solar Structures
          </h1>
        </div>

        {/* Main Viewer */}
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          <div className="w-full max-w-[760px]">
            <SolarTiltViewer
              image="/assets/products/solar.png"
              alt="Perroqueta Solar Structure"
            />
          </div>

          {/* Specification Highlights */}
          <div className="mt-10 flex flex-wrap justify-center gap-5 sm:mt-12 sm:gap-6 lg:mt-14">
            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              Ground Mounted
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              Rooftop
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}