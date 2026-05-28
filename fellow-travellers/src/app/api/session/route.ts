import { db } from "@/db";
import { sessions } from "@/db/schema";
import { nanoid } from "nanoid";

export async function POST() {
  try {
    const [session] = await db
      .insert(sessions)
      .values({ id: nanoid() as unknown as string })
      .returning({ id: sessions.id });

    return Response.json({ sessionId: session.id });
  } catch {
    // Fallback: return a client-only UUID when DB is unavailable
    return Response.json({ sessionId: nanoid(), offline: true });
  }
}
