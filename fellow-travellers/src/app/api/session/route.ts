import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { findOrCreateSession } from "@/lib/auth/magic";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("haven_session")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = await findOrCreateSession(session.userId);
    return Response.json({ sessionId });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
