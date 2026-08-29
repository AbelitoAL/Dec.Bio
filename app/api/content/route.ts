import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/content";

export async function GET() {
  try {
    const content = await getSiteContent();
    return Response.json({ ok: true, content });
  } catch (err) {
    return Response.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return Response.json({ ok: false, error: "No autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const result = await saveSiteContent(body);
  if (!result.ok) {
    const status = result.reason === "invalid" ? 422 : 500;
    return Response.json({ ok: false, error: result.message, reason: result.reason }, { status });
  }

  return Response.json({ ok: true });
}
