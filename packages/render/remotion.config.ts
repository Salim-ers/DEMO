import { Config } from "@remotion/cli/config";

/**
 * Remotion project config. Kept conservative for predictable, "corporate
 * premium" output: H.264 MP4, high image quality, overwrite enabled.
 */
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");

// The sources use NodeNext-style ".js" import specifiers that resolve to
// ".ts"/".tsx" files. Teach the CLI/Studio bundler the same mapping that the
// programmatic renderer (render.ts) applies, so `remotion studio` and CLI
// stills bundle without "Can't resolve './Root.js'".
Config.overrideWebpackConfig((config) => {
  config.resolve = config.resolve ?? {};
  config.resolve.extensionAlias = {
    ...(config.resolve.extensionAlias ?? {}),
    ".js": [".ts", ".tsx", ".js", ".jsx"],
    ".mjs": [".mts", ".mjs"],
    ".cjs": [".cts", ".cjs"],
  };
  return config;
});
