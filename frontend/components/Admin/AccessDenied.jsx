"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AdminAccessDenied({
  title = "Access Denied",
  description = "You do not have permission to view this section.",
  backHref = "/admin",
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[880px] items-center justify-center px-4 py-10">
      <div className="w-full rounded-[24px] border border-[#E8E1F3] bg-white p-8 text-center shadow-[0_16px_40px_rgba(49,29,91,0.06)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3EEFB] text-[#6030C6]">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#FF8626]">
          Permission Required
        </p>

        <h2 className="mt-3 text-[30px] font-bold text-[#171717]">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-7 text-[#777]">
          {description}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={backHref}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6030C6] px-5 text-[13px] font-semibold text-white transition hover:bg-[#5127AE]"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
