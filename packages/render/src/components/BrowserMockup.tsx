import React from "react";
import type { Theme } from "../theme.js";

/**
 * A premium browser window for staging product screenshots: rounded corners,
 * a minimal chrome bar, deep layered shadows, an accent rim-light and a subtle
 * top glass reflection. Supports a light 3D tilt for cinematic depth.
 *
 * The screenshot itself is passed as children so the caller controls the camera
 * move; this component only renders the frame + lighting.
 */
export const BrowserMockup: React.FC<{
  theme: Theme;
  url?: string;
  scale?: number;
  /** Degrees of X/Y tilt (perspective). 0 = flat-on. */
  tiltX?: number;
  tiltY?: number;
  glass?: boolean;
  children: React.ReactNode;
}> = ({ theme, url = "app", scale = 1, tiltX = 0, tiltY = 0, glass = true, children }) => {
  const radius = 18 * scale;
  return (
    <div style={{ perspective: 2200 * scale, width: "100%", height: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: radius,
          overflow: "hidden",
          background: theme.bgElevated,
          border: `1px solid ${theme.panelBorder}`,
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: "preserve-3d",
          boxShadow: [
            `0 2px 0 rgba(255,255,255,0.05) inset`,
            `0 60px 140px rgba(0,0,0,0.62)`,
            `0 20px 50px rgba(0,0,0,0.45)`,
            `0 0 0 1px rgba(0,0,0,0.4)`,
            `0 0 60px ${theme.accentGlow}`,
          ].join(", "),
        }}
      >
        {/* Chrome bar */}
        <div
          style={{
            height: 46 * scale,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 9 * scale,
            padding: `0 ${18 * scale}px`,
            background: `linear-gradient(180deg, ${theme.bgElevated}, ${theme.bg})`,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <Dot c="#FF5F57" s={scale} />
          <Dot c="#FEBC2E" s={scale} />
          <Dot c="#28C840" s={scale} />
          <div
            style={{
              marginLeft: 16 * scale,
              flex: 1,
              maxWidth: 520 * scale,
              height: 28 * scale,
              borderRadius: 9 * scale,
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              gap: 9 * scale,
              padding: `0 ${14 * scale}px`,
              color: theme.textMuted,
              fontFamily: theme.fontMono,
              fontSize: 13 * scale,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <svg width={12 * scale} height={12 * scale} viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2.4">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            {url}
          </div>
        </div>

        {/* Screen */}
        <div style={{ position: "relative", flex: 1, overflow: "hidden", background: theme.bg }}>
          {children}
          {/* Subtle top glass reflection */}
          {glass ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 22%)",
                pointerEvents: "none",
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const Dot: React.FC<{ c: string; s: number }> = ({ c, s }) => (
  <span
    style={{
      width: 12 * s,
      height: 12 * s,
      borderRadius: "50%",
      background: c,
      display: "inline-block",
      boxShadow: `0 0 0 0.5px rgba(0,0,0,0.3)`,
    }}
  />
);
