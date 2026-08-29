import type { CSSProperties } from "react";
import type { SiteContent } from "@/lib/content";
import { Particles } from "@/components/particles";
import { AnimatedStat } from "@/components/animated-stat";

export function Hero({ hero, initials }: { hero: SiteContent["hero"]; initials: string }) {
  return (
    <section className="hero-gradient text-ivory relative overflow-hidden px-4 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24">
      <Particles />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-[minmax(300px,430px)_1fr] md:gap-16">
        <div className="order-2 md:order-1">
          <span className="text-gold-soft mb-4 inline-flex items-center gap-2.5 text-[0.92rem] font-semibold tracking-[3px] uppercase">
            <span className="bg-gold-bright h-[1.5px] w-11" aria-hidden />
            {hero.eyebrow}
          </span>
          <h1 className="font-display text-[clamp(2.6rem,1.9rem+3.4vw,4.4rem)] leading-[1.08] font-extrabold text-balance">
            {hero.name}
          </h1>
          <p className="font-display text-gold-bright mt-3 text-2xl font-medium italic">{hero.role}</p>
          <p className="mt-5 max-w-[38ch] text-[1.2rem]" style={{ color: "#E8E4D4" }}>
            {hero.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#contacto"
              className="from-gold to-gold-bright text-navy inline-flex items-center gap-2 rounded-full bg-linear-to-br px-8 py-4 text-[1.1rem] font-bold shadow-[0_10px_30px_rgba(212,175,55,0.45)] transition-transform hover:-translate-y-[3px]"
            >
              {hero.ctaPrimaryLabel}
            </a>
            {hero.cvUrl && (
              <a
                href={hero.cvUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="border-gold text-gold-soft inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-[1.1rem] font-bold transition-transform hover:-translate-y-[3px] hover:bg-white/10"
              >
                {hero.ctaSecondaryLabel}
              </a>
            )}
          </div>

          <div className="border-gold/35 mt-11 grid grid-cols-3 gap-4 border-t pt-7">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <b className="font-display text-gold-bright block text-[clamp(1.8rem,3vw,2.6rem)] leading-none">
                  <AnimatedStat value={stat.value} />
                </b>
                <span className="text-[0.95rem]" style={{ color: "#D6D2C2" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <div className="from-gold-bright to-gold relative aspect-[4/5] w-full max-w-[430px] rounded-[24px] bg-linear-to-br p-2.5 shadow-[0_30px_70px_rgba(0,0,0,0.45),0_0_90px_rgba(212,175,55,0.22)]">
            <span className="border-gold/40 pointer-events-none absolute -inset-3.5 rounded-[30px] border" aria-hidden />
            {hero.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-supplied photo (local upload or arbitrary external URL); no next/image domain config needed
              <img
                src={hero.photoUrl}
                alt={hero.name}
                className="h-full w-full rounded-[16px] object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[16px] p-6 text-center"
                style={{ background: "radial-gradient(circle at 50% 30%, #1B3568, var(--navy) 75%)" }}
              >
                <span
                  className="font-display text-[clamp(4rem,9vw,6.5rem)] font-extrabold tracking-[4px] text-transparent"
                  style={{ WebkitTextStroke: "2px var(--gold-bright)" } as CSSProperties}
                >
                  {initials}
                </span>
                <span className="text-gold-soft border-gold/55 rounded-full border border-dashed px-4 py-2 text-sm tracking-[1.5px] uppercase">
                  {hero.photoNote}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
