import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
  LOVING_PARENT_SYSTEM_PROMPT,
  guardInput,
} from "@/lib/ai/guardian";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://fellow-travellers.com",
    "X-Title": "Haven — Fellow Travellers",
  },
});

export async function POST(req: Request) {
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
    maxOutputTokens: 500,
  });

  return result.toTextStreamResponse();
}
