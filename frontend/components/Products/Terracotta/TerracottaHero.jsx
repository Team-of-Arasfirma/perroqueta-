"use client";

import { useState } from "react";
import Link from "next/link";
import TerracottaTiltViewer from "./TerracottaTiltViewer";

const jaliProducts = [
  {
    name: "Meadows",
    image: "/assets/products/Jali/Meadows.png",
    size: "12 x 8 inch",
    color: "Natural Red",
  },
  {
    name: "Chain",
    image: "/assets/products/Jali/Chain.png",
    size: "12 x 8 inch",
    color: "Natural Red",
  },
  {
    name: "Diamond",
    image: "/assets/products/Jali/Diamond.png",
    size: "12 x 8 inch",
    color: "Natural Red",
  },
];

export default function TerracottaHero() {
  const [selectedProduct, setSelectedProduct] = useState(jaliProducts[0]);

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
            Terracotta Clay Jali
          </span>
        </div>

        {/* Title */}
        <div className="relative mt-6 text-center">
          <h1 className="pointer-events-none font-serif text-[42px] font-normal leading-none text-[#C4C0C0] sm:text-[58px] lg:text-[72px]">
            Terracotta Clay Jali
          </h1>
        </div>

        <div className="mt-[-5px] flex flex-col items-center">
          {/* Main Product Viewer */}
          <div className="w-full max-w-[820px]">
            <TerracottaTiltViewer
              image={selectedProduct.image}
              alt={`Perroqueta Terracotta Clay Jali ${selectedProduct.name}`}
            />
          </div>

          {/* Product Image Selector */}
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            {jaliProducts.map((product) => {
              const isActive = selectedProduct.name === product.name;

              return (
                <button
                  key={product.name}
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  aria-label={`Select ${product.name}`}
                  className={`relative h-[85px] w-[85px] overflow-hidden rounded-xl border bg-white transition sm:h-[100px] sm:w-[100px] ${
                    isActive
                      ? "border-[#6030C6] ring-2 ring-[#6030C6]/20"
                      : "border-[#E3D9F3] hover:border-[#6030C6]"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              );
            })}
          </div>

          {/* Product Details */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              Terracotta
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              {selectedProduct.size}
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              {selectedProduct.color}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}