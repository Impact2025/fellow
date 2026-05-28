import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { cookies } from "next/headers";
import {
  LOVING_PARENT_SYSTEM_PROMPT,
  guardInput,
} from "@/lib/ai/guardian";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://fellow-travellers.com",
    "X-Title": "Haven — Fellow Travellers",
  },
});

export async function POST(req: Request) {
  // Rate limiting — identificeer via sessie, dan IP als fallback
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitKey = session?.userId ?? ip;

  const { allowed, retryAfterMs } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return Response.json(
      { type: "rate_limited", retryAfterMs },
      { status: 429 }
    );
  }

  const { messages } = await req.json();

  const lastUserMsg: string =
    messages.findLast((m: { role: string }) => m.role === "user")?.content ?? "";

  const guard = guardInput(lastUserMsg);
  if (guard?.type === "crisis") {
    return Response.json({ type: "crisis" }, { status: 200 });
  }

  const result = streamText({
    model: openrouter("anthropic/claude-sonnet-4"),
    system: LOVING_PARENT_SYSTEM_PROMPT,
    messages,
    maxOutputTokens: 800,
  });

  return result.toTextStreamResponse();
}
