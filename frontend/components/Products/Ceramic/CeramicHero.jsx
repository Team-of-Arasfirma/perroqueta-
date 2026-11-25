"use client";

import Image from "next/image";
import Link from "next/link";
import { byDisplayOrder, productText } from "../productPresentation";
import { useState } from "react";
import CeramicTiltViewer from "./CeramicTiltViewer";

export default function CeramicHero({ product }) {
  const colors = byDisplayOrder(product.options);
  const [selectedColor, setSelectedColor] = useState(product.hero.defaultOptionId);

  const currentColor =
    colors.find((color) => color.id === selectedColor) || colors[0];

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
            {product.breadcrumbLabel}
          </span>
        </div>

        {/* Product Title */}
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          <h1 className="pointer-events-none text-center font-serif text-[46px] font-normal leading-none text-[#C4C0C0] sm:text-[62px] lg:text-[74px]">
            {product.detailHeading}
          </h1>
        </div>

        {/* Main Viewer */}
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          <div className="w-full max-w-[760px]">
            <CeramicTiltViewer
              image={currentColor.image.url}
              alt={currentColor.image.alt || productText(product.hero.alt, { label: currentColor.label }) || product.name}
            />
          </div>

          {/* Color Selector */}
          <div className="mt-10 flex flex-wrap items-start justify-center gap-5 sm:mt-12 sm:gap-7 lg:mt-14">
            {colors.map((color) => {
              const active = selectedColor === color.id;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className="group flex flex-col items-center"
                  aria-label={`Select ${color.label}`}
                >
                  <div
                    className={`relative h-[66px] w-[66px] overflow-hidden rounded-[8px] border-2 bg-white transition-all duration-300 sm:h-[72px] sm:w-[72px] ${
                      active
                        ? "scale-[1.06] border-[#FF8626] shadow-md"
                        : "border-[#E5E5E5] hover:border-[#CFCFCF]"
                    }`}
                  >
                    <Image
                      src={(color.thumbnail ?? color.image).url}
                      alt={color.thumbnail?.alt || color.label}
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
                    {color.label}
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