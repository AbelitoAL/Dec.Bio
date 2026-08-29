import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkPassword,
  createSessionToken,
  isAdminConfigured,
} from "@/lib/auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return Response.json(
      {
        ok: false,
        error:
          "ADMIN_PASSWORD no está configurado en el servidor. Añádelo a .env.local (ver .env.example) y reinicia.",
      },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkPassword(password)) {
    return Response.json({ ok: false, error: "Contraseña incorrecta." }, { status: 401 });
  }

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return Response.json({ ok: true });
}
