/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace packages ship raw TS; let Next transpile them.
  transpilePackages: [
    "@demoforge/shared",
    "@demoforge/db",
    "@demoforge/integrations",
    "@demoforge/worker",
  ],
  // bullmq / ioredis / prisma must stay server-side externals.
  serverExternalPackages: ["bullmq", "ioredis", "@prisma/client", "archiver"],
  webpack: (config) => {
    // Source uses NodeNext-style ".js" specifiers that resolve to ".ts"/".tsx"
    // files (tsconfig moduleResolution is "Bundler"). Teach webpack the same
    // mapping so both app code and transpiled workspace packages resolve.
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };
    return config;
  },
};
export default nextConfig;
