"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

function subscribeNoop() {
  return () => {};
}
function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/** Fixed 4-icon quick-action bar shown only on small screens, app-style. */
export function MobileAppBar({ whatsapp, phone }: { whatsapp: string; phone: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const waHref = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`;

  return (
    <nav
      aria-label="Acciones rápidas"
      className="bg-navy border-gold fixed inset-x-0 bottom-0 z-[55] grid grid-cols-4 border-t-2 px-1 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden"
    >
      <a href={telHref} className="text-gold-soft flex flex-col items-center gap-0.5 text-[0.72rem] font-bold no-underline">
        <span aria-hidden className="text-xl leading-none">📞</span>
        Llamar
      </a>
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="text-gold-soft flex flex-col items-center gap-0.5 text-[0.72rem] font-bold no-underline">
        <span aria-hidden className="text-xl leading-none">💬</span>
        WhatsApp
      </a>
      <a href="#contacto" className="text-gold-soft flex flex-col items-center gap-0.5 text-[0.72rem] font-bold no-underline">
        <span aria-hidden className="text-xl leading-none">✉️</span>
        Contacto
      </a>
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="text-gold-soft flex flex-col items-center gap-0.5 border-none bg-transparent text-[0.72rem] font-bold"
      >
        <span aria-hidden className="text-xl leading-none">{isDark ? "☀️" : "🌙"}</span>
        Tema
      </button>
    </nav>
  );
}
