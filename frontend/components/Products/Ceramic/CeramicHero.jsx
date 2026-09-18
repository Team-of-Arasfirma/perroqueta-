"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CeramicTiltViewer from "./CeramicTiltViewer";

const colors = [
  {
    id: "red",
    name: "Red",
    image: "/assets/products/Ceramic/red.png",
  },
  {
    id: "brown",
    name: "Brown",
    image: "/assets/products/Ceramic/brown.png",
  },
  {
    id: "pattern",
    name: "Pattern",
    image: "/assets/products/Ceramic/pattern.png",
  },
  {
    id: "grey",
    name: "Grey",
    image: "/assets/products/Ceramic/grey.png",
  },
];

export default function CeramicHero() {
  const [selectedColor, setSelectedColor] = useState("red");

  const currentColor =
    colors.find((color) => color.id === selectedColor) || colors[0];

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
            Ceramic Roofing Tiles
          </span>
        </div>

        {/* Product Title */}
        <div className="relative mt-6 text-center">
          <h1 className="pointer-events-none font-serif text-[46px] font-normal leading-none text-[#C4C0C0] sm:text-[62px] lg:text-[74px]">
            Ceramic Roofing Tiles
          </h1>
        </div>

        {/* Main Viewer */}
        <div className="mt-[5px] flex flex-col items-center">
          <div className="w-full max-w-[820px]">
            <CeramicTiltViewer
              image={currentColor.image}
              alt={`Ceramic Roofing Tile - ${currentColor.name}`}
            />
          </div>

          {/* Color Selector */}
          <div className="mt-12 flex flex-wrap items-start justify-center gap-5 sm:gap-6">
            {colors.map((color) => {
              const active = selectedColor === color.id;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className="group flex flex-col items-center"
                  aria-label={`Select ${color.name}`}
                >
                  <div
                    className={`relative h-[66px] w-[66px] overflow-hidden rounded-[8px] border-2 bg-white transition-all duration-300 sm:h-[72px] sm:w-[72px] ${
                      active
                        ? "scale-[1.06] border-[#FF8626] shadow-md"
                        : "border-[#E5E5E5] hover:border-[#CFCFCF]"
                    }`}
                  >
                    <Image
                      src={color.image}
                      alt={color.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />

                    {active && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF8626] text-white shadow-md">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>

                  <span
                    className={`mt-2 text-[12px] ${
                      active
                        ? "font-semibold text-[#171717]"
                        : "text-[#555555]"
                    }`}
                  >
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
