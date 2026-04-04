"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Testimonial {
  quote: string;
  attribution: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  interval?: number;
}

export function TestimonialCarousel({
  testimonials,
  interval = 10000,
}: TestimonialCarouselProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, interval);
  }, [testimonials.length, interval]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = useCallback(
    (index: number) => {
      setActive(index);
      resetTimer();
    },
    [resetTimer],
  );

  return (
    <div className="relative flex flex-col items-center">
      {/* Quotes container — grid stack so all quotes occupy same cell */}
      <div className="grid w-full">
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            className={`col-start-1 row-start-1 flex flex-col justify-center py-12 sm:py-16 transition-all duration-500 ease-[var(--ease-out)] ${
              i === active
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
            aria-hidden={i !== active}
          >
            <p className="text-starlight/80 text-base sm:text-lg italic leading-relaxed mb-4">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="text-sm text-copper font-display font-semibold">
              {t.attribution}
            </footer>
          </blockquote>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-2" role="tablist">
        {testimonials.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Testimonial ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === active
                ? "bg-copper w-7"
                : "w-2.5 hover:opacity-80"
            }`}
            style={i !== active ? { backgroundColor: "#9B9285" } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
