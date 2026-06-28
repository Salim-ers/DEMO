# public/ — assets dropped here are served via `staticFile()`

Fill this folder from the Studio One pipeline, then point the props at the files:

- **Higgsfield clips** (one 2 to 5s clip per scene, a single camera move each) →
  `clips/hook.mp4`, `clips/feature1.mp4`, … then set `deviceSrc: "clips/feature1.mp4"`,
  `deviceIsVideo: true` on the matching scene.
- **ElevenLabs voice-over** (model `eleven_multilingual_v2`, `stability` 0.45,
  endpoint `/with-timestamps`, exported as **WAV/PCM**) → `vo.wav`, set
  `voiceoverSrc: "vo.wav"` and fill `captions[]` with the word timestamps.
- **Music bed** → `music.mp3`, set `musicSrc: "music.mp3"` (it is ducked under the
  voice automatically via `musicDuckingDb`, default -20 dB).
- **Logo** → `logo.png`, set `brand.logoSrc: "logo.png"`.

Without any assets the compositions still preview with graceful placeholders.
Render with `pnpm --filter @studio-one/video render:16x9` (or `:9x16` / `:1x1`).
