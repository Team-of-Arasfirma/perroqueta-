"use client";

import Link from "next/link";
import { useState } from "react";
import GetInTouchModal from "@/components/GetInTouchModal";

export default function FooterCTA() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
          <div className="flex flex-col gap-6 rounded-t-[14px] bg-gradient-to-r from-[#4930B5] via-[#9E3F7E] to-[#F56520] px-7 py-7 sm:px-10 lg:flex-row lg:items-center lg:justify-between xl:px-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-white/90">
                Ready To Get Started?
              </p>

              <h2 className="mt-2 text-[26px] font-medium leading-tight text-white sm:text-[30px]">
                Let&apos;s Build Something Great Together!
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-3 rounded-[8px] bg-white px-5 py-3 text-[15px] font-medium text-[#F06426]"
              >
                Get In Touch

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>

              <Link
                href="/project"
                className="inline-flex items-center gap-3 rounded-[8px] border border-white px-5 py-3 text-[15px] font-medium text-white transition hover:bg-white hover:text-[#6030C6]"
              >
                View Projects

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GetInTouchModal
        isOpen={isEnquiryOpen}
        source="Footer CTA Popup"
        page="Footer"
        onClose={() => setIsEnquiryOpen(false)}
      />
    </>
  );
}

