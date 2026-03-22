import { LIMITS } from "./limits.js";

/** Resposta de exemplo quando não há OPENAI_API_KEY (desenvolvimento). */
export function getMockResponse(platforms) {
  const includeMeta = platforms.includes("meta");
  const includeGoogle = platforms.includes("google");

  const meta = includeMeta
    ? {
        variations: [
          {
            id: "a",
            label: "Variação A",
            primaryText: `[Exemplo] Texto principal até ${LIMITS.meta.primaryText} caracteres. Substitua pela cópia gerada com a sua chave OpenAI.`,
            headline: "Título curto para o anúncio",
            description: "Linha de apoio ou descrição.",
            cta: "Saiba mais",
          },
        ],
      }
    : undefined;

  const google = includeGoogle
    ? {
        variations: [
          {
            id: "a",
            label: "Variação A",
            headlines: [
              "Headline 30 chars max",
              "Segunda headline RSA",
              "Terceira opção título",
            ],
            descriptions: [
              "Descrição até noventa caracteres para o anúncio de pesquisa responsivo do Google Ads.",
              "Segunda descrição com call to action e benefício.",
            ],
            keywordIdeas: ["exemplo palavra-chave", "compra online", "marca exemplo"],
          },
        ],
      }
    : undefined;

  return {
    mock: true,
    disclaimer:
      "Conteúdo de exemplo (sem OPENAI_API_KEY). Configure .env.local para gerar textos reais. Revise sempre antes de publicar e cumpra as políticas da Meta e do Google.",
    limits: LIMITS,
    meta,
    google,
  };
}
