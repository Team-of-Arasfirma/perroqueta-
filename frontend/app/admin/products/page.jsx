"use client";

import { Boxes, Construction } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <div className="mb-8">
        <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#FF8626]">
          Product Management
        </p>

        <h1 className="mt-2 text-[30px] font-bold text-[#171717]">
          Products
        </h1>

        <p className="mt-2 text-[14px] text-[#777]">
          Manage Perroqueta product information and website product content.
        </p>
      </div>

      <div className="flex min-h-[520px] items-center justify-center rounded-[24px] border border-[#E8E1F3] bg-white p-6 shadow-[0_10px_35px_rgba(49,29,91,0.05)]">
        <div className="mx-auto max-w-[560px] text-center">
          <div className="mx-auto flex h-[78px] w-[78px] items-center justify-center rounded-[22px] bg-[#F3EEFB] text-[#6030C6]">
            <Construction className="h-9 w-9" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[#6030C6]">
            <Boxes className="h-5 w-5" />

            <span className="text-[12px] font-bold uppercase tracking-[0.12em]">
              Products Module
            </span>
          </div>

          <h2 className="mt-4 text-[28px] font-bold text-[#1F1A28]">
            Under Development
          </h2>

          <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-7 text-[#777]">
            Product management will be available in the next phase.
          </p>

          <div className="mx-auto mt-7 inline-flex items-center rounded-full border border-[#E1D7F4] bg-[#FAF7FF] px-4 py-2 text-[12px] font-semibold text-[#6030C6]">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}