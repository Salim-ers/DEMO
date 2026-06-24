import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { APP_NAME } from "@studio-one/shared";
import { AppShell } from "../components/app-shell.js";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://demo-navy-phi.vercel.app"),
  title: {
    default: `${APP_NAME} — Cinematic SaaS demo videos`,
    template: `%s · ${APP_NAME}`,
  },
  description: "Capture real SaaS product flows and turn them into premium demo videos.",
  applicationName: APP_NAME,
  icons: { icon: "/brand/studio-one-favicon.png" },
  openGraph: {
    title: `${APP_NAME} — Cinematic SaaS demo videos`,
    description: "Capture real SaaS product flows and turn them into premium demo videos.",
    siteName: APP_NAME,
    images: ["/brand/studio-one-badge-brown.png"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} dark`}>
      <body className="font-sans antialiased">
        <div className="relative z-10">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
