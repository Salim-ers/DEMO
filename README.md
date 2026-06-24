# Studio One

**Generate premium SaaS demo videos from a real browser capture.**

Studio One turns a URL, a login, and a sentence into a polished, narrated product
demo — using *real screenshots of the actual app*, not invented UI. It drives a
headless browser through a scenario you describe in plain English, builds a
grounded storyboard, writes a timed voiceover, renders an MP4 with Remotion, and
exports the video alongside its storyboard, script, and captions.

> **Status — runnable Phase‑1 foundation.** The full critical path
> (capture → storyboard → script → captions → render → export) is implemented and
> wired end to end. External providers (LLM, AI voiceover, marketing b‑roll) sit
> behind clean interfaces and are **optional**: with no API keys the whole
> pipeline runs offline using deterministic fallbacks. Phase‑2/3 polish is marked
> with `TODO` against the relevant interfaces.

---

## How it works

```
  URL + login + scenario (plain English)
        │
        ▼
  ┌───────────────┐   real headless Chromium, one screenshot + page
  │ 1 analyze     │   metadata per step. 2FA / CAPTCHA are NEVER bypassed —
  │ 2 capture     │   you're asked to finish those by hand.
  └───────┬───────┘
          ▼
  ┌───────────────┐   grounded hook → problem → product‑in‑action (real
  │ 3 storyboard  │   screens) → proof → CTA. LLM when configured, otherwise a
  │ 4 voiceover   │   deterministic writer. Voiceover is timed 1:1 to scenes.
  │ 5 captions    │   SRT + VTT generated from the timed lines.
  └───────┬───────┘
          ▼
  ┌───────────────┐   Remotion composition (16:9 / 9:16 / 1:1), sober camera
  │ 6 render      │   moves, simulated cursor, elegant subtitles. H.264 1080p,
  │ 7 export      │   loudness‑normalized. Bundles MP4 + storyboard + script +
  └───────┬───────┘   captions + assets.zip.
          ▼
   demo.mp4  ·  storyboard.json  ·  script.md  ·  captions.srt/.vtt  ·  assets.zip
```

Each stage persists its status, so the web UI shows a live **render‑pipeline
timeline** and a retried job resumes from where it stopped.

---

## Tech stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Web:** Next.js 15 (App Router), React 18, Tailwind, dark premium UI
- **Data:** PostgreSQL + Prisma
- **Queue:** BullMQ + Redis
- **Capture:** Playwright (Chromium)
- **Render:** Remotion + FFmpeg
- **Storage:** S3‑compatible (MinIO in dev)
- **AI (optional):** Anthropic / OpenAI for copy, ElevenLabs for voiceover,
  Higgsfield for b‑roll — all behind interfaces, all skippable
- **Validation:** Zod everywhere · **Logging:** pino · **Tests:** Vitest

---

## Repository layout

```
studio-one/
├─ apps/
│  ├─ web/                 Next.js app (dashboard, wizard, project view, settings)
│  └─ worker/              BullMQ worker running the 7‑stage pipeline
├─ packages/
│  ├─ shared/              constants, Zod schemas, prompts, caption + util helpers
│  ├─ db/                  Prisma schema, client, seed
│  ├─ integrations/        LLM, storage (S3), vault, TTS, Higgsfield providers
│  ├─ capture/             Playwright session, login, scenario runner, PII masking
│  ├─ storyboard/          storyboard generator (LLM + deterministic fallback)
│  ├─ voice/               timed voiceover script builder
│  └─ render/              Remotion compositions + render/export pipeline
├─ infra/                  docker-compose (Postgres, Redis, MinIO)
├─ examples/output/        committed sample artifacts (see "Proof it runs")
└─ .env.example
```

---

## Prerequisites

- **Node ≥ 20** and **pnpm ≥ 9** (`npm i -g pnpm`)
- **Docker** (for Postgres, Redis, MinIO) — or bring your own instances
- **FFmpeg** on `PATH` (required by the render/export step)
- A network connection on first build (Next pulls the Inter/JetBrains fonts)

## Quick start

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env            # sane local defaults are already filled in

# 3. Start infra (Postgres + Redis + MinIO)
pnpm infra:up

# 4. Create the schema and seed an example workspace + project
pnpm db:push
pnpm db:seed

# 5. Install the capture browser (Chromium)
pnpm capture:install

