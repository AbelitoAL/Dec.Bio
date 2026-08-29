import type { SiteContent } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Trayectoria({ items }: { items: SiteContent["trayectoria"] }) {
  return (
    <section id="trayectoria" className="px-4 py-16 sm:px-8 sm:py-20">
      <Reveal>
        <SectionHeading eyebrow="Trayectoria" title="Formación y trayectoria" />
      </Reveal>
      <Reveal className="relative mx-auto max-w-[980px] pl-10">
        <span
          className="absolute top-1.5 bottom-1.5 left-[10px] w-[2px]"
          style={{ backgroundImage: "linear-gradient(180deg, var(--gold-bright), rgba(201,168,76,.25))" }}
          aria-hidden
        />
        {items.map((item, i) => (
          <div key={i} className="relative pb-9 pl-6 last:pb-0">
            <span
              className="absolute top-2 -left-[2.6rem] h-[18px] w-[18px] rounded-full border-4"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--gold-bright)",
                boxShadow: "0 0 0 5px rgba(212,175,55,.18)",
              }}
              aria-hidden
            />
            <span className="text-gold-bright mb-1 block text-[0.85rem] font-bold tracking-[1.6px] uppercase">
              {item.year}
            </span>
            <h4 className="font-display text-[1.35rem]" style={{ color: "var(--text)" }}>
              {item.title}
            </h4>
            <p className="text-[1.08rem]" style={{ color: "var(--text-soft)" }}>
              {item.place}
              {item.tag && <span className="opacity-70"> · {item.tag}</span>}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
