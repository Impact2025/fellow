// Edge-safe HS256 JWT — alleen Web Crypto API, geen Node.js built-ins

export const SESSION_COOKIE = "haven_session";
const SESSION_DAYS = 30;

export interface SessionPayload {
  userId: string;
}

function b64urlEncode(input: Uint8Array | string): string {
  let binary = "";
  if (typeof input === "string") {
    binary = input;
  } else {
    for (let i = 0; i < input.length; i++) binary += String.fromCharCode(input[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = s + "=".repeat((4 - (s.length % 4)) % 4);
  const raw = atob(padded);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(userId: string): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret-please-set-in-env";
  const now = Math.floor(Date.now() / 1000);
  const header = b64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64urlEncode(
    JSON.stringify({ sub: userId, iat: now, exp: now + SESSION_DAYS * 86400 })
  );
  const message = `${header}.${payload}`;
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return `${message}.${b64urlEncode(new Uint8Array(sig))}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, sig] = parts;
    const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret-please-set-in-env";
    const key = await importKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlDecode(sig).buffer as ArrayBuffer,
      new TextEncoder().encode(`${header}.${payload}`)
    );
    if (!valid) return null;
    const decoded = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return { userId: decoded.sub };
  } catch {
    return null;
  }
}

export function cookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  };
}
