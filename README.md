# Gerador-de-Anuncios

SaaS para gerar anúncios com IA para Meta Ads e Google Ads.

- **Produto (MVP):** [PRODUTO.md](PRODUTO.md)
- **Arquitetura técnica:** [TECH.md](TECH.md)

## Desenvolvimento local

```bash
npm install
```

Copie `.env.example` para `.env.local`, edite e defina `OPENAI_API_KEY` (opcional: sem chave, a API devolve resposta mock).

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A geração real usa `POST /api/generate` (ver `TECH.md`).

## Deploy na Vercel (Passo 6)

1. Faça push do repositório para o GitHub (já configurado).
2. Em [vercel.com](https://vercel.com), inicie sessão e **Add New → Project**.
3. **Import** o repositório `Gerador-de-Anuncios` e confirme:
   - **Framework Preset:** Next.js (detetado automaticamente).
   - **Build Command:** `next build` (predefinição).
   - **Output:** gerido pelo Next.js.
4. Em **Environment Variables**, adicione para **Production** (e opcionalmente Preview):
   - `OPENAI_API_KEY` — chave da OpenAI (obrigatória para geração real em produção; sem ela, a API continua a devolver resposta mock).
   - Opcional: `OPENAI_MODEL` (ex.: `gpt-4o-mini`).
5. **Deploy**. A URL pública servirá a UI; as chamadas a `/api/generate` correm em funções serverless no mesmo projeto.

**Notas**

- No plano Hobby da Vercel, o tempo máximo por função serverless é limitado. Se a chamada à OpenAI demorar demais, pode ser necessário repetir o pedido ou considerar um plano com limites mais altos.
- Não coloque `OPENAI_API_KEY` no código nem em ficheiros commitados. Use só as variáveis de ambiente do painel da Vercel.

## Checklist de produção

Use esta lista depois do primeiro deploy (ex.: [geradoranuncios.vercel.app](https://geradoranuncios.vercel.app/)).

| # | O quê | Detalhe |
|---|--------|---------|
| 1 | **URL de produção** | Guarda o domínio `*.vercel.app` ou o domínio personalizado em **Settings → Domains**. Evita links antigos de *deployment* com ID (podem dar `DEPLOYMENT_NOT_FOUND`). |
| 2 | **`OPENAI_API_KEY`** | Em **Settings → Environment Variables**, escopo **Production**. Depois de criar ou alterar, faz **Redeploy** para a variável entrar no build/runtime. |
| 3 | **Testar geração real** | Na app pública, gera anúncios: se aparecer aviso de *mock*/demonstração, a chave não está a ser aplicada ou falta redeploy. |
| 4 | **OpenAI — custos e limites** | Em [platform.openai.com](https://platform.openai.com) define método de pagamento, limites de uso e revê **Usage** com frequência no início. |
| 5 | **`NEXT_PUBLIC_SITE_URL` (opcional)** | Define `https://teu-dominio` se quiseres forçar o URL canónico nos metadados (Open Graph). Na Vercel, o build já usa `VERCEL_URL` se não definires isto. |
| 6 | **Logs** | **Deployments →** escolhe um deploy → **Functions** / logs para erros em `/api/generate`. |
| 7 | **Domínio próprio (opcional)** | **Settings → Domains** — aponta o DNS conforme as instruções da Vercel. |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento Next.js |
| `npm run build` | Build de produção |
| `npm start` | Servidor após `build` |
| `npm run lint` | ESLint |
