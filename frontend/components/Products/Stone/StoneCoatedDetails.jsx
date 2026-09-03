"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import ProductTiltViewer from "../upvc/ProductTiltViewer";

const variants = [
  {
    id: "tradix",
    name: "Tradix",
    thumbnail: "/assets/products/stone-coated/variants/tradix.png",
    colors: [
      {
        id: "arctic-blue",
        name: "Arctic Blue",
        image:
          "/assets/products/stone-coated/colors/Tradix-ArcticBlue.png",
      },
      {
        id: "asia-red",
        name: "Asia Red",
        image:
          "/assets/products/stone-coated/colors/tradix-Asiared.png",
      },
      {
        id: "black",
        name: "Black",
        image:
          "/assets/products/stone-coated/colors/Tradix-black.png",
      },
      {
        id: "red",
        name: "Red",
        image:
          "/assets/products/stone-coated/colors/Tradix-red.png",
      },
      {
        id: "sky-blue",
        name: "Sky Blue",
        image:
          "/assets/products/stone-coated/colors/Tradix-skyblue.png",
      },
    ],
  },

  {
    id: "tile-o",
    name: "Tile-O",
    thumbnail:
      "/assets/products/stone-coated/variants/tile-o.png",
    colors: [
      {
        id: "red",
        name: "Red",
        image:
          "/assets/products/stone-coated/colors/tile-ored.png",
      },
      {
        id: "asia-blue",
        name: "Asia Blue",
        image:
          "/assets/products/stone-coated/colors/tile-o-Asia blue.png",
      },
      {
        id: "autumn-brown",
        name: "Autumn Brown",
        image:
          "/assets/products/stone-coated/colors/tile-o-autumn brown.png",
      },
      {
        id: "frost-green",
        name: "Frost Green",
        image:
          "/assets/products/stone-coated/colors/tile-o-Frost green.png",
      },
    ],
  },

  {
    id: "milan",
    name: "Milan",
    thumbnail:
      "/assets/products/stone-coated/variants/milan.png",
    colors: [
      {
        id: "asia-red",
        name: "Asia Red",
        image:
          "/assets/products/stone-coated/colors/milan-Asiared.png",
      },
      {
        id: "autumn-brown",
        name: "Autumn Brown",
        image:
          "/assets/products/stone-coated/colors/milan-autumnbrown.png",
      },
      {
        id: "blue",
        name: "Blue",
        image:
          "/assets/products/stone-coated/colors/milan-Blue.png",
      },
      {
        id: "frost-green",
        name: "Frost Green",
        image:
          "/assets/products/stone-coated/colors/milan-Frostgreen.png",
      },
      {
        id: "wine-red",
        name: "Wine Red",
        image:
          "/assets/products/stone-coated/colors/milan-WineRed.png",
      },
    ],
  },

  {
    id: "shingles",
    name: "Shingles",
    thumbnail:
      "/assets/products/stone-coated/variants/shingles.png",
    colors: [
      {
        id: "asia-red",
        name: "Asia Red",
        image:
          "/assets/products/stone-coated/colors/shingles-Asiared.png",
      },
      {
        id: "autumn-brown",
        name: "Autumn Brown",
        image:
          "/assets/products/stone-coated/colors/shingles-autumnbrown.png",
      },
      {
        id: "frost-green",
        name: "Frost Green",
        image:
          "/assets/products/stone-coated/colors/shingles-Frostgreen.png",
      },
    ],
  },
];

export default function StoneCoatedDetails() {
  const [selectedVariant, setSelectedVariant] =
    useState("tradix");

  const [selectedColor, setSelectedColor] =
    useState("red");

  const currentVariant =
    variants.find(
      (variant) => variant.id === selectedVariant
    ) || variants[0];

  const currentColor =
    currentVariant.colors.find(
      (color) => color.id === selectedColor
    ) || currentVariant.colors[0];

  useEffect(() => {
    setSelectedColor(currentVariant.colors[0].id);
  }, [selectedVariant, currentVariant]);

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
            Stone Coated
          </span>
        </div>

        {/* Product Showcase */}
        <div className="relative mt-5">
          {/* Main Title */}
          <h1 className="pointer-events-none text-center font-serif text-[46px] font-normal uppercase leading-none text-[#C3BFBF] sm:text-[60px] lg:text-[72px]">
            Stone Coated Sheet
          </h1>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_150px]">
            {/* Main Product Area */}
            <div className="flex flex-col items-center">
              {/* Main Product Image */}
              <div className="w-full max-w-[900px]">
                <ProductTiltViewer
                  image={currentColor.image}
                  alt={`${currentVariant.name} ${currentColor.name} Stone Coated Roofing Sheet`}
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
                        aria-label={`Select ${color.name}`}
                        title={color.name}
                        className="group flex flex-col items-center"
                      >
                        <div
                          className={`relative h-[72px] w-[72px] overflow-hidden rounded-[9px] border-2 bg-[#F7F7F7] transition-all duration-300 sm:h-[78px] sm:w-[78px] ${active
                            ? "scale-[1.07] border-[#FF8626] shadow-md"
                            : "border-[#ECECEC] hover:scale-[1.03] hover:border-[#CFCFCF]"
                            }`}
                        >
                          <Image
                            src={color.image}
                            alt={color.name}
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
                          {color.name}
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
                    onClick={() =>
                      setSelectedVariant(variant.id)
                    }
                    aria-label={`Select ${variant.name}`}
                    title={variant.name}
                    className="group flex flex-col items-center"
                  >
                    <div
                      className={`relative h-[78px] w-[78px] overflow-hidden rounded-[9px] border-2 bg-[#F7F7F7] transition-all duration-300 ${active
                        ? "scale-[1.07] border-[#FF8626] shadow-md"
                        : "border-[#ECECEC] hover:scale-[1.03] hover:border-[#CFCFCF]"
                        }`}
                    >
                      <Image
                        src={variant.thumbnail}
                        alt={variant.name}
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
                      {variant.name}
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
                {currentVariant.name}
              </span>
            </p>

            <p>
              Color:{" "}
              <span className="font-semibold text-[#6030C6]">
                {currentColor.name}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}