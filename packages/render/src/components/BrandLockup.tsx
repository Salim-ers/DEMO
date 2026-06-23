import React from "react";
import { Img } from "remotion";

/**
 * The product's real, on-page logo shown at its natural aspect ratio — never
 * cropped. Captured logos are usually wide wordmark lockups (emblem + name), so
 * forcing them into a square tile would slice off the wordmark. We constrain by
 * height and let width follow, `objectFit: contain`, on a subtle rounded plate
 * that sits cleanly on the black backdrop whether the logo carries its own
 * background or ships transparent.
 */
export const BrandLockup: React.FC<{ url: string; scale: number; height?: number }> = ({
  url,
  scale,
  height = 168,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${20 * scale}px ${30 * scale}px`,
      borderRadius: 24 * scale,
      background: "rgba(255,255,255,0.045)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
      backdropFilter: "blur(2px)",
    }}
  >
    <Img
      src={url}
      style={{
        height: height * scale,
        width: "auto",
        maxWidth: 1120 * scale,
        objectFit: "contain",
        display: "block",
      }}
    />
  </div>
);
