import type { SiteContent } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Perfil({ perfil }: { perfil: SiteContent["perfil"] }) {
  return (
    <section id="perfil" className="px-4 py-16 sm:px-8 sm:py-20" style={{ backgroundColor: "var(--bg-section-alt)" }}>
      <Reveal>
        <SectionHeading eyebrow="Quién soy" title="Perfil" />
      </Reveal>
      <Reveal className="mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-[1.05fr_.95fr] md:gap-16">
        <blockquote
          className="font-display relative border-l-4 pl-8 text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.4] font-medium italic text-balance"
          style={{ borderColor: "var(--gold-bright)", color: "var(--text)" }}
        >
          <span className="text-gold absolute -top-8 left-1 text-7xl opacity-55" aria-hidden>
            “
          </span>
          {perfil.lede}
        </blockquote>
        <div>
          <div className="space-y-4" style={{ color: "var(--text-soft)" }}>
            {perfil.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {perfil.badges.map((badge, i) => (
              <span
                key={i}
                className="text-gold-soft border-gold rounded-full border px-4 py-2 text-[0.98rem] font-semibold"
                style={{ backgroundColor: "var(--navy)" }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
