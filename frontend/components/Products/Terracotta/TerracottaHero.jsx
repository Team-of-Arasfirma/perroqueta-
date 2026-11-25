"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { byDisplayOrder, productText } from "../productPresentation";
import TerracottaTiltViewer from "./TerracottaTiltViewer";

export default function TerracottaHero({ product }) {
  const jaliProducts = byDisplayOrder(product.options);
  const [selectedId, setSelectedProduct] = useState(product.hero.defaultOptionId);
  const selectedProduct = jaliProducts.find((option) => option.id === selectedId) ?? jaliProducts[0];

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

        {/* Title */}
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          <h1 className="pointer-events-none text-center font-serif text-[42px] font-normal leading-none text-[#C4C0C0] sm:text-[58px] lg:text-[72px]">
            {product.detailHeading}
          </h1>
        </div>

        {/* Main Viewer */}
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          <div className="w-full max-w-[760px]">
            <TerracottaTiltViewer
              image={selectedProduct.image.url}
              alt={selectedProduct.image.alt || productText(product.hero.alt, { label: selectedProduct.label }) || product.name}
            />
          </div>

          {/* Product Image Selector */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 sm:mt-12 sm:gap-6 lg:mt-14">
            {jaliProducts.map((item) => {
              const isActive = selectedProduct.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProduct(item.id)}
                  aria-label={`Select ${item.label}`}
                  className={`relative h-[85px] w-[85px] overflow-hidden rounded-xl border bg-white transition sm:h-[100px] sm:w-[100px] ${
                    isActive
                      ? "border-[#6030C6] ring-2 ring-[#6030C6]/20"
                      : "border-[#E3D9F3] hover:border-[#6030C6]"
                  }`}
                >
                  <Image
                    src={(item.thumbnail ?? item.image).url}
                    alt={item.thumbnail?.alt || item.label}
                    fill
                    sizes="100px"
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>

          {/* Product Details */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[...product.hero.badges, selectedProduct.size, selectedProduct.color].filter(Boolean).map((badge, index) => (
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