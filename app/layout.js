import "./globals.css";

export const metadata = {
  title: "Gerador de Anúncios",
  description: "SaaS para gerar anúncios com IA para Meta Ads e Google Ads",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
