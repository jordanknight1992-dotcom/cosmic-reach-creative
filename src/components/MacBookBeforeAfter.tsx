"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface MacBookBeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  label?: string;
  className?: string;
}

export function MacBookBeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  label,
  className = "",
}: MacBookBeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const afterScrollRef = useRef<HTMLDivElement>(null);
  const beforeScrollRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const rafId = useRef<number>(0);
  const [spacerHeight, setSpacerHeight] = useState(0);

  const onAfterScroll = useCallback(() => {
    const after = afterScrollRef.current;
    const before = beforeScrollRef.current;
    if (after && before) {
      before.scrollTop = after.scrollTop;
    }
  }, []);

  const onAfterImgLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setSpacerHeight(img.offsetHeight);
    },
    [],
  );

  const updatePosition = useCallback((clientX: number) => {
    const after = afterScrollRef.current;
    if (!after) return;
    const rect = after.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(98, Math.max(2, (x / rect.width) * 100));
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => setPosition(pct));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  /* Screen area inside the cropped macbook-frame.png (938x580) */
  const screen = { top: "6%", left: "10.3%", right: "10.4%", bottom: "14%" };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-spark-red" />
          <span className="w-px h-4 bg-copper" />
          <span className="text-xs uppercase tracking-[0.2em] font-display font-semibold text-copper">
            {label}
          </span>
        </div>
      )}

      <div className="relative w-full max-w-4xl mx-auto">
        {/* After layer — scrollable, receives pointer events */}
        <div
          ref={afterScrollRef}
          className="absolute overflow-y-auto overflow-x-hidden macbook-screen z-10"
          style={{ ...screen, borderRadius: "4px" }}
          onScroll={onAfterScroll}
        >
          <Image
            src={afterSrc}
            alt={afterAlt}
            width={1280}
            height={4000}
            className="w-full h-auto block"
            loading="eager"
            sizes="(max-width: 768px) 90vw, 70vw"
            onLoad={onAfterImgLoad}
          />
        </div>

        {/* Before layer — clipped to left side, synced scroll, sits on top of after */}
        <div
          ref={beforeScrollRef}
          className="absolute overflow-y-auto overflow-x-hidden z-20 bg-[#0a0a0f] pointer-events-none [&::-webkit-scrollbar]:hidden"
          style={{
            ...screen,
            borderRadius: "4px",
            clipPath: `inset(0 ${100 - position}% 0 0)`,
            scrollbarWidth: "none",
          }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            width={1280}
            height={4000}
            className="w-full h-auto block"
            loading="eager"
            sizes="(max-width: 768px) 90vw, 70vw"
          />
          {spacerHeight > 0 && (
            <div style={{ height: spacerHeight }} aria-hidden="true" />
          )}
        </div>

        {/* MacBook frame overlay — sits on top, pointer-events-none */}
        <Image
          src="/images/mockups/macbook-frame.png"
          alt=""
          width={938}
          height={580}
          className="relative w-full h-auto select-none z-30 pointer-events-none"
          aria-hidden="true"
          priority={false}
        />

        {/* Divider + drag handle */}
        <div
          className="absolute z-50 cursor-col-resize"
          style={{
            top: screen.top,
            bottom: screen.bottom,
            left: `calc(${screen.left} + (100% - ${screen.left} - ${screen.right}) * ${position / 100})`,
            width: "32px",
            marginLeft: "-16px",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -ml-px bg-copper/80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-copper shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--color-deep-space)"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 3L2 7L4 11" />
              <path d="M10 3L12 7L10 11" />
            </svg>
          </div>
        </div>

        {/* Before / After labels */}
        <span
          className="absolute z-50 text-[10px] uppercase tracking-wide text-deep-space/70 bg-white/70 backdrop-blur-sm rounded px-1.5 py-0.5 font-display font-semibold"
          style={{ top: "8%", left: "11.5%" }}
        >
          Before
        </span>
        <span
          className="absolute z-50 text-[10px] uppercase tracking-wide text-deep-space/70 bg-white/70 backdrop-blur-sm rounded px-1.5 py-0.5 font-display font-semibold"
          style={{ top: "8%", right: "11.5%" }}
        >
          After
        </span>
      </div>
    </div>
  );
}
