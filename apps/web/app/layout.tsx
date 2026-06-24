import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { APP_NAME } from "@studio-one/shared";
import { AppShell } from "../components/app-shell.js";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Rounded geometric display face for the big "Studio One" wordmark.
const display = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display", display: "swap" });

const DESCRIPTION =
  "Studio One transforme vos écrans, vos accès démo et votre scénario en une vidéo de démonstration claire, propre et prête à envoyer à vos prospects.";

export const metadata: Metadata = {
  metadataBase: new URL("https://demo-navy-phi.vercel.app"),
  title: {
    default: `${APP_NAME} — Vidéos de démonstration pour vos SaaS`,
    template: `%s · ${APP_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: APP_NAME,
  icons: { icon: "/brand/studio-one-favicon.png" },
  openGraph: {
    title: `${APP_NAME} — Vidéos de démonstration pour vos SaaS`,
    description: DESCRIPTION,
    siteName: APP_NAME,
    images: ["/brand/studio-one-badge-brown.png"],
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${display.variable} dark`}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
