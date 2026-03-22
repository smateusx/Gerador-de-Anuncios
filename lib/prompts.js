import { LIMITS } from "./limits.js";

export function buildGenerationPrompt(body, platforms, variationCount) {
  const platformList = platforms.join(" e ");

  const system = `És um copywriter especializado em Meta Ads (Facebook/Instagram) e Google Ads.
Gera APENAS JSON válido, sem markdown, sem texto antes ou depois do JSON.
O utilizador irá rever todo o conteúdo antes de publicar.
Respeita rigorosamente os limites de caracteres indicados por campo.
Idioma de saída: ${body.language}.
Tom: ${body.tone}.`;

  const schemaHint = `
Formato JSON esperado (adapta as chaves consoante as plataformas pedidas):
{
  "disclaimer": "Frase curta a lembrar revisão humana e políticas de anúncios.",
  "meta": { "variations": [ { "id": "string", "label": "string", "primaryText": "max ${LIMITS.meta.primaryText} chars", "headline": "max ${LIMITS.meta.headline}", "description": "max ${LIMITS.meta.description}", "cta": "max ${LIMITS.meta.cta}" } ] },
  "google": { "variations": [ { "id": "string", "label": "string", "headlines": ["max ${LIMITS.google.headline} cada, várias"], "descriptions": ["max ${LIMITS.google.description} cada"], "keywordIdeas": ["sugestões de palavras-chave"] } ] }
}
Inclui apenas os objetos "meta" e/ou "google" conforme as plataformas: ${platformList}.
Gera exatamente ${variationCount} variações por plataforma incluída (cada variação com id único).`;

  const user = `Dados do negócio:
- Produto/serviço: ${body.productName}
- Proposta de valor: ${body.valueProposition}
- Público-alvo: ${body.audience}
- Oferta / provas: ${body.offer}

Plataformas: ${platformList}.
${schemaHint}`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
