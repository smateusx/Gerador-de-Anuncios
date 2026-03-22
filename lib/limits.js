/**
 * Limites orientadores para prompts (Meta / Google).
 * Valores comuns em 2024–2025; ajustar se as plataformas mudarem regras.
 */
export const LIMITS = {
  meta: {
    primaryText: 125,
    headline: 40,
    description: 30,
    cta: 30,
  },
  google: {
    headline: 30,
    description: 90,
    headlinesCount: { min: 3, max: 15 },
    descriptionsCount: { min: 2, max: 4 },
  },
};
