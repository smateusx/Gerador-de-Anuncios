import OpenAI from "openai";
import { LIMITS } from "./limits.js";
import { buildGenerationPrompt } from "./prompts.js";
import { getMockResponse } from "./mock-response.js";

function normalizePlatforms(raw) {
  if (raw === undefined || raw === null) return ["meta", "google"];
  if (raw === "both" || raw === "all") return ["meta", "google"];
  if (Array.isArray(raw)) {
    return [...new Set(raw.filter((p) => p === "meta" || p === "google"))];
  }
  if (raw === "meta") return ["meta"];
  if (raw === "google") return ["google"];
  return ["meta", "google"];
}

function clampVariations(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 3;
  return Math.min(5, Math.max(1, Math.floor(x)));
}

/**
 * Gera o payload de anúncios (JSON) via OpenAI ou mock se não houver chave.
 */
export async function generateAdsPayload(body) {
  const platforms = normalizePlatforms(body.platforms);
  if (platforms.length === 0) {
    throw new Error("platforms_invalid");
  }

  const variationCount = clampVariations(body.variationCount);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const mock = getMockResponse(platforms);
    return mock;
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const messages = buildGenerationPrompt(body, platforms, variationCount);

  const completion = await client.chat.completions.create({
    model,
    messages,
    response_format: { type: "json_object" },
    temperature: 0.85,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("openai_empty");
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("openai_json");
  }

  return {
    mock: false,
    limits: LIMITS,
    disclaimer: parsed.disclaimer,
    meta: parsed.meta,
    google: parsed.google,
  };
}

export { normalizePlatforms, clampVariations };
