import { z } from "zod";
import { db } from "@/db";
import { stepVisits } from "@/db/schema";

const schema = z.object({
  sessionId: z.string().min(1),
  stepNumber: z.number().int().min(1).max(12),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid" }, { status: 400 });

  try {
    await db.insert(stepVisits).values({
      sessionId: parsed.data.sessionId,
      stepNumber: parsed.data.stepNumber,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, offline: true });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) return Response.json({ visits: [] });

  try {
    const visits = await db
      .select({ stepNumber: stepVisits.stepNumber })
      .from(stepVisits)
      .where(
        (await import("drizzle-orm")).eq(stepVisits.sessionId, sessionId)
      );
    const visited = [...new Set(visits.map((v) => v.stepNumber))];
    return Response.json({ visited });
  } catch {
    return Response.json({ visited: [] });
  }
}
