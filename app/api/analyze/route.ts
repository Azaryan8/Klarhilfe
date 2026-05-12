import { NextResponse } from "next/server";
import { languageNameForPrompt, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 120;

type Body = {
  locale: Locale;
  documentText?: string;
  imageBase64?: string;
  mediaType?: string;
};

function buildUserPrompt(selectedLanguage: string, documentText: string) {
  return `You are a legal assistant helping migrants in Germany understand official documents. Explain this document in simple ${selectedLanguage} language. Tell the user: 1) What this document means 2) What action they need to take 3) Provide a ready-made response template in German if needed.

Use clear headings and bullet points where helpful.

Document or question:
${documentText}`;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server misconfiguration: missing ANTHROPIC_API_KEY" }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const locale = body.locale ?? "en";
  const selectedLanguage = languageNameForPrompt(locale);
  const text = (body.documentText ?? "").trim();
  const hasImage = Boolean(body.imageBase64 && body.mediaType);

  if (!text && !hasImage) {
    return NextResponse.json({ error: "No document text or image provided" }, { status: 400 });
  }

  const documentBlock = hasImage
    ? text || "Please analyze the attached scan of a German official document."
    : text;

  const prompt = buildUserPrompt(selectedLanguage, documentBlock);

  const userContent: unknown = hasImage
    ? [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: body.mediaType,
            data: body.imageBase64,
          },
        },
        { type: "text", text: prompt },
      ]
    : prompt;

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: userContent }],
      }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return NextResponse.json({ error: "Failed to reach Anthropic", details: msg }, { status: 502 });
  }

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json(
      { error: "Anthropic API request failed", status: response.status, details: details.slice(0, 800) },
      { status: 502 },
    );
  }

  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };

  const out =
    data.content?.map((c) => (c.type === "text" && c.text ? c.text : "")).join("\n").trim() ?? "";

  if (!out) {
    return NextResponse.json({ error: "Empty model response" }, { status: 502 });
  }

  return NextResponse.json({ text: out });
}
