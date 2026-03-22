import "./globals.css";

const desc =
  "SaaS para gerar anúncios com IA para Meta Ads e Google Ads";

function resolveMetadataBase() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      return null;
    }
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return new URL(`https://${vercel}`);
  }
  return null;
}

const metadataBase = resolveMetadataBase();

export const metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: "Gerador de Anúncios",
  description: desc,
  ...(metadataBase
    ? {
        openGraph: {
          title: "Gerador de Anúncios",
          description: desc,
          url: metadataBase.href,
          siteName: "Gerador de Anúncios",
          locale: "pt_BR",
          type: "website",
        },
      }
    : {}),
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
