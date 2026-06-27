import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora, Fraunces } from "next/font/google";
import { APP_NAME } from "@studio-one/shared";
import { AppShell } from "../components/app-shell.js";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Modern geometric display face — strong, premium headlines.
const display = Sora({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display", display: "swap" });
// Editorial serif, used italic and sparingly for a "human studio" accent.
const editorial = Fraunces({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--font-editorial", display: "swap" });

const DESCRIPTION =
  "Studio One transforme votre site ou votre app en vidéo marketing prête à vendre : démos SaaS, pubs TikTok/Reels, onboarding et pitchs. Un rendu studio, pas une vidéo IA générique.";

export const metadata: Metadata = {
  metadataBase: new URL("https://demo-navy-phi.vercel.app"),
  title: {
    default: `${APP_NAME} · Vidéos de démonstration SaaS professionnelles`,
    template: `%s · ${APP_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: APP_NAME,
  icons: { icon: "/brand/studio-one-favicon.png" },
  openGraph: {
    title: `${APP_NAME} · Vidéos de démo professionnelles`,
    description: "Transformez votre application en vidéo claire, structurée et prête à partager avec vos prospects.",
    siteName: APP_NAME,
    images: ["/brand/studio-one-badge-brown.png"],
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${display.variable} ${editorial.variable} dark`}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
