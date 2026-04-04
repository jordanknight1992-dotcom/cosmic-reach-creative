"use client";

import Image from "next/image";

interface MacBookFrameProps {
  src: string;
  alt: string;
  label: string;
}

export function MacBookFrame({ src, alt, label }: MacBookFrameProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-spark-red" />
        <span className="w-px h-4 bg-copper" />
        <span className="text-xs uppercase tracking-[0.2em] font-display font-semibold text-copper">{label}</span>
      </div>

      <div className="relative w-full">
        {/* Scrollable content — behind the frame */}
        <div
          className="absolute overflow-y-auto overflow-x-hidden overscroll-contain macbook-screen"
          style={{
            top: "6%",
            left: "10.3%",
            right: "10.4%",
            bottom: "14%",
            borderRadius: "4px",
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={1280}
            height={4000}
            className="w-full h-auto block"
            loading="eager"
            sizes="(max-width: 768px) 70vw, 35vw"
          />
        </div>

        {/* MacBook frame overlay */}
        <Image
          src="/images/mockups/macbook-frame.png"
          alt=""
          width={938}
          height={580}
          className="relative w-full h-auto pointer-events-none select-none z-10"
          aria-hidden="true"
          priority={false}
        />
      </div>
    </div>
  );
}
