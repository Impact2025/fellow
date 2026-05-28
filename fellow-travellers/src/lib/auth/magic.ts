import { db } from "@/db";
import { magicTokens, users, sessions } from "@/db/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";

const TTL_MINUTES = 15;

async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.toLowerCase().trim());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createMagicToken(email: string): Promise<string> {
  const token = nanoid(32);
  await db.insert(magicTokens).values({
    token,
    email: email.toLowerCase().trim(),
    expiresAt: new Date(Date.now() + TTL_MINUTES * 60 * 1000),
  });
  return token;
}

export async function consumeMagicToken(token: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(magicTokens)
    .where(
      and(
        eq(magicTokens.token, token),
        gt(magicTokens.expiresAt, new Date()),
        isNull(magicTokens.usedAt)
      )
    )
    .limit(1);

  if (!row) return null;

  await db
    .update(magicTokens)
    .set({ usedAt: new Date() })
    .where(eq(magicTokens.id, row.id));

  return row.email;
}

export async function findOrCreateUser(email: string): Promise<string> {
  const emailHash = await hashEmail(email);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.emailHash, emailHash))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, existing.id));
    return existing.id;
  }

  const [created] = await db
    .insert(users)
    .values({ emailHash })
    .returning({ id: users.id });

  return created.id;
}

export async function findOrCreateSession(userId: string): Promise<string> {
  const [existing] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(sessions)
      .set({ lastActive: new Date() })
      .where(eq(sessions.id, existing.id));
    return existing.id;
  }

  const [created] = await db
    .insert(sessions)
    .values({ userId })
    .returning({ id: sessions.id });

  return created.id;
}
