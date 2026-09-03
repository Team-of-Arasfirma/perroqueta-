"use client";

import Link from "next/link";
import PUFTiltViewer from "./PUFTiltViewer";

export default function PUFHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto min-h-[700px] w-full max-w-[1600px] px-5 pb-14 pt-7 sm:px-8 lg:px-12 xl:px-[62px]">
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
            PUF Panels
          </span>
        </div>

        {/* Product Title */}
        <div className="relative mt-6 text-center">
          <h1 className="pointer-events-none font-serif text-[46px] font-normal leading-none text-[#C4C0C0] sm:text-[62px] lg:text-[74px]">
            PUF Panels
          </h1>
        </div>

        {/* Main Viewer */}
        <div className="mt-[-5px] flex flex-col items-center">
          <div className="w-full max-w-[820px]">
            <PUFTiltViewer
              image="/assets/products/puf/Roofpanel1.png"
              alt="Perroqueta PUF Panel"
            />
          </div>

          {/* Specification Highlights */}
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              20 - 150 mm Thickness
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              Custom Width
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              Custom Length
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              40 kg ± 2 Density
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}