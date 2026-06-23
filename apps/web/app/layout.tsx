import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces, Pacifico } from "next/font/google";
import { APP_NAME } from "@demoforge/shared";
import { AppShell } from "../components/app-shell.js";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Warm editorial serif for display headings — the StudioOne signature.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
// Brush script for the Studio One logotype.
const script = Pacifico({ subsets: ["latin"], variable: "--font-script", display: "swap", weight: "400" });

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — démos produit soignées, façon studio`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "StudioOne transforme de vrais écrans produit en démos raffinées, prêtes à diffuser. Capture réelle, storyboard, voix off et rendu premium — dans un seul flux élégant.",
  applicationName: APP_NAME,
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${display.variable} ${script.variable}`}>
      <body className="font-sans antialiased">
        <div className="relative z-10">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
