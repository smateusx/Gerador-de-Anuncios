"use client";

import { useEffect, useState } from "react";
import { downloadResultCsv, downloadResultJson } from "@/lib/exportResult";
import { clearPersisted, loadPersisted, saveFormState, saveResultState } from "@/lib/localPersist";

const initialForm = {
  productName: "",
  valueProposition: "",
  audience: "",
  offer: "",
  tone: "",
  language: "pt-BR",
  platforms: "both",
  variationCount: 3,
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    window.prompt("Copie o texto:", text);
  }
}

function CopyButton({ label, text }) {
  return (
    <button type="button" className="btn-copy" onClick={() => copyText(text)} disabled={!text}>
      {label}
    </button>
  );
}

/** Contagem de caracteres vs limite (referência em `result.limits`). */
function CharCount({ text, max }) {
  if (max == null || max === "") return null;
  const n = (text || "").length;
  const over = n > max;
  return (
    <span className={over ? "char-count char-count-over" : "char-count"} title="Caracteres / limite orientador">
      {n} / {max}
    </span>
  );
}

export default function AdGeneratorClient() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [persistReady, setPersistReady] = useState(false);
  const [restoredBanner, setRestoredBanner] = useState(false);

  useEffect(() => {
    const { form: savedForm, result: savedResult, hadAny } = loadPersisted();
    if (savedForm && typeof savedForm === "object") {
      setForm({
        ...initialForm,
        ...savedForm,
        variationCount: Math.min(5, Math.max(1, Number(savedForm.variationCount) || 3)),
        platforms: savedForm.platforms ?? initialForm.platforms,
      });
    }
    if (savedResult && typeof savedResult === "object") {
      setResult(savedResult);
    }
    if (hadAny) setRestoredBanner(true);
    setPersistReady(true);
  }, []);

  useEffect(() => {
    if (!persistReady) return;
    saveFormState(form);
  }, [form, persistReady]);

  useEffect(() => {
    if (!persistReady) return;
    saveResultState(result);
  }, [result, persistReady]);

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleClearStored() {
    clearPersisted();
    setForm(initialForm);
    setResult(null);
    setRestoredBanner(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const body = {
        productName: form.productName.trim(),
        valueProposition: form.valueProposition.trim(),
        audience: form.audience.trim(),
        offer: form.offer.trim(),
        tone: form.tone.trim(),
        language: form.language.trim(),
        platforms: form.platforms,
        variationCount: Number(form.variationCount) || 3,
      };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Erro ${res.status}`);
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na rede");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="layout">
      <header className="header">
        <h1>Gerador de Anúncios</h1>
        <p className="lede">
          Preencha os campos abaixo. A IA gera textos para <strong>Meta Ads</strong> e/ou{" "}
          <strong>Google Ads</strong> — reveja sempre antes de publicar.
        </p>
        <p className="lede-meta">
          O rascunho e o último resultado são guardados <strong>só neste navegador</strong> (localStorage),
          sem servidor.{" "}
          <button type="button" className="link-button" onClick={handleClearStored}>
            Limpar dados guardados
          </button>
        </p>
      </header>

      {restoredBanner && (
        <div className="banner banner-restored" role="status">
          Recuperámos o rascunho e/ou o último resultado deste dispositivo.{" "}
          <button type="button" className="link-button" onClick={() => setRestoredBanner(false)}>
            Fechar
          </button>
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Produto ou serviço *</span>
            <input
              required
              value={form.productName}
              onChange={(e) => updateField("productName", e.target.value)}
              placeholder="Ex.: Curso de Excel para negócios"
            />
          </label>
          <label className="field">
            <span>Proposta de valor *</span>
            <textarea
              required
              rows={3}
              value={form.valueProposition}
              onChange={(e) => updateField("valueProposition", e.target.value)}
              placeholder="O que o cliente ganha / que problema resolve"
            />
          </label>
          <label className="field">
            <span>Público-alvo *</span>
            <textarea
              required
              rows={2}
              value={form.audience}
              onChange={(e) => updateField("audience", e.target.value)}
              placeholder="Quem é o cliente ideal"
            />
          </label>
          <label className="field">
            <span>Oferta *</span>
            <textarea
              required
              rows={2}
              value={form.offer}
              onChange={(e) => updateField("offer", e.target.value)}
              placeholder="Preço, promoção, prova social, garantia…"
            />
          </label>
          <label className="field">
            <span>Tom de voz *</span>
            <input
              required
              value={form.tone}
              onChange={(e) => updateField("tone", e.target.value)}
              placeholder="Ex.: direto, formal, inspirador"
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Idioma *</span>
              <input
                required
                value={form.language}
                onChange={(e) => updateField("language", e.target.value)}
                placeholder="pt-BR"
              />
            </label>
            <label className="field">
              <span>Plataformas</span>
              <select value={form.platforms} onChange={(e) => updateField("platforms", e.target.value)}>
                <option value="both">Meta e Google</option>
                <option value="meta">Só Meta</option>
                <option value="google">Só Google</option>
              </select>
            </label>
            <label className="field">
              <span>Variações (1–5)</span>
              <input
                type="number"
                min={1}
                max={5}
                value={form.variationCount}
                onChange={(e) => updateField("variationCount", e.target.value)}
              />
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "A gerar…" : "Gerar anúncios"}
        </button>
      </form>

      {error && (
        <div className="banner banner-error" role="alert">
          {error}
        </div>
      )}

      {result?.mock && (
        <div className="banner banner-info">
          Modo de demonstração: sem <code>OPENAI_API_KEY</code> no servidor os textos são de exemplo.
          Configure <code>.env.local</code> para geração real.
        </div>
      )}

      {result && (
        <section className="results" aria-live="polite">
          <div className="results-head">
            <h2>Resultados</h2>
            <div className="export-toolbar">
              <button type="button" className="btn-secondary" onClick={() => downloadResultJson(result)}>
                Exportar JSON
              </button>
              <button type="button" className="btn-secondary" onClick={() => downloadResultCsv(result)}>
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="disclaimer-box">
            <p>
              <strong>Importante:</strong> {result.disclaimer}
            </p>
            <p className="policy-note">
              O anúncio publicado deve cumprir as{" "}
              <a href="https://www.facebook.com/policies/ads" target="_blank" rel="noopener noreferrer">
                políticas da Meta
              </a>{" "}
              e as{" "}
              <a href="https://support.google.com/adspolicy" target="_blank" rel="noopener noreferrer">
                políticas do Google Ads
              </a>
              . És responsável pelo conteúdo final.
            </p>
          </div>

          {result.meta?.variations?.length > 0 && (
            <div className="platform-block">
              <h3>Meta Ads</h3>
              {result.meta.variations.map((v) => {
                const ml = result.limits?.meta || {};
                const block = [
                  `Texto principal: ${v.primaryText || ""}`,
                  `Título: ${v.headline || ""}`,
                  `Descrição: ${v.description || ""}`,
                  `CTA: ${v.cta || ""}`,
                ].join("\n");
                return (
                  <article key={v.id || v.label} className="card">
                    <div className="card-head">
                      <h4>{v.label || "Variação"}</h4>
                      <CopyButton label="Copiar tudo" text={block} />
                    </div>
                    <dl className="copy-fields">
                      <div>
                        <dt>
                          Texto principal <CharCount text={v.primaryText} max={ml.primaryText} />
                        </dt>
                        <dd>
                          <span className="text-block">{v.primaryText}</span>
                          <CopyButton label="Copiar" text={v.primaryText || ""} />
                        </dd>
                      </div>
                      <div>
                        <dt>
                          Título <CharCount text={v.headline} max={ml.headline} />
                        </dt>
                        <dd>
                          <span className="text-block">{v.headline}</span>
                          <CopyButton label="Copiar" text={v.headline || ""} />
                        </dd>
                      </div>
                      <div>
                        <dt>
                          Descrição <CharCount text={v.description} max={ml.description} />
                        </dt>
                        <dd>
                          <span className="text-block">{v.description}</span>
                          <CopyButton label="Copiar" text={v.description || ""} />
                        </dd>
                      </div>
                      <div>
                        <dt>
                          CTA <CharCount text={v.cta} max={ml.cta} />
                        </dt>
                        <dd>
                          <span className="text-block">{v.cta}</span>
                          <CopyButton label="Copiar" text={v.cta || ""} />
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          )}

          {result.google?.variations?.length > 0 && (
            <div className="platform-block">
              <h3>Google Ads (pesquisa)</h3>
              {result.google.variations.map((v) => {
                const gl = result.limits?.google || {};
                const headlines = (v.headlines || []).join("\n");
                const descriptions = (v.descriptions || []).join("\n");
                const keywords = (v.keywordIdeas || []).join(", ");
                const block = [
                  `Headlines:\n${headlines}`,
                  `\nDescrições:\n${descriptions}`,
                  keywords ? `\nPalavras-chave (ideias):\n${keywords}` : "",
                ].join("");
                return (
                  <article key={v.id || v.label} className="card">
                    <div className="card-head">
                      <h4>{v.label || "Variação"}</h4>
                      <CopyButton label="Copiar tudo" text={block} />
                    </div>
                    <dl className="copy-fields">
                      <div>
                        <dt>Headlines</dt>
                        <dd>
                          <ul className="list-lines">
                            {(v.headlines || []).map((h, i) => (
                              <li key={i}>
                                {h}{" "}
                                <CharCount text={h} max={gl.headline} />
                              </li>
                            ))}
                          </ul>
                          <CopyButton label="Copiar headlines" text={headlines} />
                        </dd>
                      </div>
                      <div>
                        <dt>Descrições</dt>
                        <dd>
                          <ul className="list-lines">
                            {(v.descriptions || []).map((d, i) => (
                              <li key={i}>
                                {d}{" "}
                                <CharCount text={d} max={gl.description} />
                              </li>
                            ))}
                          </ul>
                          <CopyButton label="Copiar descrições" text={descriptions} />
                        </dd>
                      </div>
                      {(v.keywordIdeas || []).length > 0 && (
                        <div>
                          <dt>Ideias de palavras-chave</dt>
                          <dd>
                            <span className="text-block">{keywords}</span>
                            <CopyButton label="Copiar" text={keywords} />
                          </dd>
                        </div>
                      )}
                    </dl>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
