"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

// Standard SSR-safe "is this the client, past hydration" flag —
// avoids the hydration mismatch you'd get reading resolvedTheme on the server.
function subscribeNoop() {
  return () => {};
}
function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/** Circular gold-bordered toggle, matching the header's icon-only button style. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className={`border-gold text-gold-soft hover:bg-gold hover:text-navy flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-2 bg-transparent text-xl transition-colors ${className}`}
    >
      <span aria-hidden>{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
