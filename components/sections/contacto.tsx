"use client";

import { useMemo, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Contacto({ contacto }: { contacto: SiteContent["contacto"] }) {
  const [toast, setToast] = useState<string | null>(null);
  const qrCells = useMemo(() => buildDecorativeQr(), []);
  const waHref = `https://wa.me/${contacto.whatsapp.replace(/[^\d]/g, "")}`;

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API unavailable (older browser / insecure context) — still confirm visually.
    }
    setToast(`Copiado: ${value}`);
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <section id="contacto" className="px-4 py-16 sm:px-8 sm:py-20">
      <Reveal>
        <SectionHeading eyebrow="Hablemos" title="Contacto" />
      </Reveal>
      <Reveal className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <ContactItem icon="💬" label="WhatsApp" value={contacto.whatsapp} onCopy={copy} />
          <ContactItem icon="✉️" label="Correo" value={contacto.email} onCopy={copy} />
          <ContactItem icon="📍" label="Ubicación" value={contacto.location} />

          <div className="mt-4 flex flex-wrap gap-3">
            {contacto.social
              .filter((s) => s.url)
              .map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="border-gold text-gold-soft hover:bg-gold-bright hover:text-navy flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 text-sm font-bold transition-[transform,background,color] hover:-translate-y-1"
                  style={{ backgroundColor: "var(--navy)" }}
                >
                  {s.label.slice(0, 2)}
                </a>
              ))}
          </div>
        </div>

        <div
          className="rounded-[18px] border p-8 text-center shadow-[0_14px_40px_var(--shadow-color)]"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--line)" }}
        >
          <h3 className="font-display mb-5 text-[1.5rem]" style={{ color: "var(--text)" }}>
            {contacto.ctaLabel}
          </h3>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="from-gold to-gold-bright text-navy mb-7 inline-flex items-center gap-2 rounded-full bg-linear-to-br px-7 py-3.5 font-bold no-underline shadow-[0_10px_30px_rgba(212,175,55,.45)] transition-transform hover:-translate-y-1"
          >
            {contacto.ctaLabel}
          </a>

          <div
            className="mx-auto w-[190px] rounded-[14px] border-[3px] p-3"
            style={{ backgroundColor: "#fff", borderColor: "var(--gold-bright)" }}
          >
            <div className="grid grid-cols-9 grid-rows-9 gap-[2px]">
              {qrCells.map((on, i) => (
                <i key={i} className={on ? "bg-navy" : "bg-transparent"} />
              ))}
            </div>
          </div>
          <p className="mt-3 text-[0.78rem]" style={{ color: "var(--text-soft)" }}>
            Marcador de posición de código QR — sustitúyelo por uno real al publicar.
          </p>
        </div>
      </Reveal>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded px-4 py-2.5 text-sm shadow-lg"
          style={{ backgroundColor: "var(--navy)", color: "var(--ivory)" }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  onCopy,
}: {
  icon: string;
  label: string;
  value: string;
  onCopy?: (value: string) => void;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <span
        className="border-gold text-gold-bright flex h-14 w-14 flex-none items-center justify-center rounded-2xl border text-2xl"
        style={{ backgroundColor: "var(--navy)" }}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <b className="text-gold-bright block text-[1.02rem] tracking-[1.2px] uppercase">{label}</b>
        <div className="mt-0.5 flex flex-wrap items-center gap-3">
          <span className="text-[1.12rem] font-semibold break-words" style={{ color: "var(--text)" }}>
            {value}
          </span>
          {onCopy && (
            <button
              type="button"
              onClick={() => onCopy(value)}
              className="border-line text-text-soft hover:border-gold-bright hover:text-gold-bright rounded-sm border px-2.5 py-1 text-[0.7rem] tracking-wide"
            >
              Copiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function buildDecorativeQr(): boolean[] {
  let seed = 17;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const cells: boolean[] = [];
  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    const corner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
    cells.push(corner ? true : rnd() > 0.56);
  }
  return cells;
}
