import Link from "next/link";
import type { SiteContent } from "@/lib/content";

export function Footer({
  footer,
  name,
  social,
}: {
  footer: SiteContent["footer"];
  name: string;
  social: SiteContent["contacto"]["social"];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="px-4 py-16 text-center sm:px-8" style={{ backgroundColor: "#071228", color: "#B9BFD2" }}>
      <p className="font-display text-2xl text-white">{name}</p>

      <div className="mt-6 mb-2 flex flex-wrap justify-center gap-4">
        {social
          .filter((s) => s.url)
          .map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="border-gold text-gold-soft hover:bg-gold-bright hover:text-navy flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 text-base font-bold transition-[transform,background,color] hover:-translate-y-1"
            >
              {s.label.slice(0, 2)}
            </a>
          ))}
      </div>

      <small className="mt-5 block text-[0.95rem]" style={{ color: "#7C87A6" }}>
        © {year} {name}. {footer.note} ·{" "}
        <Link href="/admin" className="underline decoration-dotted" style={{ color: "#7C87A6" }}>
          Editar contenido
        </Link>
      </small>
    </footer>
  );
}
