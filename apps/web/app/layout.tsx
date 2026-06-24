import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { APP_NAME } from "@demoforge/shared";
import { AppShell } from "../components/app-shell.js";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — AI demo video studio for SaaS teams`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "DemoForge captures real product flows, writes the story, adds voice-ready scripts and renders premium videos your sales team can actually use.",
  applicationName: APP_NAME,
  icons: { icon: "/icon.svg" },
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
