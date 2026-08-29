import type { SiteContent } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Servicios({ items }: { items: SiteContent["servicios"] }) {
  return (
    <section id="servicios" className="px-4 py-16 sm:px-8 sm:py-20" style={{ backgroundColor: "var(--bg-section-alt)" }}>
      <Reveal>
        <SectionHeading eyebrow="Qué hago" title="Áreas de servicio" />
      </Reveal>
      <Reveal className="mx-auto grid max-w-[1400px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-[18px] border p-7 shadow-[0_14px_40px_var(--shadow-color)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_22px_55px_var(--shadow-hover-color)]"
            style={{ backgroundImage: "linear-gradient(165deg, var(--navy-2), var(--navy) 60%)", borderColor: "rgba(201,168,76,.35)" }}
          >
            <span
              className="absolute inset-x-0 top-0 h-1 opacity-55 transition-opacity group-hover:opacity-100"
              style={{ backgroundImage: "linear-gradient(90deg, var(--gold), var(--gold-bright), var(--gold))" }}
              aria-hidden
            />
            <div
              className="mb-5 flex h-[66px] w-[66px] items-center justify-center rounded-2xl border text-3xl"
              style={{ backgroundColor: "rgba(201,168,76,.14)", borderColor: "rgba(201,168,76,.5)", color: "var(--gold-bright)" }}
            >
              <span aria-hidden>{item.icon}</span>
            </div>
            <h3 className="font-display mb-2.5 text-[1.42rem] leading-tight text-white">{item.title}</h3>
            <p className="mb-4 text-[1.05rem]" style={{ color: "#CFD4E4" }}>
              {item.description}
            </p>
            <ul className="list-none space-y-1.5">
              {item.bullets.map((bullet, bi) => (
                <li key={bi} className="relative pl-6 text-[1.02rem] leading-snug" style={{ color: "#E4E1D2" }}>
                  <span className="text-gold-bright absolute top-1 left-0 text-[0.8rem]" aria-hidden>
                    ◆
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
