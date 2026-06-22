import { Config } from "@remotion/cli/config";

/**
 * Remotion project config. Kept conservative for predictable, "corporate
 * premium" output: H.264 MP4, high image quality, overwrite enabled.
 */
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");
