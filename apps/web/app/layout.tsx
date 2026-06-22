import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { APP_NAME } from "@demoforge/shared";
import { AppShell } from "../components/app-shell.js";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: `${APP_NAME} — premium demo videos from a real capture`,
  description:
    "Turn a URL, a login, and a sentence into a polished product demo video. Real browser captures, narrated and rendered automatically.",
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
