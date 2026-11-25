"use client";

import Image from "next/image";
import Link from "next/link";
import { byDisplayOrder, productText } from "../productPresentation";
import { useState } from "react";
import { Check } from "lucide-react";

import ProductTiltViewer from "../upvc/ProductTiltViewer";

export default function StoneCoatedDetails({ product }) {
  const variants = byDisplayOrder(product.profiles).map((profile) => ({
    ...profile,
    colors: byDisplayOrder(profile.colors),
  }));
  const [selectedVariant, setSelectedVariant] =
    useState(product.hero.defaultProfileId);

  const [selectedColor, setSelectedColor] =
    useState(product.hero.defaultColorId);

  const currentVariant =
    variants.find(
      (variant) => variant.id === selectedVariant
    ) || variants[0];

  const currentColor =
    currentVariant.colors.find(
      (color) => color.id === selectedColor
    ) || currentVariant.colors[0];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto min-h-[760px] w-full max-w-[1600px] px-5 pb-14 pt-7 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[13px]">
          <Link
            href="/products"
            className="text-[#646474] transition hover:text-[#6030C6]"
          >
            Products
          </Link>

          <span className="text-[#8A8A8A]">
            &gt;
          </span>

          <span className="font-medium text-[#6030C6]">
            {product.breadcrumbLabel}
          </span>
        </div>

        {/* Product Showcase */}
        <div className="relative mt-5">
          {/* Main Title */}
          <h1 className="pointer-events-none text-center font-serif text-[46px] font-normal uppercase leading-none text-[#C3BFBF] sm:text-[60px] lg:text-[72px]">
            {product.detailHeading}
          </h1>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_150px]">
            {/* Main Product Area */}
            <div className="flex flex-col items-center">
              {/* Main Product Image */}
              <div className="w-full max-w-[900px]">
                <ProductTiltViewer
                  image={currentColor.image.url}
                  alt={currentColor.image.alt || productText(product.hero.alt, { profile: currentVariant.label, color: currentColor.label }) || product.name}
                />
              </div>

              {/* Bottom Color Options */}
              <div className="mt-5 flex flex-wrap items-start justify-center gap-5 sm:gap-6">
                {currentVariant.colors.map(
                  (color) => {
                    const active =
                      currentColor.id === color.id;

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() =>
                          setSelectedColor(color.id)
                        }
                        aria-label={`Select ${color.label}`}
                        title={color.label}
                        className="group flex flex-col items-center"
                      >
                        <div
                          className={`relative h-[72px] w-[72px] overflow-hidden rounded-[9px] border-2 bg-[#F7F7F7] transition-all duration-300 sm:h-[78px] sm:w-[78px] ${active
                            ? "scale-[1.07] border-[#FF8626] shadow-md"
                            : "border-[#ECECEC] hover:scale-[1.03] hover:border-[#CFCFCF]"
                            }`}
                        >
                          <Image
                            src={(color.thumbnail ?? color.image).url}
                            alt={color.thumbnail?.alt || color.label}
                            fill
                            sizes="78px"
                            className="object-contain p-1"
                          />

                          {active && (
                            <>
                              <div className="absolute inset-0 bg-black/[0.03]" />

                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF8626] text-white shadow-md">
                                  <Check
                                    className="h-4 w-4"
                                    strokeWidth={2.5}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <span
                          className={`mt-2 max-w-[90px] text-center text-[12px] leading-4 ${active
                            ? "font-semibold text-[#171717]"
                            : "text-[#555555]"
                            }`}
                        >
                          {color.label}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Right Side Variant Options */}
            <div className="flex flex-row flex-wrap justify-center gap-5 lg:flex-col lg:items-center lg:justify-start">
              {variants.map((variant) => {
                const active =
                  selectedVariant === variant.id;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      if (selectedVariant !== variant.id) {
                        setSelectedVariant(variant.id);
                        setSelectedColor(variant.colors[0].id);
                      }
                    }}
                    aria-label={`Select ${variant.label}`}
                    title={variant.label}
                    className="group flex flex-col items-center"
                  >
                    <div
                      className={`relative h-[78px] w-[78px] overflow-hidden rounded-[9px] border-2 bg-[#F7F7F7] transition-all duration-300 ${active
                        ? "scale-[1.07] border-[#FF8626] shadow-md"
                        : "border-[#ECECEC] hover:scale-[1.03] hover:border-[#CFCFCF]"
                        }`}
                    >
                      <Image
                        src={(variant.thumbnail ?? variant.colors[0].image).url}
                        alt={variant.thumbnail?.alt || variant.label}
                        fill
                        sizes="78px"
                        className="object-contain p-1"
                      />

                      {active && (
                        <>
                          <div className="absolute inset-0 bg-black/[0.03]" />

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF8626] text-white shadow-md">
                              <Check
                                className="h-4 w-4"
                                strokeWidth={2.5}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <span
                      className={`mt-2 text-center text-[12px] ${active
                        ? "font-semibold text-[#171717]"
                        : "text-[#555555]"
                        }`}
                    >
                      {variant.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Information */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-[#666666]">
            <p>
              Variant:{" "}
              <span className="font-semibold text-[#6030C6]">
                {currentVariant.label}
              </span>
            </p>

            <p>
              Color:{" "}
              <span className="font-semibold text-[#6030C6]">
                {currentColor.label}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}