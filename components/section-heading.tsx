export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="sec-head mx-auto mb-12 max-w-[820px] text-center">
      <p className="text-gold-bright font-body text-[0.92rem] font-bold tracking-[3px] uppercase">{eyebrow}</p>
      <h2 className="font-display text-text mt-2 mb-3 text-[clamp(2.1rem,1.6rem+2vw,3.2rem)] leading-[1.12] text-balance">
        {title}
      </h2>
      {description && <p className="text-text-soft text-lg">{description}</p>}
      <span className="gold-rule from-gold to-gold-bright mx-auto mt-4 block h-[3px] rounded-full bg-linear-to-r" />
    </div>
  );
}
