/**
 * Persistência local (localStorage) — só no browser, sem servidor.
 * Chaves versionadas para poder migrar formato no futuro.
 */

const KEYS = {
  form: "gerador-anuncios:v1:form",
  result: "gerador-anuncios:v1:result",
};

export function loadPersisted() {
  if (typeof window === "undefined") {
    return { form: null, result: null, hadAny: false };
  }
  try {
    const rawForm = localStorage.getItem(KEYS.form);
    const rawResult = localStorage.getItem(KEYS.result);
    const form = rawForm ? JSON.parse(rawForm) : null;
    const result = rawResult ? JSON.parse(rawResult) : null;
    return {
      form,
      result,
      hadAny: Boolean(rawForm || rawResult),
    };
  } catch {
    return { form: null, result: null, hadAny: false };
  }
}

export function saveFormState(form) {
  try {
    localStorage.setItem(KEYS.form, JSON.stringify(form));
  } catch {
    /* quota / privado */
  }
}

export function saveResultState(result) {
  try {
    if (result) {
      localStorage.setItem(KEYS.result, JSON.stringify(result));
    } else {
      localStorage.removeItem(KEYS.result);
    }
  } catch {
    /* quota */
  }
}

export function clearPersisted() {
  try {
    localStorage.removeItem(KEYS.form);
    localStorage.removeItem(KEYS.result);
  } catch {
    /* ignore */
  }
}
