"use client";

import { useEffect, useRef } from "react";

/** Thin gold bar pinned to the very top of the viewport, filling as the visitor scrolls. */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      const pct = scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-[3px]" aria-hidden>
      <div
        ref={barRef}
        className="from-gold to-gold-bright h-full w-0 bg-linear-to-r"
        style={{ transition: "width 120ms linear" }}
      />
    </div>
  );
}
