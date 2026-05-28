import { z } from "zod";
import { createMagicToken } from "@/lib/auth/magic";
import { sendMagicLinkEmail } from "@/lib/email/resend";

const schema = z.object({
  email: z.string().email().max(254),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  const { email } = parsed.data;

  // Altijd 200 teruggeven — geen e-mail enumeration
  try {
    const token = await createMagicToken(email);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const magicUrl = `${appUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;
    await sendMagicLinkEmail(email, magicUrl);
  } catch (err) {
    console.error("[magic-link] failed:", err);
  }

  return Response.json({ ok: true });
}
