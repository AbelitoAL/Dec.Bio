"use client";

import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "#perfil", label: "Perfil" },
  { href: "#trayectoria", label: "Trayectoria" },
  { href: "#servicios", label: "Servicios" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export function SiteHeader({ initials, name, role }: { initials: string; name: string; role: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="border-gold/35 sticky top-0 z-50 border-b backdrop-blur-lg"
      style={{ backgroundColor: "rgba(10,27,61,.92)" }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
        <a href="#" className="text-ivory flex items-center gap-3 no-underline">
          <span
            className="border-gold-bright font-display text-gold-bright flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full border-2 text-[1.35rem] font-extrabold"
            style={{ background: "radial-gradient(circle at 30% 25%, #16305F, var(--navy))" }}
          >
            {initials}
          </span>
          <span>
            <strong className="font-display block text-[1.12rem] leading-tight tracking-[0.4px]">{name}</strong>
            <span className="text-gold-soft hidden text-[0.82rem] tracking-[1.6px] uppercase sm:block">{role}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group text-ivory relative py-1 text-[1.02rem] font-semibold no-underline"
            >
              {item.label}
              <span className="bg-gold-bright absolute -bottom-1 left-0 h-[2px] w-0 transition-[width] duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="#contacto"
            className="from-gold to-gold-bright text-navy rounded-full bg-linear-to-br px-5 py-2.5 text-sm font-bold no-underline shadow-[0_6px_18px_rgba(212,175,55,0.4)] transition-transform hover:-translate-y-0.5"
          >
            Agendar consulta
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-[46px] w-[46px] flex-none flex-col items-center justify-center gap-1.5 border-none bg-transparent"
          >
            <span
              className={`bg-gold-bright block h-[3px] w-[26px] rounded-sm transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span className={`bg-gold-bright block h-[3px] w-[26px] rounded-sm transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`bg-gold-bright block h-[3px] w-[26px] rounded-sm transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-gold flex flex-col gap-4 border-b-2 px-6 py-6 md:hidden" style={{ backgroundColor: "var(--navy)" }}>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-ivory text-lg font-semibold no-underline"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="from-gold to-gold-bright text-navy inline-block w-fit rounded-full bg-linear-to-br px-5 py-2.5 text-sm font-bold no-underline"
          >
            Agendar consulta
          </a>
        </nav>
      )}
    </header>
  );
}
