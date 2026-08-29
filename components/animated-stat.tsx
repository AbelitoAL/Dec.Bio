"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders a stat value, counting up once it scrolls into view if the value
 * starts with a number (e.g. "20+", "150"). Falls back to showing the raw
 * text as-is for placeholders like "[XX]" that don't parse as a number.
 */
export function AnimatedStat({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  const ref = useRef<HTMLSpanElement>(null);
  // null = show the resting target value (nothing to animate yet, or animation is skipped).
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (target === null) return;
    const targetValue = target;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1600;
        function tick(now: number) {
          const k = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          setCount(Math.round(targetValue * eased));
          if (k < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  if (target === null) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {count === null ? target : count}
      {suffix}
    </span>
  );
}
