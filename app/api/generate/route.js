import { NextResponse } from "next/server";
import { generateAdsPayload } from "@/lib/ai";

export const runtime = "nodejs";

/** Limite de execução em hosts serverless (ex.: Vercel). O plano gratuito pode impor um teto menor. */
export const maxDuration = 60;

const REQUIRED = [
  "productName",
  "valueProposition",
  "audience",
  "offer",
  "tone",
  "language",
];

function validateBody(body) {
  if (!body || typeof body !== "object") return "invalid_body";
  for (const key of REQUIRED) {
    const v = body[key];
    if (typeof v !== "string" || !v.trim()) return key;
  }
  return null;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const invalid = validateBody(body);
  if (invalid) {
    return NextResponse.json(
      { error: "validation", field: invalid === "invalid_body" ? undefined : invalid },
      { status: 400 }
    );
  }

  try {
    const payload = await generateAdsPayload(body);
    return NextResponse.json(payload);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    if (msg === "platforms_invalid") {
      return NextResponse.json({ error: "platforms_invalid" }, { status: 400 });
    }
    return NextResponse.json({ error: "generation_failed", message: msg }, { status: 500 });
  }
}
