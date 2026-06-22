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
  experimental: {
    // bullmq / ioredis / prisma must stay server-side externals.
    serverComponentsExternalPackages: ["bullmq", "ioredis", "@prisma/client", "archiver"],
  },
};
export default nextConfig;
