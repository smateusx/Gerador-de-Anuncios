/**
 * Exportação CSV/JSON a partir da resposta de /api/generate (uso no browser).
 */

function csvCell(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Gera CSV com UTF-8 BOM para abrir bem no Excel.
 * Colunas: platform, variation, field, content, characters, limit
 */
export function resultToCsv(result) {
  const rows = [];
  const header = ["platform", "variation", "field", "content", "characters", "limit"];
  rows.push(header.map(csvCell).join(","));

  const ml = result.limits?.meta || {};
  const gl = result.limits?.google || {};

  function pushRow(platform, variation, field, content, limit) {
    const c = content ?? "";
    rows.push(
      [platform, variation, field, c, c.length, limit ?? ""].map(csvCell).join(",")
    );
  }

  (result.meta?.variations || []).forEach((v) => {
    const lab = v.label || v.id || "";
    pushRow("meta", lab, "primaryText", v.primaryText, ml.primaryText);
    pushRow("meta", lab, "headline", v.headline, ml.headline);
    pushRow("meta", lab, "description", v.description, ml.description);
    pushRow("meta", lab, "cta", v.cta, ml.cta);
  });

  (result.google?.variations || []).forEach((v) => {
    const lab = v.label || v.id || "";
    (v.headlines || []).forEach((h, i) => {
      pushRow("google", lab, `headline_${i + 1}`, h, gl.headline);
    });
    (v.descriptions || []).forEach((d, i) => {
      pushRow("google", lab, `description_${i + 1}`, d, gl.description);
    });
    (v.keywordIdeas || []).forEach((kw, i) => {
      pushRow("google", lab, `keyword_${i + 1}`, kw, "");
    });
  });

  return "\uFEFF" + rows.join("\r\n");
}

export function downloadBlob(filename, body, mimeType) {
  const blob = new Blob([body], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadResultJson(result) {
  const body = JSON.stringify(result, null, 2);
  downloadBlob(`gerador-anuncios-${Date.now()}.json`, body, "application/json;charset=utf-8");
}

export function downloadResultCsv(result) {
  const csv = resultToCsv(result);
  downloadBlob(`gerador-anuncios-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
}
