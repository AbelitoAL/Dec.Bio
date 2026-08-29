import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const KINDS = {
  photo: {
    allowedTypes: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    } as Record<string, string>,
    maxBytes: 8 * 1024 * 1024, // 8MB
    baseName: "hero-photo",
    label: "la imagen",
  },
  cv: {
    allowedTypes: { "application/pdf": "pdf" } as Record<string, string>,
    maxBytes: 15 * 1024 * 1024, // 15MB
    baseName: "cv",
    label: "el PDF",
  },
} as const;

type Kind = keyof typeof KINDS;

function isKind(value: unknown): value is Kind {
  return value === "photo" || value === "cv";
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return Response.json({ ok: false, error: "No autenticado." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const kindRaw = form?.get("kind");
  const kind: Kind = isKind(kindRaw) ? kindRaw : "photo";
  const spec = KINDS[kind];

  if (!file || !(file instanceof File)) {
    return Response.json({ ok: false, error: "No se recibió ningún archivo." }, { status: 400 });
  }

  const ext = spec.allowedTypes[file.type];
  if (!ext) {
    const formats = Object.values(spec.allowedTypes).join(", ").toUpperCase();
    return Response.json(
      { ok: false, error: `Formato no soportado para ${spec.label}. Usa: ${formats}.` },
      { status: 415 }
    );
  }
  if (file.size > spec.maxBytes) {
    return Response.json(
      { ok: false, error: `${spec.label} pesa más de ${Math.round(spec.maxBytes / (1024 * 1024))}MB.` },
      { status: 413 }
    );
  }

  // Single slot per kind — a new upload replaces the previous one.
  // Clear any stale file left over from a previous upload with a different extension.
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await Promise.all(
      Object.values(spec.allowedTypes).map((otherExt) =>
        fs.unlink(path.join(UPLOAD_DIR, `${spec.baseName}.${otherExt}`)).catch(() => {})
      )
    );
    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${spec.baseName}.${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
    // Cache-bust so the browser picks up a replaced file immediately.
    return Response.json({ ok: true, url: `/uploads/${filename}?v=${Date.now()}` });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return Response.json(
        {
          ok: false,
          error:
            "El sistema de archivos del servidor es de solo lectura (típico en Vercel/producción). " +
            `Sube ${spec.label} desde tu entorno local (npm run dev) y luego haz commit + despliega, o usa el campo de URL con un archivo ya alojado en otro sitio.`,
        },
        { status: 500 }
      );
    }
    return Response.json({ ok: false, error: (err as Error).message ?? "Error desconocido." }, { status: 500 });
  }
}
