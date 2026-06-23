import React from "react";
import type { Theme } from "../theme.js";
import { PremiumStage } from "./PremiumStage.js";

/**
 * Backwards-compatible alias for the premium backdrop. Existing scenes call
 * <Backdrop/>; the real depth, glows, grain and grid now live in PremiumStage.
 */
export const Backdrop: React.FC<{ theme: Theme; intensity?: number; halo?: boolean }> = ({
  theme,
  intensity = 1,
  halo = false,
}) => <PremiumStage theme={theme} intensity={intensity} halo={halo} />;
