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

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento Next.js |
| `npm run build` | Build de produção |
| `npm start` | Servidor após `build` |
| `npm run lint` | ESLint |
