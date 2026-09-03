"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WPCTiltViewer from "./WPCTiltViewer";

const wpcImages = [
  {
    id: 1,
    image: "/assets/products/wpc/02.png",
    label: "CHERRY",
    thickness: "12mm",
    dimensions: "2950mm (L) × 153mm (W)",
    coverage: "4.85 SQF",
    width: "153mm",
    length: "2950mm",
    profileImage: "/assets/products/wpc/profile-12mm.png",
    profileType: "12mm",
    ribWidth: "24mm",
    gap: "7mm",
    sectionGap: "14mm",
  },
  {
    id: 2,
    image: "/assets/products/wpc/03.png",
    label: "CHARCOAL",
    thickness: "12mm",
    dimensions: "2950mm (L) × 153mm (W)",
    coverage: "4.85 SQF",
    width: "153mm",
    length: "2950mm",
    profileImage: "/assets/products/wpc/profile-12mm.png",
    profileType: "12mm",
    ribWidth: "24mm",
    gap: "7mm",
    sectionGap: "14mm",
  },
  {
    id: 3,
    image: "/assets/products/wpc/04.png",
    label: "NUTMEG",
    thickness: "12mm",
    dimensions: "2950mm (L) × 153mm (W)",
    coverage: "4.85 SQF",
    width: "153mm",
    length: "2950mm",
    profileImage: "/assets/products/wpc/profile-12mm.png",
    profileType: "12mm",
    ribWidth: "24mm",
    gap: "7mm",
    sectionGap: "14mm",
  },
  {
    id: 4,
    image: "/assets/products/wpc/05.png",
    label: "CARRARA GOLD",
    thickness: "15mm",
    dimensions: "2900mm (L) × 152mm (W)",
    coverage: "4.75 SQF",
    width: "152mm",
    length: "2900mm",
    profileImage: "/assets/products/wpc/profile-15mm.png",
    profileType: "15mm",
    ribWidth: "25mm",
  },
  {
    id: 5,
    image: "/assets/products/wpc/06.png",
    label: "MARQUINA GOLD",
    thickness: "15mm",
    dimensions: "2900mm (L) × 152mm (W)",
    coverage: "4.75 SQF",
    width: "152mm",
    length: "2900mm",
    profileImage: "/assets/products/wpc/profile-15mm.png",
    profileType: "15mm",
    ribWidth: "25mm",
  },
];

export default function WPCHero() {
  const [selectedImage, setSelectedImage] = useState(wpcImages[1]);

  const specifications = [
    {
      label: "Dimensions",
      value: selectedImage.dimensions,
    },
    {
      label: "Thickness",
      value: selectedImage.thickness,
    },
    {
      label: "Coverage Per Panel",
      value: selectedImage.coverage,
    },
    {
      label: "Application",
      value: "Interior Use",
    },
  ];

  const is12mm = selectedImage.profileType === "12mm";

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-16 pt-7 sm:px-8 lg:px-12 xl:px-[62px]">
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
            WPC Interior Wall Panels
          </span>
        </div>

        {/* Title */}
        <div className="relative mt-6 text-center">
          <h1 className="pointer-events-none font-serif text-[42px] font-normal leading-none text-[#C4C0C0] sm:text-[58px] lg:text-[72px]">
            WPC Interior Wall Panels
          </h1>
        </div>

        {/* Product Viewer */}
        <div className="mt-4 flex flex-col items-center">
          <div className="w-full max-w-[820px]">
            <WPCTiltViewer
              image={selectedImage.image}
              alt={`${selectedImage.thickness} ${selectedImage.label} WPC Interior Wall Panel`}
            />
          </div>

          {/* Selected Variant Name */}
          <div className="mt-4 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#FF8626]">
              VersaFlute
            </p>

            <h2 className="mt-2 text-[24px] font-bold text-[#171717] sm:text-[30px]">
              {selectedImage.thickness.toUpperCase()} {selectedImage.label}
            </h2>
          </div>

          {/* Image Selector */}
          <div className="mt-8 flex flex-wrap items-start justify-center gap-4">
            {wpcImages.map((item) => {
              const isActive = selectedImage.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  className="group flex flex-col items-center gap-2"
                >
                  <div
                    className={`
                      relative
                      h-[78px]
                      w-[88px]
                      overflow-hidden
                      rounded-xl
                      border-2
                      bg-white
                      p-1.5
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "border-[#FF8626] shadow-md"
                          : "border-[#E5E1EA] hover:border-[#6030C6]"
                      }
                    `}
                  >
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="88px"
                      className="object-contain p-2"
                    />

                    {isActive && (
                      <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF8626] text-[11px] font-bold text-white">
                        ✓
                      </div>
                    )}
                  </div>

                  <span
                    className={`
                      max-w-[100px]
                      text-center
                      text-[11px]
                      font-medium
                      leading-4
                      transition
                      ${
                        isActive
                          ? "font-semibold text-[#6030C6]"
                          : "text-[#555555]"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Specifications */}
          <div className="mt-14 w-full max-w-[1000px]">
            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#6030C6]">
                Product Specifications
              </p>

              <h3 className="mt-2 text-[26px] font-bold text-[#171717] sm:text-[32px]">
                Technical Details
              </h3>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {specifications.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#E8E1F3] bg-[#FBF9FF] p-5 text-center"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7E7190]">
                    {item.label}
                  </p>

                  <p className="mt-2 text-[15px] font-bold text-[#21143A]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Detail Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              {selectedImage.width} Width
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              {selectedImage.length} Length
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              {selectedImage.thickness} Thickness
            </span>

            <span className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
              {selectedImage.coverage} Coverage
            </span>
          </div>

          {/* Technical Profile */}
          <div className="mt-16 w-full max-w-[1100px]">
            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#FF8626]">
                Technical Profile
              </p>

              <h3 className="mt-2 text-[26px] font-bold text-[#171717] sm:text-[32px]">
                WPC Panel Cross Section
              </h3>

              <p className="mx-auto mt-3 max-w-[650px] text-[14px] leading-6 text-[#666666]">
                Profile measurements and cross-sectional dimensions of the{" "}
                {selectedImage.thickness} VersaFlute WPC interior wall panel.
              </p>
            </div>

            <div className="mt-8 rounded-[24px] border border-[#E8E1F3] bg-white p-4 shadow-[0_10px_35px_rgba(40,20,80,0.05)] sm:p-6">
              {/* Only 2 profile image paths used */}
              <div className="relative mx-auto aspect-[3/1] w-full">
                <Image
                  src={selectedImage.profileImage}
                  alt={`${selectedImage.thickness} WPC panel technical cross section`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1100px"
                  className="object-contain"
                />
              </div>

              {is12mm ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <ProfileItem label="Total Width" value="153mm" />
                  <ProfileItem label="Rib Width" value="24mm" />
                  <ProfileItem label="Gap" value="7mm" />
                  <ProfileItem label="Section Gap" value="14mm" />

                  <div className="col-span-2 sm:col-span-1">
                    <ProfileItem label="Thickness" value="12mm" />
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <ProfileItem label="Total Width" value="152mm" />
                  <ProfileItem label="Rib Width" value="25mm" />
                  <ProfileItem label="Thickness" value="15mm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="h-full rounded-xl bg-[#F7F4FC] px-4 py-3 text-center">
      <p className="text-[11px] text-[#857A94]">
        {label}
      </p>

      <p className="mt-1 font-bold text-[#6030C6]">
        {value}
      </p>
    </div>
  );
}