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

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento Next.js |
| `npm run build` | Build de produção |
| `npm start` | Servidor após `build` |
| `npm run lint` | ESLint |
