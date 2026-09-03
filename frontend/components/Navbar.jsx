"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import GetInTouchModal from "./GetInTouchModal";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Products", href: "/products" },
  { label: "Project", href: "/project" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <nav className="mx-auto flex min-h-[76px] w-full max-w-[1920px] items-center justify-between gap-4 px-5 sm:min-h-[80px] sm:px-8 lg:px-10 xl:min-h-[82px] xl:px-12 2xl:px-[62px]">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="relative block h-[42px] w-[170px] shrink-0 sm:h-[48px] sm:w-[200px] lg:h-[52px] lg:w-[220px] xl:h-[56px] xl:w-[235px]"
          >
            <Image
              src="/assets/logo/Perroqueta-block.png"
              alt="Perroqueta"
              fill
              priority
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 270px"
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center gap-6 xl:flex 2xl:gap-8">
            {navigationLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-[14px] font-medium leading-none transition-colors duration-300 ${
                    active
                      ? "text-[#5F2FC5]"
                      : "text-[#5F5D5D] hover:text-[#5F2FC5]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden shrink-0 items-center gap-3 xl:flex 2xl:gap-5">
            <a
              href="/brochure/perroqueta-brochure.pdf"
              download
              className="whitespace-nowrap rounded-[11px] border-2 border-[#6535D0] px-4 py-3 text-[14px] font-medium leading-none text-[#5630BD] transition-all duration-300 hover:bg-[#6535D0] hover:text-white"
            >
              Download Brochure
            </a>

            <button
              type="button"
              onClick={() => setIsEnquiryOpen(true)}
              className="whitespace-nowrap rounded-[11px] bg-gradient-to-r from-[#FF8A22] to-[#BD4E7D] px-6 py-3.5 text-[14px] font-medium leading-none text-white transition-transform duration-300 hover:-translate-y-0.5"
            >
              Get In Touch
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6030C6] text-[#6030C6] transition-colors hover:bg-[#F6F2FC] xl:hidden"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M6 6L18 18M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M4 7H20M4 12H20M4 17H20" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile / Tablet Menu */}
        {menuOpen && (
          <div className="border-t border-[#EEE8F5] bg-white px-5 pb-7 sm:px-8 xl:hidden">
            <div className="flex flex-col">
              {navigationLinks.map((link) => {
                const active = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`border-b border-[#EEE8F5] py-3.5 text-[15px] font-medium transition-colors duration-200 ${
                      active ? "text-[#6030C6]" : "text-[#5F5D5D] hover:text-[#6030C6]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a
                href="/brochure/perroqueta-brochure.pdf"
                download
                className="rounded-xl border-2 border-[#6535D0] px-5 py-3 text-center text-[14px] font-medium text-[#5630BD]"
              >
                Download Brochure
              </a>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setIsEnquiryOpen(true);
                }}
                className="rounded-xl bg-gradient-to-r from-[#FF8A22] to-[#BD4E7D] px-5 py-3.5 text-center text-[14px] font-medium text-white"
              >
                Get In Touch
              </button>
            </div>
          </div>
        )}
      </header>

      <GetInTouchModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </>
  );
}