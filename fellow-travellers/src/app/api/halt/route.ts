import { z } from "zod";
import { db } from "@/db";
import { haltCheckins } from "@/db/schema";

const schema = z.object({
  sessionId: z.string().min(1),
  ciphertext: z.string().min(1),
  iv: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid" }, { status: 400 });

  try {
    await db.insert(haltCheckins).values({
      sessionId: parsed.data.sessionId,
      ciphertext: parsed.data.ciphertext,
      iv: parsed.data.iv,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, offline: true });
  }
}
