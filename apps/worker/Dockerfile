# DemoForge pipeline worker — runs capture (Playwright) + render (Remotion).
#
# IMPORTANT: the build context MUST be the repository root, because the worker
# depends on the workspace packages (packages/*). On Railway, set the service's
# Root Directory to the repo root and point it at this Dockerfile via
# railway.json (build.dockerfilePath = "apps/worker/Dockerfile").
#
# Local build/run:
#   docker build -f apps/worker/Dockerfile -t demoforge-worker .
#   docker run --env-file .env demoforge-worker
FROM node:22-bookworm-slim

# Stable, root-owned path for the Playwright browser so build + runtime agree.
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PLAYWRIGHT_HEADLESS=true

# Base tooling for fetching pnpm and the browsers.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable

WORKDIR /app

# Copy the whole monorepo so `workspace:*` deps resolve. .dockerignore keeps
# node_modules / build output / secrets out of the image.
COPY . .

# Install ALL deps including dev (tsx, prisma, the Remotion CLI). --prod=false
# guards against NODE_ENV stripping devDependencies. node-linker=hoisted
# (.npmrc) makes the Prisma client resolve correctly.
RUN pnpm install --frozen-lockfile --prod=false

# Generate the Prisma client against the committed schema.
RUN pnpm --filter @demoforge/db exec prisma generate

# Chromium + every system library that BOTH Playwright (capture) and Remotion
# (render) need at runtime.
RUN pnpm --filter @demoforge/capture exec playwright install --with-deps chromium

# Pre-fetch Remotion's headless Chrome shell so the first render doesn't stall.
# Best-effort: the renderer also fetches it on demand if this is skipped.
RUN pnpm --filter @demoforge/render exec remotion browser ensure || true

# JSON logs + production behaviour at runtime (set AFTER install so dev deps
# were installed above).
ENV NODE_ENV=production

# /health binds to $PORT (Railway injects it); 8080 is the local default.
EXPOSE 8080

CMD ["pnpm", "--filter", "@demoforge/worker", "start"]
