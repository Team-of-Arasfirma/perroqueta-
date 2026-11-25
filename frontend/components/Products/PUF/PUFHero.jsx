"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { byDisplayOrder, productText } from "../productPresentation";
import PUFTiltViewer from "./PUFTiltViewer";

export default function PUFHero({ product }) {
  const pufVariants = byDisplayOrder(product.options);
  const [selectedId, setSelectedVariant] = useState(product.hero.defaultOptionId);
  const selectedVariant = pufVariants.find((option) => option.id === selectedId) ?? pufVariants[0];

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
            {product.breadcrumbLabel}
          </span>
        </div>

        {/* Product Title */}
        <div className="relative mt-6 text-center">
          <h1 className="pointer-events-none font-serif text-[46px] font-normal leading-none text-[#C4C0C0] sm:text-[62px] lg:text-[74px]">
            {product.detailHeading}
          </h1>
        </div>

        {/* Main Viewer */}
        <div className="mt-[-5px] flex flex-col items-center">
          {/* Bigger Hero Product Image */}
          <div className="w-full max-w-[900px] sm:max-w-[980px] lg:max-w-[2100px]">
            <PUFTiltViewer
              image={selectedVariant.image.url}
              alt={selectedVariant.image.alt || productText(product.hero.alt, { label: selectedVariant.label }) || product.name}
            />
          </div>

          {/* Product Color Images */}
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:gap-4">
            {pufVariants.map((variant) => {
              const isActive =
                selectedVariant.id === variant.id;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant.id)}
                  aria-label={`Select ${variant.label}`}
                  title={variant.label}
                  className={`relative h-[75px] w-[75px] overflow-hidden rounded-xl border bg-white transition sm:h-[90px] sm:w-[90px] ${
                    isActive
                      ? "border-[#6030C6] ring-2 ring-[#6030C6]/20"
                      : "border-[#E3D9F3] hover:border-[#6030C6]"
                  }`}
                >
                  <Image
                    src={(variant.thumbnail ?? variant.image).url}
                    alt={variant.thumbnail?.alt || variant.label}
                    fill
                    sizes="90px"
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>

          {/* Specification Highlights */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {product.hero.badges.map((badge, index) => (
              <span key={index} className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}