"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 1000,
    suffix: "+",
    label: "Projects Completed",
  },
  {
    value: 500,
    suffix: "+",
    label: "Happy Clients",
  },
  {
    value: 2,
    suffix: "+",
    label: "Years Experience",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Customer Support",
  },
];

function CountUp({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        const duration = 1800;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const progress = Math.min(
            (currentTime - startTime) / duration,
            1
          );

          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setCount(Math.floor(value * easedProgress));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(value);
          }
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function ProjectStats() {
  return (
    <section className="w-full bg-white pb-16">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-[62px]">
        <div className="overflow-hidden rounded-[12px] bg-gradient-to-r from-[#4930B5] via-[#A43E78] to-[#F15B24] shadow-[0_7px_18px_rgba(0,0,0,0.18)]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-h-[110px] flex-col items-center justify-center px-5 py-5 text-center text-white"
              >
                <p className="text-[28px] font-bold leading-none">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </p>

                <p className="mt-3 text-[15px] font-normal text-white/90">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}