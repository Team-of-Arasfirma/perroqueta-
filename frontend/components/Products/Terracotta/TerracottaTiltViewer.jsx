"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function TerracottaTiltViewer({ image, alt }) {
  const [rotation, setRotation] = useState(0);

  const dragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  const handleStart = (x) => {
    dragging.current = true;
    startX.current = x;
    startRotation.current = rotation;
  };

  const handleMove = (x) => {
    if (!dragging.current) return;

    const distance = x - startX.current;

    const nextRotation = Math.max(
      -28,
      Math.min(28, startRotation.current + distance * 0.18)
    );

    setRotation(nextRotation);
  };

  const handleEnd = () => {
    dragging.current = false;
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="relative h-[320px] w-full max-w-[820px] cursor-ew-resize select-none sm:h-[370px] lg:h-[420px]"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <div
          className="relative h-full w-full transition-transform duration-150 ease-out"
          style={{
            transform: `perspective(1000px) rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={image}
            alt={alt}
            fill
            priority
            loading="eager"
            draggable={false}
            sizes="(max-width: 768px) 95vw, 820px"
            className="pointer-events-none object-contain"
          />
        </div>
      </div>
    </div>
  );
}