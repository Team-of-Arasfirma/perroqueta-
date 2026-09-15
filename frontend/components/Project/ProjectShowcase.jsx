"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PROJECTS_PER_PAGE = 12;

const resolveImageSrc = (image) => {
  if (!image) return "";

  // New API image object
  if (typeof image === "object" && image.url) {
    return image.url;
  }

  // Old string image
  if (typeof image === "string") {
    if (/^(https?:|data:|blob:|\/)/.test(image)) {
      return image;
    }

    return `/${image}`;
  }

  return "";
};

function ProjectList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/projects?published=true`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load projects"
          );
        }

        const projectData = Array.isArray(data)
          ? data
          : data.projects || [];

        setProjects(projectData);
        setCurrentPage(1);
      } catch (loadError) {
        setError(
          loadError.message || "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const totalPages = Math.ceil(
    projects.length / PROJECTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * PROJECTS_PER_PAGE;

  const currentProjects = projects.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 420,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-[62px]">
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6030C6]/20 border-t-[#6030C6]" />
          </div>
        ) : error ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[14px] text-red-600">
              {error}
            </p>
          </div>
        ) : currentProjects.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[14px] text-[#777777]">
              No projects available.
            </p>
          </div>
        ) : (
          <>
            {/* Project Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {currentProjects.map((project) => {
                const imageSrc = resolveImageSrc(
                  project.image
                );

                return (
                  <article
                    key={project._id}
                    className="group overflow-hidden rounded-[14px] border border-[#E8E8E8] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.09)]"
                  >
                    {/* 1200 x 1200 Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#F7F7F7]">
                      {project.status && (
                        <span
                          className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-semibold shadow-sm ${
                            project.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : project.status === "Ongoing"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {project.status}
                        </span>
                      )}
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={
                            project.title ||
                            "Project image"
                          }
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                          quality={85}
                          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <p className="text-[12px] text-[#999999]">
                            No image
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="px-4 py-4 sm:px-5 sm:py-5">
                      <h3 className="line-clamp-2 break-words text-[14px] font-semibold leading-5 text-[#222222] sm:text-[16px]">
                        {project.title || "Project"}
                      </h3>

                      {project.location && (
                        <div className="mt-2 flex items-center gap-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 shrink-0 text-[#FF8626]"
                            aria-hidden="true"
                          >
                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle
                              cx="12"
                              cy="10"
                              r="2.5"
                            />
                          </svg>

                          <p className="line-clamp-1 text-[12px] text-[#777777] sm:text-[13px]">
                            {project.location}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#DDD7E8] bg-white px-4 py-2 text-[13px] font-semibold text-[#6030C6] transition hover:bg-[#F7F3FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => {
                    const pageNumber =
                      index + 1;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            pageNumber
                          )
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-[13px] font-semibold transition ${
                          currentPage ===
                          pageNumber
                            ? "bg-[#6030C6] text-white"
                            : "border border-[#DDD7E8] bg-white text-[#6030C6] hover:bg-[#F7F3FF]"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="rounded-lg border border-[#DDD7E8] bg-white px-4 py-2 text-[13px] font-semibold text-[#6030C6] transition hover:bg-[#F7F3FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProjectList;
