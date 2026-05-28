import { z } from "zod";
import { sendPassphraseReminderEmail, sendCrisisResourcesEmail } from "@/lib/email/resend";

const schema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("passphrase-reminder"),
    to: z.string().email(),
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

  if (data.type === "passphrase-reminder") {
    const result = await sendPassphraseReminderEmail(data.to);
    return Response.json(result, { status: result.ok ? 200 : 500 });
  }

  if (data.type === "crisis-resources") {
    const result = await sendCrisisResourcesEmail(data.to);
    return Response.json(result, { status: result.ok ? 200 : 500 });
  }
}
