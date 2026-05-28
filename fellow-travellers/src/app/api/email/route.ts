import { z } from "zod";
import { sendBackupKeyEmail, sendCrisisResourcesEmail } from "@/lib/email/resend";

const schema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("backup-key"),
    to: z.string().email(),
    encryptedKey: z.string().min(10),
  }),
  z.object({
    type: z.literal("crisis-resources"),
    to: z.string().email(),
  }),
]);

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = parsed.data;

  if (data.type === "backup-key") {
    const result = await sendBackupKeyEmail(data.to, data.encryptedKey);
    return Response.json(result, { status: result.ok ? 200 : 500 });
  }

  if (data.type === "crisis-resources") {
    const result = await sendCrisisResourcesEmail(data.to);
    return Response.json(result, { status: result.ok ? 200 : 500 });
  }
}
