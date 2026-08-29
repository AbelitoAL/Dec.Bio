import { cookies } from "next/headers";
import { SESSION_COOKIE, isAdminConfigured, verifySessionToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return Response.json({
    authed: verifySessionToken(token),
    configured: isAdminConfigured(),
  });
}
