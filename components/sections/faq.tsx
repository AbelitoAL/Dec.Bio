import type { SiteContent } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Faq({ items }: { items: SiteContent["faq"] }) {
  return (
    <section id="preguntas" className="px-4 py-16 sm:px-8 sm:py-20">
      <Reveal>
        <SectionHeading eyebrow="Dudas frecuentes" title="Preguntas frecuentes" />
      </Reveal>
      <Reveal className="mx-auto max-w-[820px] space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            open={i === 0}
            className="group overflow-hidden rounded-[14px] border shadow-[0_14px_40px_var(--shadow-color)] transition-colors [&[open]]:border-[var(--gold-bright)]"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--line)" }}
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[1.12rem] font-bold [&::-webkit-details-marker]:hidden"
              style={{ color: "var(--text)" }}
            >
              {item.question}
              <span className="font-display text-gold-bright flex-none text-[1.7rem] leading-none transition-transform group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="px-6 pb-6" style={{ color: "var(--text-soft)" }}>
              {item.answer}
            </p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
