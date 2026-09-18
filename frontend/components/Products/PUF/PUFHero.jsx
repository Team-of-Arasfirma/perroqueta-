"use client";

import { useState } from "react";
import Link from "next/link";
import PUFTiltViewer from "./PUFTiltViewer";

const pufVariants = [
  {
    name: "Gray",
    image: "/assets/products/puf/gray.png",
  },
  {
    name: "Green",
    image: "/assets/products/puf/green.png",
  },
  {
    name: "Red",
    image: "/assets/products/puf/red.png",
  },
  {
    name: "Royal Blue",
    image: "/assets/products/puf/royal blue.png",
  },
  {
    name: "Sky Blue",
    image: "/assets/products/puf/sky blue.png",
  },
  {
    name: "White",
    image: "/assets/products/puf/white.png",
  },
];

export default function PUFHero() {
  const [selectedVariant, setSelectedVariant] = useState(pufVariants[0]);

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
          {/* Bigger Hero Product Image */}
          <div className="w-full max-w-[900px] sm:max-w-[980px] lg:max-w-[2100px]">
            <PUFTiltViewer
              image={selectedVariant.image}
              alt={`Perroqueta PUF Panel ${selectedVariant.name}`}
            />
          </div>

          {/* Product Color Images */}
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:gap-4">
            {pufVariants.map((variant) => {
              const isActive =
                selectedVariant.name === variant.name;

              return (
                <button
                  key={variant.name}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  aria-label={`Select ${variant.name}`}
                  title={variant.name}
                  className={`relative h-[75px] w-[75px] overflow-hidden rounded-xl border bg-white transition sm:h-[90px] sm:w-[90px] ${
                    isActive
                      ? "border-[#6030C6] ring-2 ring-[#6030C6]/20"
                      : "border-[#E3D9F3] hover:border-[#6030C6]"
                  }`}
                >
                  <img
                    src={variant.image}
                    alt={variant.name}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              );
            })}
          </div>

          {/* Specification Highlights */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
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