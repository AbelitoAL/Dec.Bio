import { promises as fs } from "node:fs";
import path from "node:path";

export type Stat = { value: string; label: string };
export type TrayectoriaItem = { year: string; title: string; place: string; tag: string };
export type ServicioItem = { icon: string; title: string; description: string; bullets: string[] };
export type FaqItem = { question: string; answer: string };
export type SocialLink = { label: string; url: string };

export type SiteContent = {
  /** Browser tab title + SEO description. Independent from `brand` on purpose —
   *  the tab/search-result text doesn't have to match what's printed on the page. */
  meta: {
    title: string;
    description: string;
  };
  brand: {
    initials: string;
    name: string;
    role: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    tagline: string;
    stats: Stat[];
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
    photoNote: string;
    /** Local "/uploads/…" path or an external image URL. Empty = show the placeholder monogram. */
    photoUrl: string;
    /** Local "/uploads/…" path or an external PDF URL. Empty = hide the "download CV" button. */
    cvUrl: string;
  };
  perfil: {
    lede: string;
    paragraphs: string[];
    badges: string[];
  };
  trayectoria: TrayectoriaItem[];
  servicios: ServicioItem[];
  faq: FaqItem[];
  contacto: {
    whatsapp: string;
    email: string;
    location: string;
    ctaLabel: string;
    social: SocialLink[];
  };
  footer: {
    note: string;
  };
};

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");

/** Minimal shape check — enough to stop obviously broken payloads from being written. */
export function isValidSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.meta === "object" &&
    typeof v.brand === "object" &&
    typeof v.hero === "object" &&
    typeof v.perfil === "object" &&
    Array.isArray(v.trayectoria) &&
    Array.isArray(v.servicios) &&
    Array.isArray(v.faq) &&
    typeof v.contacto === "object" &&
    typeof v.footer === "object"
  );
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (isValidSiteContent(parsed)) return parsed;
  } catch {
    // fall through to whatever is on disk being unreadable/corrupt
  }
  throw new Error(
    `No se pudo leer content/site-content.json. Verifica que el archivo exista y sea JSON válido.`
  );
}

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "read-only" | "invalid" | "unknown"; message: string };

export async function saveSiteContent(content: unknown): Promise<SaveResult> {
  if (!isValidSiteContent(content)) {
    return {
      ok: false,
      reason: "invalid",
      message: "El contenido enviado no tiene la forma esperada.",
    };
  }
  try {
    await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2) + "\n", "utf8");
    return { ok: true };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return {
        ok: false,
        reason: "read-only",
        message:
          "El sistema de archivos del servidor es de solo lectura (típico en Vercel/producción serverless). " +
          "Usa \"Exportar JSON\", reemplaza content/site-content.json en tu proyecto local y vuelve a desplegar. " +
          "Para guardar en vivo desde /admin en producción, conecta una base de datos (Vercel KV, Postgres, etc.).",
      };
    }
    return { ok: false, reason: "unknown", message: (err as Error).message ?? "Error desconocido." };
  }
}
