import { NextResponse } from "next/server";
import { consumeMagicToken, findOrCreateUser, findOrCreateSession } from "@/lib/auth/magic";
import { createSessionToken, SESSION_COOKIE, cookieOptions } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url));
  }

  const email = await consumeMagicToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/login?error=expired", req.url));
  }

  const userId = await findOrCreateUser(email);
  await findOrCreateSession(userId);

  const jwt = await createSessionToken(userId);
  const secure = process.env.NODE_ENV === "production";

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set(SESSION_COOKIE, jwt, cookieOptions(secure));
  return response;
}
