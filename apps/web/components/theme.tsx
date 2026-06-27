"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemePref = "system" | "light" | "dark";
type Resolved = "light" | "dark";

const ThemeCtx = createContext<{ pref: ThemePref; resolved: Resolved; setPref: (p: ThemePref) => void }>({
  pref: "dark",
  resolved: "dark",
  setPref: () => {},
});

export const useTheme = () => useContext(ThemeCtx);

/** App-scoped theme (dark default). Preference persisted in localStorage; "system" follows the OS. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("dark");
  const [systemLight, setSystemLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("so-theme") as ThemePref | null;
    if (saved === "system" || saved === "light" || saved === "dark") setPrefState(saved);
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    setSystemLight(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemLight(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setPref = (p: ThemePref) => {
    setPrefState(p);
    try {
      localStorage.setItem("so-theme", p);
    } catch {
      /* ignore */
    }
  };

  const resolved: Resolved = pref === "system" ? (systemLight ? "light" : "dark") : pref;

  return <ThemeCtx.Provider value={{ pref, resolved, setPref }}>{children}</ThemeCtx.Provider>;
}
