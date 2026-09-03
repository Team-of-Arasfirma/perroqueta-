"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProjectsSection() {
  const scrollRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/projects?published=true&limit=4`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load projects."
          );
        }

        if (!cancelled) {
          const projectData = Array.isArray(data)
            ? data
            : data.projects || [];

          setProjects(projectData.slice(0, 4));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError.message ||
              "Unable to load projects."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollCards = (direction) => {
    if (!scrollRef.current) return;

    const cardWidth = 340;
    const gap = 24;

    scrollRef.current.scrollBy({
      left:
        direction === "next"
          ? cardWidth + gap
          : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        {/* Header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#6030C6]">
              Our Projects
            </p>

            <h2 className="mt-3 max-w-[760px] text-[32px] font-bold leading-[1.12] text-[#111111] sm:text-[40px] lg:text-[44px]">
              Building Futures. One Project at a Time.
            </h2>
          </div>

          <Link
            href="/project"
            className="hidden shrink-0 items-center gap-3 rounded-xl border border-[#6030C6] px-5 py-3 text-[14px] font-semibold text-[#6030C6] transition hover:bg-[#6030C6] hover:text-white sm:inline-flex"
          >
            View All Projects
            <ArrowIcon />
          </Link>
        </div>

        {/* Project Cards */}
        <div
          ref={scrollRef}
          className={`mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            projects.length === 1
              ? "justify-start"
              : ""
          }`}
        >
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square w-[82vw] max-w-[340px] shrink-0 animate-pulse rounded-[20px] bg-[#F5F2F9] sm:w-[320px] lg:w-[330px]"
              />
            ))
          ) : error ? (
            <div className="w-full rounded-[18px] border border-red-200 bg-red-50 px-5 py-10 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="w-full rounded-[18px] border border-dashed border-[#D7C8F3] bg-[#FBF9FE] px-5 py-10 text-center text-sm text-[#777]">
              No projects available yet.
            </div>
          ) : (
            projects.map((project) => {
              const imageUrl =
                project.image?.url || "";

              return (
                <article
                  key={project._id}
                  className="group relative aspect-square w-[82vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[20px] border border-[#E8E1F3] bg-[#F5F2F9] shadow-[0_10px_30px_rgba(49,29,91,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(49,29,91,0.13)] sm:w-[320px] lg:w-[330px]"
                >
                  {/* Project Image */}
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={
                        project.title ||
                        "Perroqueta project"
                      }
                      fill
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 320px, 330px"
                      loading="lazy"
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F6F3FA]">
                      <p className="text-[13px] text-[#999]">
                        No image available
                      </p>
                    </div>
                  )}

                  {/* Bottom Gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {/* Status */}
                  {project.status && (
                    <span
                      className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[10px] font-semibold shadow-sm ${
                        project.status ===
                        "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : project.status ===
                            "Ongoing"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  )}

                  {/* Details */}
                  <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 pt-24">
                    <h3 className="line-clamp-2 text-[17px] font-semibold leading-6 text-white sm:text-[18px]">
                      {project.title ||
                        "Project"}
                    </h3>

                    {project.location && (
                      <div className="mt-2 flex items-center gap-2 text-white/85">
                        <LocationIcon />

                        <span className="line-clamp-1 text-[12px] font-medium sm:text-[13px]">
                          {project.location}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Navigation Controls */}
        {projects.length > 1 && !loading && !error && (
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              aria-label="Previous projects"
              onClick={() =>
                scrollCards("prev")
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9CBF5] bg-white text-[#6030C6] shadow-sm transition hover:border-[#6030C6] hover:bg-[#F7F3FF]"
            >
              <span
                aria-hidden="true"
                className="text-[18px]"
              >
                &#8592;
              </span>
            </button>

            <button
              type="button"
              aria-label="Next projects"
              onClick={() =>
                scrollCards("next")
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9CBF5] bg-white text-[#6030C6] shadow-sm transition hover:border-[#6030C6] hover:bg-[#F7F3FF]"
            >
              <span
                aria-hidden="true"
                className="text-[18px]"
              >
                &#8594;
              </span>
            </button>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-7 sm:hidden">
          <Link
            href="/project"
            className="inline-flex items-center gap-3 rounded-xl border border-[#6030C6] px-5 py-3 text-[14px] font-semibold text-[#6030C6]"
          >
            View All Projects
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-[#FF9A45]"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}