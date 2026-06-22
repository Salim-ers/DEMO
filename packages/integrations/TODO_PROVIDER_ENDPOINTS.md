# TODO — wiring real external provider endpoints

Everything in DemoForge works **without** these. They unlock optional capabilities.
Each provider sits behind an interface so you only touch one file.

## 1. Higgsfield (optional b-roll / transitions)

File: `src/higgsfield/index.ts` → `RealHiggsfieldProvider.request()`

Set in `.env`:
```
HIGGSFIELD_API_KEY="..."
HIGGSFIELD_API_BASE_URL="https://api.higgsfield.ai"   # confirm with Higgsfield docs
```

Confirm and replace the three placeholder paths/response shapes:

| Method                    | Placeholder path        | Expected response (current parse) |
|---------------------------|-------------------------|-----------------------------------|
| `generateMarketingBroll`  | `POST /v1/broll`        | `{ url \| assetUrl, id }`         |
| `imageToVideo`            | `POST /v1/image-to-video` | `{ url \| assetUrl, id }`       |
| `generateTransitionScene` | `POST /v1/transition`   | `{ url \| assetUrl, id }`         |

Notes:
- Higgsfield generation is async in most video APIs. If so, change `request()` to
  poll a job id (`GET /v1/jobs/:id`) until `status=succeeded`, then download the
  asset and `getStorage().put(...)` it, returning the **storage key**.
- The renderer treats `higgsfield_broll` scenes as optional: if `assetKeyOrUrl`
  is null, the scene is dropped and timing is re-balanced. Nothing breaks.

## 2. LLM (Anthropic / OpenAI)

Files: `src/llm/anthropic.ts`, `src/llm/openai.ts`. Already complete against the
public Messages / Chat Completions APIs. To point at an OpenAI-compatible gateway,
pass a custom `baseUrl` to `OpenAIProvider`.

Set ONE of:
```
LLM_PROVIDER="anthropic"   ANTHROPIC_API_KEY="..."
LLM_PROVIDER="openai"      OPENAI_API_KEY="..."
LLM_PROVIDER="none"        # deterministic fallback, fully offline
```

## 3. ElevenLabs TTS (optional)

File: `src/tts/index.ts`. Complete against the public TTS endpoint.
```
TTS_PROVIDER="elevenlabs"  ELEVENLABS_API_KEY="..."
```
Consent gate: `synthesize()` refuses unless `consent === true`. Do not remove it.

## 4. Secret vault (prod)

File: `src/vault/index.ts`. The local AES-256-GCM vault is for dev only.
Implement `SecretVault` for your provider and swap `getVault()`:
- Doppler: store/read via Doppler API, ref = secret name.
- Infisical: ref = `projectId/path/key`.
- AWS Secrets Manager: ref = secret ARN.
- HashiCorp Vault: ref = `secret/data/...` path.
