"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Clock3,
  Loader2,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import CareerApplicationModal from "./CareerApplicationModal";
import { fetchCareers } from "@/services/careerService";
import { isCareerAcceptingApplications } from "@/lib/applicationUtils";

export default function OpenPositions() {
  const [careers, setCareers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    fetchCareers({ publicOnly: true, limit: 100 })
      .then((data) => setCareers(data.careers || []))
      .catch((error) => setState({ loading: false, error: error.message }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  const visibleCareers = useMemo(
    () => careers.filter((career) => isCareerAcceptingApplications(career)),
    [careers]
  );

  return (
    <section
      id="open-positions"
      className="relative w-full overflow-hidden bg-[#fbfafc] py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute left-[-120px] top-10 h-[280px] w-[280px] rounded-full bg-[#6030C6]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] right-[-100px] h-[320px] w-[320px] rounded-full bg-[#FF8626]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#F0EAFB] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#6030C6]">
              <Sparkles className="h-4 w-4" />
              Open Positions
            </p>

            <h2 className="mt-4 text-[30px] font-extrabold leading-tight text-[#171717] sm:text-[40px]">
              Find Your Next Opportunity
            </h2>

            <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-[#666]">
              Explore current opportunities and become part of a growing team
              building reliable material and project solutions.
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-[#E8DDF8] bg-white px-5 py-4 shadow-sm">
            <p className="text-[26px] font-extrabold leading-none text-[#6030C6]">
              {visibleCareers.length}
            </p>
            <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#777]">
              Positions Available
            </p>
          </div>
        </div>

        {state.loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#6030C6]" />
          </div>
        ) : state.error ? (
          <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 p-7 text-center text-sm font-medium text-red-600">
            {state.error}
          </div>
        ) : visibleCareers.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-[#D7C7EF] bg-white p-12 text-center">
            <p className="text-[18px] font-bold text-[#171717]">
              No open positions right now
            </p>
            <p className="mt-2 text-sm text-[#777]">
              Please check back soon for upcoming opportunities.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            {visibleCareers.map((job, index) => {
              const canApply = isCareerAcceptingApplications(job);

              return (
                <article
                  key={job._id}
                  style={{
                    animationDelay: `${index * 120}ms`,
                  }}
                  className="job-card group relative overflow-hidden rounded-[28px] border border-[#E8E0F4] bg-white p-[1px] shadow-[0_18px_45px_rgba(40,24,80,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(96,48,198,0.18)]"
                >
                  <div className="absolute inset-x-0 top-0 h-[5px] bg-[linear-gradient(90deg,#6030C6,#7A45E5,#FF8626)]" />

                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#6030C6]/10 transition-all duration-500 group-hover:scale-125 group-hover:bg-[#FF8626]/10" />

                  <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-tl-[70px] bg-[linear-gradient(135deg,transparent,#F5EEFF)]" />

                  <div className="relative flex min-h-[300px] flex-col justify-between rounded-[27px] bg-white p-6 sm:p-7">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-[680px]">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex rounded-full bg-[#F0EAFB] px-3 py-[7px] text-[11px] font-bold uppercase tracking-[0.06em] text-[#6030C6]">
                            {job.jobType || "Full Time"}
                          </span>

                          <span className="inline-flex rounded-full border border-[#FFE0C2] bg-[#FFF7EF] px-3 py-[7px] text-[11px] font-bold uppercase tracking-[0.06em] text-[#D86B10]">
                            Hiring Now
                          </span>
                        </div>

                        <h3 className="mt-5 text-[24px] font-extrabold leading-tight text-[#171717] transition-colors duration-300 group-hover:text-[#6030C6] sm:text-[28px]">
                          <Link href={`/careers/${job.slug}`}>
                            {job.title}
                          </Link>
                        </h3>

                        <div className="mt-5 grid gap-3 text-[13px] text-[#666] sm:grid-cols-3">
                          <span className="flex items-center gap-2 rounded-xl bg-[#FAF7FF] px-3 py-3">
                            <MapPin className="h-4 w-4 shrink-0 text-[#FF8626]" />
                            <span className="line-clamp-1">
                              {job.location || "Location flexible"}
                            </span>
                          </span>

                          <span className="flex items-center gap-2 rounded-xl bg-[#FAF7FF] px-3 py-3">
                            <Briefcase className="h-4 w-4 shrink-0 text-[#FF8626]" />
                            <span className="line-clamp-1">
                              {job.experience || "Experience flexible"}
                            </span>
                          </span>

                          <span className="flex items-center gap-2 rounded-xl bg-[#FAF7FF] px-3 py-3">
                            <Clock3 className="h-4 w-4 shrink-0 text-[#FF8626]" />
                            <span className="line-clamp-1">
                              {job.workMode || "On-site"}
                            </span>
                          </span>
                        </div>

                        <p className="mt-5 line-clamp-3 max-w-[680px] text-[15px] leading-7 text-[#666]">
                          {job.shortDescription ||
                            job.description ||
                            "Join our growing team and work on meaningful industrial and project solutions."}
                        </p>
                      </div>

                      <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#6030C6,#7A45E5)] text-white shadow-[0_14px_30px_rgba(96,48,198,0.25)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 sm:flex">
                        <Briefcase className="h-7 w-7" />
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 border-t border-[#EFE8FA] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        href={`/careers/${job.slug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8C8F0] bg-white px-5 py-3 text-[13px] font-bold text-[#6030C6] transition-all duration-300 hover:border-[#6030C6] hover:bg-[#F5F0FF]"
                      >
                        View Role
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (canApply) {
                            setSelectedJob(job);
                          }
                        }}
                        disabled={!canApply}
                        className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3 text-[13px] font-bold transition-all duration-300 ${
                          canApply
                            ? "bg-[linear-gradient(135deg,#6030C6_0%,#7A45E5_55%,#FF8626_130%)] text-white shadow-[0_14px_30px_rgba(96,48,198,0.25)] hover:scale-[1.03]"
                            : "cursor-not-allowed border border-[#E5DAF8] bg-[#F5F1FC] text-[#8D83A2]"
                        }`}
                      >
                        <span className="relative z-10">
                          {canApply ? "Apply Now" : "Applications Closed"}
                        </span>

                        {canApply ? (
                          <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        ) : null}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <CareerApplicationModal
        career={selectedJob}
        open={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
      />

      <style jsx>{`
        .job-card {
          animation: careerCardFadeUp 0.7s ease both;
        }

        .job-card::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          transition: transform 0.8s ease;
          z-index: 2;
          pointer-events: none;
        }

        .job-card:hover::before {
          transform: translateX(120%);
        }

        @keyframes careerCardFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}