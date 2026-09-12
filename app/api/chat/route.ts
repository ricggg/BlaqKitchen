import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat-context";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_CHAT_MODEL || "claude-sonnet-4-6";

type IncomingMsg = { role: "user" | "assistant"; text: string };

const FALLBACK_REPLY =
  "Thanks for the message — the live assistant isn't connected yet on this deployment. Head to /schedule to book a class, /kitchen to order food, or /membership for pricing, and the team will help with anything else.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages: IncomingMsg[] | undefined = body?.messages;

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  if (!ANTHROPIC_API_KEY) {
    // No key configured yet — respond gracefully instead of erroring so
    // the widget always feels alive. Set ANTHROPIC_API_KEY to go live.
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: buildSystemPrompt(),
        messages: messages.map((m) => ({ role: m.role, content: m.text })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Anthropic API error:", data);
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const reply = data.content
      ?.map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: reply || FALLBACK_REPLY });
  } catch (err) {
    console.error("Chat backend error:", err);
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }
}
