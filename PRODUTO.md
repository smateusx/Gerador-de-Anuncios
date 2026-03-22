# Definição do produto — Passo 1

Documento vivo: descreve **o quê** vamos construir no MVP antes de decidir **como** (stack e código).

---

## 1. Problema e proposta de valor

**Problema:** quem anuncia no Meta e no Google perde tempo a redigir várias variações de texto (títulos, descrições, CTAs) e a adaptar o tom a cada plataforma.

**Proposta:** uma ferramenta que, a partir de informações sobre o negócio e a oferta, **gera conjuntos de textos de anúncio** prontos para rever e usar — otimizados para as regras típicas de **Meta Ads** e **Google Ads** (comprimentos e formatos).

---

## 2. O que o utilizador gera (escopo do MVP)

| Entrega | Incluído no MVP? |
|--------|-------------------|
| Textos para **Meta** (ex.: texto principal, título, descrição, CTA — conforme formatos escolhidos) | Sim |
| Textos para **Google** (ex.: headlines e descrições para anúncios de pesquisa responsivos) | Sim |
| Várias **variações** (A/B) do mesmo anúncio | Sim |
| Sugestões de **palavras-chave** ou ângulos de mensagem (apoio à pesquisa no Google) | Sim, como sugestão textual |
| **Imagens ou vídeo** gerados ou editados | Não (fase posterior) |
| **Publicação automática** nas contas Meta/Google | Não (fase posterior; exige APIs, OAuth e revisões) |

---

## 3. Formato de saída

- **Principal:** texto estruturado na aplicação (secções claras: Meta vs Google, blocos copiáveis).
- **Exportação simples:** copiar para a área de transferência; no MVP pode bastar **copiar blocos** ou exportar **CSV/JSON** simples (decidir na implementação).
- **Revisão humana:** o fluxo assume que o utilizador **revê e edita** antes de usar nos gestores de anúncios.

---

## 4. Entradas mínimas do utilizador (para gerar)

Para o MVP, o formulário deve permitir pelo menos:

- **Nome do produto/serviço** e **proposta de valor** (o quê resolve).
- **Público-alvo** (quem é o cliente ideal).
- **Oferta** (preço, promoção, prova social — o que for relevante).
- **Tom de voz** (ex.: formal, direto, inspirador).
- **Idioma** dos anúncios.
- **Plataforma alvo:** Meta, Google ou **ambas** (gera dois blocos de sugestões).

Campos extra (landing URL, localização) podem entrar depois que o fluxo base estiver estável.

---

## 5. Definição fechada do MVP (uma frase)

> **MVP:** o utilizador preenche um formulário sobre negócio e oferta; a aplicação usa IA para devolver **vários conjuntos de textos** adequados a **Meta Ads** e **Google Ads**, organizados para cópia e revisão manual — **sem** ligação às APIs de anúncios.

---

## 6. Fora de escopo no MVP

- Contas de utilizador, base de dados e histórico (podem vir na “fase B”).
- Integração com Meta Marketing API ou Google Ads API.
- Geração de criativos (imagem/vídeo).
- Pagamentos e planos pagos.

---

## 7. Critérios de sucesso do MVP

- Conseguir gerar, numa sessão, textos **úteis e diferentes** entre si (variações).
- Textos **respeitando limites** habituais de caracteres por campo (configuráveis ou documentados na UI).
- Experiência clara: entrada → resultado → copiar/exportar.
- Mensagem visível de que o conteúdo deve cumprir **políticas de anúncios** da Meta e do Google (responsabilidade do anunciante).

---

## 8. Passo 2 (arquitetura)

Concluído: ver **[TECH.md](TECH.md)** — stack Next.js, OpenAI, `POST /api/generate`, variáveis de ambiente.

## 9. Passo 3 (interface)

Concluído: página inicial com formulário (`components/AdGeneratorClient.js`), `POST /api/generate`, listagem de variações Meta/Google, botões copiar e avisos de políticas.

## 10. Passo 4 (exportação e limites)

Concluído na UI: **exportar JSON/CSV** dos resultados e **contagem de caracteres** vs limites orientadores (`lib/exportResult.js`, `result.limits`).

## 11. Próximo passo (evolução)

Fase B (contas e histórico), testes automatizados, deploy (ex.: Vercel), ou refinamentos de UX.
