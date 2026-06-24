import React from "react";
import type { Theme } from "../theme.js";

/** Sober browser chrome wrapper so raw screenshots read as a real product. */
export const BrowserFrame: React.FC<{
  theme: Theme;
  url?: string;
  scale?: number;
  children: React.ReactNode;
}> = ({ theme, url = "app.studio-one.dev", scale = 1, children }) => {
  return (
    <div
      style={{
        borderRadius: 16 * scale,
        overflow: "hidden",
        border: `1px solid ${theme.border}`,
        background: theme.panel,
        boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 8px 30px rgba(0,0,0,0.4)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 44 * scale,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8 * scale,
          padding: `0 ${16 * scale}px`,
          background: theme.bgElevated,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <Dot c="#FF5F57" s={scale} />
        <Dot c="#FEBC2E" s={scale} />
        <Dot c="#28C840" s={scale} />
        <div
          style={{
            marginLeft: 14 * scale,
            flex: 1,
            maxWidth: 460 * scale,
            height: 26 * scale,
            borderRadius: 8 * scale,
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            padding: `0 ${12 * scale}px`,
            color: theme.textMuted,
            fontFamily: theme.fontMono,
            fontSize: 13 * scale,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden", background: theme.bg }}>{children}</div>
    </div>
  );
};

const Dot: React.FC<{ c: string; s: number }> = ({ c, s }) => (
  <span style={{ width: 12 * s, height: 12 * s, borderRadius: "50%", background: c, display: "inline-block" }} />
);
