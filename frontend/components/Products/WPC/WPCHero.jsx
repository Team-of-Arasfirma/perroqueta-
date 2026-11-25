"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { byDisplayOrder, productText } from "../productPresentation";
import WPCTiltViewer from "./WPCTiltViewer";

export default function WPCHero({ product }) {
  const wpcImages = byDisplayOrder(product.options);
  const [selectedId, setSelectedId] = useState(product.hero.defaultOptionId);
  const selectedImage = wpcImages.find((option) => option.id === selectedId) ?? wpcImages[0];
  const profile = product.profiles.find((item) => item.id === selectedImage.profileId);
  const { selectedSpecifications, technicalProfile } = product;
  const thickness = selectedImage.thickness || profile.thickness;
  const specificationValues = [profile.dimensions, thickness, profile.coverage, profile.application];
  const badgeValues = [profile.width, profile.length, thickness, profile.coverage];
  const is12mm = profile.profileType === "12mm";

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
            {product.breadcrumbLabel}
          </span>
        </div>

        {/* Title */}
        <div className="relative mt-6 text-center">
          <h1 className="pointer-events-none font-serif text-[42px] font-normal leading-none text-[#C4C0C0] sm:text-[58px] lg:text-[72px]">
            {product.detailHeading}
          </h1>
        </div>

        {/* Product Viewer */}
        <div className="mt-4 flex flex-col items-center">
          <div className="w-full max-w-[820px]">
            <WPCTiltViewer
              image={selectedImage.image.url}
              alt={selectedImage.image.alt || productText(product.hero.alt, { thickness, label: selectedImage.label }) || product.name}
            />
          </div>

          {/* Selected Variant Name */}
          <div className="mt-4 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#FF8626]">
              {product.series}
            </p>

            <h2 className="mt-2 text-[24px] font-bold text-[#171717] sm:text-[30px]">
              {thickness?.toUpperCase()} {selectedImage.label}
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
                  onClick={() => setSelectedId(item.id)}
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
                      src={(item.thumbnail ?? item.image).url}
                      alt={item.thumbnail?.alt || item.label}
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
                {selectedSpecifications?.eyebrow}
              </p>

              <h3 className="mt-2 text-[26px] font-bold text-[#171717] sm:text-[32px]">
                {selectedSpecifications?.heading}
              </h3>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {selectedSpecifications?.labels.map((label, index) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#E8E1F3] bg-[#FBF9FF] p-5 text-center"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7E7190]">
                    {label}
                  </p>

                  <p className="mt-2 text-[15px] font-bold text-[#21143A]">
                    {specificationValues[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Detail Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            {selectedSpecifications?.badgeLabels.map((label, index) => (
              <span key={label} className="rounded-full border border-[#E3D9F3] bg-[#F7F4FC] px-5 py-2 text-[13px] font-semibold text-[#6030C6]">
                {badgeValues[index]} {label}
              </span>
            ))}
          </div>

          {/* Technical Profile */}
          <div className="mt-16 w-full max-w-[1100px]">
            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#FF8626]">
                {technicalProfile?.eyebrow}
              </p>

              <h3 className="mt-2 text-[26px] font-bold text-[#171717] sm:text-[32px]">
                {technicalProfile?.heading}
              </h3>

              <p className="mx-auto mt-3 max-w-[650px] text-[14px] leading-6 text-[#666666]">
                {productText(technicalProfile?.descriptionTemplate, { thickness, series: product.series })}
              </p>
            </div>

            <div className="mt-8 rounded-[24px] border border-[#E8E1F3] bg-white p-4 shadow-[0_10px_35px_rgba(40,20,80,0.05)] sm:p-6">
              {profile.diagram && <div className="relative mx-auto aspect-[3/1] w-full">
                <Image
                  src={profile.diagram.url}
                  alt={profile.diagram.alt || profile.label}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1100px"
                  className="object-contain"
                />
              </div>}

              <div className={is12mm ? "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5" : "mt-6 grid grid-cols-2 gap-3 min-[430px]:grid-cols-3"}>
                {profile.measurements?.map((measurement, index, measurements) => (
                  <div
                    key={measurement.label}
                    className={index === measurements.length - 1
                      ? is12mm ? "col-span-2 sm:col-span-1" : "col-span-2 min-[430px]:col-span-1"
                      : undefined}
                  >
                    <ProfileItem {...measurement} />
                  </div>
                ))}
              </div>
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