# 6. Run the app and the worker (two terminals)
pnpm dev                        # http://localhost:3000
pnpm worker                     # picks up pipeline jobs
```

Open the app, create a demo (or open the seeded **Northwind CRM** project), and
click **Generate**. Watch the pipeline timeline; when it finishes, the video and
all deliverables appear in the download center.

### Render a sample video without the app

```bash
pnpm render:example
```

This runs the whole generation chain on built‑in example data (no browser
needed) and writes a real MP4 plus artifacts to `packages/render/out/`. It's the
fastest way to confirm Remotion + FFmpeg are working on your machine.

---

## Offline by default

Studio One is designed to run with **zero external API keys**:

- `LLM_PROVIDER=none` → the **deterministic storyboard + script writer** is used.
- No `ELEVENLABS_API_KEY` → voiceover stays **script‑only** (text for a human to
  record); nothing is synthesized.
- No `HIGGSFIELD_API_KEY` → b‑roll scenes are skipped gracefully.

Set keys (env or **Settings → Providers** in the app) to upgrade quality. Keys
entered in the UI are encrypted in the vault and stored only as opaque
references — never in plaintext, never in logs.

### Environment variables

See `.env.example` for the full list. The essentials:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection for BullMQ |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Object storage (MinIO in dev) |
| `LOCAL_SECRET_ENCRYPTION_KEY` | Key for the local AES‑256 credential vault |
| `LLM_PROVIDER` | `none` \| `anthropic` \| `openai` |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | LLM keys (optional) |
| `TTS_PROVIDER` / `ELEVENLABS_API_KEY` | AI voiceover (optional, consent‑gated) |
| `HIGGSFIELD_API_KEY` | Marketing b‑roll (optional) |

---

## Adding a provider

Every external service is an interface in `packages/integrations`. To wire a real
one, implement the interface and flip the env switch — no pipeline code changes.

**Higgsfield (b‑roll)** — `packages/integrations/src/higgsfield/index.ts`
implements `HiggsfieldProvider` with placeholder endpoints. Fill in the real API
calls in `RealHiggsfieldProvider`, set `HIGGSFIELD_API_KEY`, and storyboard
`higgsfield_broll` scenes will be generated instead of skipped.

**LLM** — add `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) and set `LLM_PROVIDER`.
`resolveLLM()` returns the provider; the storyboard/voice packages automatically
prefer it and fall back to deterministic output on any error.

**Voiceover** — implement against `TTSProvider`, set `TTS_PROVIDER=elevenlabs`
and `ELEVENLABS_API_KEY`. Synthesis only runs when the project's consent flag is
true.

**Production secret vault** — swap `LocalEncryptedVault` for Doppler / Infisical
/ AWS Secrets Manager behind the `SecretVault` interface; callers only ever see
opaque refs. See `packages/integrations/TODO_PROVIDER_ENDPOINTS.md`.

---

## Testing

```bash
pnpm test         # Vitest across shared, storyboard, voice, capture
pnpm typecheck    # project‑wide TypeScript
```

CI (`.github/workflows/ci.yml`) runs typecheck + tests against ephemeral Postgres
and Redis with `LLM_PROVIDER=none`.

---

## Proof it runs

`examples/output/` contains artifacts generated by the **real** deterministic
engine (shared Zod schemas + storyboard fallback + caption builders), plus a
short MP4 produced with the exact FFmpeg encode settings the export stage uses:

- `storyboard.json` — schema‑validated 7‑scene storyboard
- `script.md` — timed voiceover script
- `captions.srt` / `captions.vtt` — generated from the timed lines
- `render-smoke.mp4` — 1080p H.264 (yuv420p, faststart, loudness‑normalized)

Regenerate the data artifacts any time with `pnpm render:example` (which also
renders a full Remotion MP4).

---

## Deployment

- **Web** → any Node host or Vercel. Set all env vars; point at managed Postgres,
  Redis, and S3.
- **Worker** → a long‑running container (it needs Chromium + FFmpeg). Scale by
  running **more worker processes**, not higher concurrency — each job uses a
  browser and a render. A `Dockerfile` for the worker is the natural next step.
- **Storage** → real S3 (set `S3_FORCE_PATH_STYLE=false`, drop `S3_ENDPOINT`).

---

## Security & compliance

- **No plaintext secrets.** Login credentials and provider API keys live in a
  vault (AES‑256‑GCM locally); the database stores only opaque references.
- **PII masking.** Capture blurs emails, phone numbers, and `[data-sensitive]`
  nodes in‑page before screenshotting; metadata is redacted too.
- **No defense evasion.** The capture never solves CAPTCHAs, bypasses bot
  protection, or completes 2FA — it stops and asks for a human.
- **Consent‑gated voice.** No voice is cloned or synthesized without an explicit
  consent flag.
- **Bounded sessions.** Every browser session has a hard 5‑minute lifetime cap.
- **Audit trail.** Sensitive actions (project access, credential use, provider
  changes) are recorded in an `AuditLog`.
- **Use responsibly.** Only capture applications you are authorized to access,
  and respect each site's terms of service.

---

## License

Provided as an MVP foundation for internal evaluation. Add the license of your
choice before distributing.
