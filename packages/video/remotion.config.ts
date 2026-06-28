import { Config } from "@remotion/cli/config";

/**
 * Remotion config for the Studio One montage engine. H.264 MP4, high image
 * quality, overwrite enabled. The sources use NodeNext-style ".js" import
 * specifiers that resolve to ".ts"/".tsx"; teach the bundler the same mapping
 * so Studio + CLI render resolve them.
 */
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");

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
