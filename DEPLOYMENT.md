# Déploiement Studio One (production)

Studio One se déploie en **deux morceaux** :

| Composant | Où | Rôle |
|---|---|---|
| **`apps/web`** (Next.js) | **Vercel** | L'interface + l'API. Met les jobs dans la file Redis. |
| **`apps/worker`** (BullMQ) | **Railway** (ou Render) | Process longue durée qui **consomme** la file et exécute le pipeline (capture Playwright + rendu Remotion). |

> ⚠️ Vercel ne peut PAS faire tourner le worker : ses fonctions sont éphémères (quelques secondes). Sans le worker sur Railway, les jobs restent bloqués en **« En attente / Queued 0% »**. La page projet affiche désormais un bandeau rouge **« Aucun worker actif »** dans ce cas.

---

## 1. Services à provisionner

| Service | Fournisseur conseillé | Donne |
|---|---|---|
| **Base de données** | Supabase (déjà en place) | `DATABASE_URL`, `DIRECT_URL` |
| **Redis** (file de jobs) | **Railway → New → Database → Redis** (ou Upstash) | `REDIS_URL` |
| **Stockage S3** (vidéos/assets) | **Supabase Storage** (S3-compatible) | `S3_*` |

### Stockage S3 via Supabase (le plus simple, tu as déjà Supabase)
1. Supabase → **Storage** → crée un bucket `studio-one`.
2. Supabase → **Project Settings → Storage → S3 Connection** → active-le, note l'**endpoint** + la **région** et génère une **Access key** (id + secret).
3. Renseigne :
   - `S3_ENDPOINT` = `https://<ref>.supabase.co/storage/v1/s3`
   - `S3_REGION` = la région affichée (ex. `eu-west-1`)
   - `S3_BUCKET` = `studio-one`
   - `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` = la clé S3 générée
   - `S3_FORCE_PATH_STYLE` = `true`

### Redis via Railway
Dans ton projet Railway : **New → Database → Add Redis**. Railway expose une variable `REDIS_URL` (souvent référencée via `${{Redis.REDIS_URL}}`). **Cette même URL doit être mise dans Vercel ET dans le worker.**

---

## 2. Variables d'environnement — qui va où

### 🔗 PARTAGÉES — identiques dans **Vercel** ET **Railway**
Si ces valeurs diffèrent entre les deux, ça ne marchera pas (file différente, secrets non déchiffrables, etc.).

| Variable | Note |
|---|---|
| `DATABASE_URL` | Supabase poolé (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase direct (port 5432) |
| `REDIS_URL` | **LA MÊME** instance Redis des deux côtés (critique) |
| `S3_ENDPOINT` | Supabase Storage S3 |
| `S3_REGION` | |
| `S3_BUCKET` | |
| `S3_ACCESS_KEY_ID` | |
| `S3_SECRET_ACCESS_KEY` | |
| `S3_FORCE_PATH_STYLE` | `true` |
| `LOCAL_SECRET_ENCRYPTION_KEY` | **La même valeur** des deux côtés. Le web chiffre les identifiants de capture, le worker les déchiffre. 32 octets (`openssl rand -base64 32`). |
| `APP_URL` | URL publique du web (ex. `https://demo-navy-phi.vercel.app`) |

### 🚂 WORKER uniquement — **Railway**
> Les clés LLM/TTS saisies dans l'écran **Paramètres** du web sont stockées dans le coffre côté web. **Le worker ne les lit PAS** : il lit les variables d'env ci-dessous. Pour que la génération utilise l'IA, mets-les **ici, sur Railway**.

| Variable | Exemple / défaut |
|---|---|
| `LLM_PROVIDER` | `anthropic` \| `openai` \| `none` |
| `ANTHROPIC_API_KEY` | `sk-ant-…` (si `LLM_PROVIDER=anthropic`) |
| `OPENAI_API_KEY` | `sk-…` (si `LLM_PROVIDER=openai`) |
| `TTS_PROVIDER` | `none` \| `elevenlabs` |
| `ELEVENLABS_API_KEY` | `xi-…` (si TTS = elevenlabs) |
| `HIGGSFIELD_API_KEY` | optionnel (b-roll) |
| `HIGGSFIELD_API_BASE_URL` | optionnel |
| `WORKER_CONCURRENCY` | `1` (laisse 1 : capture + rendu sont lourds) |
| `RENDER_FPS` / `RENDER_WIDTH` / `RENDER_HEIGHT` | `30` / `1920` / `1080` (défauts OK) |
| `CAPTURE_DEFAULT_WIDTH` / `CAPTURE_DEFAULT_HEIGHT` | `1440` / `900` |
| `HEARTBEAT_INTERVAL_MS` | `30000` (défaut) |

> `NODE_ENV=production` et `PLAYWRIGHT_HEADLESS=true` sont déjà fixés dans le Dockerfile. **`PORT` est injecté automatiquement par Railway** — ne le définis pas toi-même ; le `/health` écoute dessus.

### ▲ WEB uniquement — **Vercel**
| Variable | Note |
|---|---|
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | si l'auth est activée |

---

## 3. Déployer le worker sur Railway

1. **Railway → New Project → Deploy from GitHub repo** → choisis `Salim-ers/DEMO`.
2. Sur le service créé : **Settings → Root Directory = `/`** (la racine du repo — le worker a besoin des packages partagés). Railway lit `railway.json` à la racine, qui build `apps/worker/Dockerfile`.
3. **Add Redis** (étape 1) et copie son `REDIS_URL`.
4. **Variables** du service worker : ajoute toutes les variables 🔗 PARTAGÉES + 🚂 WORKER ci-dessus.
5. Dans **Vercel** : vérifie que les variables 🔗 PARTAGÉES (surtout `REDIS_URL`, `S3_*`, `LOCAL_SECRET_ENCRYPTION_KEY`) sont identiques, puis **redeploy**.
6. Railway build l'image (Chromium + Remotion, ça prend quelques minutes), puis démarre. Tu dois voir dans les logs :
   ```
   ✅ Redis connected
   ✅ DB connected
   🟢 Studio One worker online — waiting for jobs
   💓 heartbeat started
   ```
7. Le worker expose **`/health`** (utilisé par le healthcheck Railway) qui renvoie `200` tant que Redis + DB répondent.

---

## 4. Vérifier que ça marche

- Ouvre une démo → **Relancer le pipeline**. Le bandeau « Aucun worker actif » doit **disparaître** et les étapes doivent défiler (`📥 job received` → `▶️ job started` → … → `✅ job completed` dans les logs Railway).
- `GET https://<worker>.railway.app/health` → `{"status":"ok","redis":true,"db":true,...}`.

## 5. Notes ressources
Le rendu Remotion + la capture Playwright sont gourmands (RAM/CPU). Sur Railway, prévois un plan avec assez de mémoire (≥ 2 Go conseillé pour le rendu vidéo). Garde `WORKER_CONCURRENCY=1` et scale en ajoutant des replicas plutôt qu'en montant la concurrence.
