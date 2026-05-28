import { z } from "zod";
import { db } from "@/db";
import { matchProfiles } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { scoreProfiles } from "@/lib/matching/algorithm";

const postSchema = z.object({
  sessionHash: z.string().min(16),
  alias: z.string().min(1).max(32),
  vector: z.array(z.number().min(0).max(1)).length(13),
  regionCode: z.string().min(2).max(2),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Ongeldig profiel" }, { status: 400 });
  }

  const { sessionHash, alias, vector, regionCode } = parsed.data;

  try {
    await db
      .insert(matchProfiles)
      .values({
        sessionHash,
        alias,
        supportVector: JSON.stringify(vector),
        regionCode,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: matchProfiles.sessionHash,
        set: {
          alias,
          supportVector: JSON.stringify(vector),
          regionCode,
          updatedAt: new Date(),
        },
      });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Opslaan mislukt" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionHash = searchParams.get("sh") ?? "";

  if (!sessionHash || sessionHash.length < 16) {
    return Response.json({ error: "Sessie onbekend" }, { status: 400 });
  }

  try {
    const myProfile = await db
      .select()
      .from(matchProfiles)
      .where(eq(matchProfiles.sessionHash, sessionHash))
      .limit(1);

    if (myProfile.length === 0) {
      return Response.json({ matches: [], pending: true });
    }

    const others = await db
      .select()
      .from(matchProfiles)
      .where(ne(matchProfiles.sessionHash, sessionHash))
      .limit(50);

    const mine = {
      alias: myProfile[0].alias,
      vector: JSON.parse(myProfile[0].supportVector) as number[],
      regionCode: myProfile[0].regionCode,
    };

    const candidates = scoreProfiles(
      mine,
      others.map((o) => ({
        alias: o.alias,
        vector: JSON.parse(o.supportVector) as number[],
        regionCode: o.regionCode,
      }))
    );

    return Response.json({ matches: candidates, pending: false });
  } catch {
    return Response.json({ error: "Ophalen mislukt" }, { status: 500 });
  }
}
