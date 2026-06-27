"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Loader2, Check, ImagePlus, X, ShieldCheck, Play, KeyRound,
  MonitorPlay, Smartphone, Presentation, GraduationCap, Sparkles, PlayCircle,
  Wand2, Mic, Captions,
} from "lucide-react";
import { DEMO_DURATIONS } from "@studio-one/shared";
import { Input, Textarea, Select } from "./ui/input.js";
import { PLAN } from "../lib/pricing.js";
import { cn } from "../lib/cn.js";

const STEPS = ["Produit", "Objectif", "Style", "Format & voix", "Récap"] as const;

type Fmt = "16:9" | "9:16" | "1:1";

const VIDEO_TYPES = [
  { id: "saas_demo", label: "Démo SaaS", icon: MonitorPlay, desc: "Le parcours produit, écran par écran.", tone: "premium", style: "clean_saas", format: "16:9" as Fmt, duration: 90, scenario: "Présentez le tableau de bord, montrez la création d'un élément, ouvrez la section statistiques, puis concluez sur le gain de temps." },
  { id: "tiktok", label: "Pub TikTok / Reels", icon: Smartphone, desc: "Vertical, rythmé, fait pour le feed.", tone: "sales", style: "social_short", format: "9:16" as Fmt, duration: 30, scenario: "Accroche rapide, montrez l'écran le plus marquant, enchaînez deux ou trois bénéfices courts, terminez par un appel à l'action." },
  { id: "pitch", label: "Pitch commercial", icon: Presentation, desc: "Le bon message pour vos prospects.", tone: "investor_demo", style: "premium_motion", format: "16:9" as Fmt, duration: 60, scenario: "Posez le problème du marché, montrez la solution en action, appuyez avec une preuve concrète, puis terminez sur la vision et l'appel à l'action." },
  { id: "onboarding", label: "Onboarding produit", icon: GraduationCap, desc: "Guidez la prise en main.", tone: "onboarding", style: "clean_saas", format: "16:9" as Fmt, duration: 180, scenario: "Souhaitez la bienvenue, montrez la configuration initiale, présentez les trois actions clés à connaître, puis terminez sur les ressources d'aide." },
  { id: "teaser", label: "Teaser feature", icon: Sparkles, desc: "Annoncez une nouveauté, vite.", tone: "sales", style: "startup_launch", format: "1:1" as Fmt, duration: 30, scenario: "Rappelez le besoin en une phrase, ouvrez la nouvelle fonctionnalité, montrez-la sur un cas concret, puis concluez sur le bénéfice immédiat." },
  { id: "tutorial", label: "Tutoriel court", icon: PlayCircle, desc: "Expliquez une action clé.", tone: "pedagogical", style: "clean_saas", format: "16:9" as Fmt, duration: 60, scenario: "Annoncez l'objectif, montrez l'action étape par étape sur l'écran concerné, puis récapitulez le bénéfice en une phrase." },
] as const;

const STYLE_CARDS = [
  { id: "clean_saas", label: "Premium clean", desc: "Épuré, lisible, haut de gamme." },
  { id: "social_short", label: "TikTok dynamique", desc: "Rythmé, vertical, fait pour le feed." },
  { id: "premium_motion", label: "Corporate", desc: "Motion soigné, ton B2B rassurant." },
  { id: "luxury_product", label: "Minimal luxe", desc: "Calme, élégant, très premium." },
  { id: "startup_launch", label: "Startup punchy", desc: "Énergique, orienté lancement." },
  { id: "studio_one_cinematic", label: "Cinématique", desc: "Profondeur, plans larges, signature studio." },
] as const;

const FORMAT_CARDS: { id: Fmt; name: string; use: string; aspect: string }[] = [
  { id: "16:9", name: "Paysage", use: "Site, sales deck, YouTube", aspect: "aspect-video w-full" },
  { id: "9:16", name: "Vertical", use: "TikTok, Reels, Shorts", aspect: "aspect-[9/16] h-28" },
  { id: "1:1", name: "Carré", use: "LinkedIn, Instagram", aspect: "aspect-square h-28" },
];

const VOICE_OPTIONS = [
  { id: "script_only", label: "Script seul", desc: "Texte prêt à enregistrer avec votre voix." },
  { id: "tts_provider", label: "Voix premium", desc: "Voix off naturelle générée (ElevenLabs)." },
  { id: "uploaded_human_voice", label: "Voix uploadée", desc: "Utilisez votre propre enregistrement." },
];

const VOICE_STYLES = [
  { id: "premium", label: "Premium" },
  { id: "energetic", label: "Énergique" },
  { id: "corporate", label: "Corporate" },
  { id: "calm", label: "Calme" },
];

interface FormState {
  videoType: string;
  productName: string;
  url: string;
  targetAudience: string;
  mainPromise: string;
  durationSeconds: number;
  format: Fmt;
  language: string;
  tone: string;
  videoStyle: string;
  voiceMode: string;
  voiceStyle: string;
  hasSubtitles: boolean;
  finalCta: string;
  scenario: string;
  loginUrl: string;
  email: string;
  password: string;
  consent: boolean;
  startNow: boolean;
}

const PREVIEW_RATIO: Record<Fmt, string> = {
  "16:9": "aspect-video w-full",
  "9:16": "aspect-[9/16] h-[320px]",
  "1:1": "aspect-square h-[300px]",
};

const durLabel = (d: number) => (d >= 180 ? "3 min" : `${d} s`);

function estimateScenes(seconds: number) {
  return Math.max(5, Math.min(16, Math.round(seconds / 11)));
}

export function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [showAccess, setShowAccess] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    videoType: "saas_demo",
    productName: "",
    url: "",
    targetAudience: "",
    mainPromise: "",
    durationSeconds: 90,
    format: "16:9",
    language: "fr",
    tone: "premium",
    videoStyle: "studio_one_cinematic",
    voiceMode: "script_only",
    voiceStyle: "premium",
    hasSubtitles: true,
    finalCta: "",
    scenario: "",
    loginUrl: "",
    email: "",
    password: "",
    // Consent is an explicit opt-in: it must never be pre-granted for voice synthesis.
    consent: false,
    startNow: true,
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  function pickType(t: (typeof VIDEO_TYPES)[number]) {
    setForm((f) => ({
      ...f,
      videoType: t.id,
      tone: t.tone,
      videoStyle: t.style,
      format: t.format,
      durationSeconds: t.duration,
      scenario: f.scenario.trim().length > 0 ? f.scenario : t.scenario,
    }));
  }

  // Premium (synthesized) voice requires an explicit consent opt-in before we proceed.
  const voiceConsentOk = form.voiceMode !== "tts_provider" || form.consent;

  const canNext =
    step === 0
      ? form.productName.trim().length >= 2 &&
        /^https?:\/\//.test(form.url) &&
        form.targetAudience.trim().length >= 2 &&
        form.mainPromise.trim().length >= 2
      : step === 1
        ? form.scenario.trim().length >= 8
        : step === 3
          ? voiceConsentOk
          : true;

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      // Fold the final CTA and (for premium voice) the requested voice character into
      // the scenario brief, so they reach the worker even though they have no schema field yet.
      const styleNote =
        form.voiceMode === "tts_provider" ? `\nStyle de voix : ${form.voiceStyle}.` : "";
      const scenario =
        (form.finalCta.trim() ? `${form.scenario.trim()}\n\nCTA final : ${form.finalCta.trim()}` : form.scenario.trim()) +
        styleNote;
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productName: form.productName,
          url: form.url,
          targetAudience: form.targetAudience,
          mainPromise: form.mainPromise,
          durationSeconds: form.durationSeconds,
          format: form.format,
          language: form.language,
          tone: form.tone,
          videoStyle: form.videoStyle,
          referenceUrl: "",
          voiceMode: form.voiceMode,
          loginUrl: form.loginUrl,
          email: form.email,
          password: form.password,
          scenario,
          consent: form.consent,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Échec de la requête (${res.status})`);
      }
      const { id } = (await res.json()) as { id: string };
      if (images.length > 0) {
        const body = new FormData();
        images.forEach((f) => body.append("files", f));
        await fetch(`/api/projects/${id}/assets`, { method: "POST", body }).catch(() => {});
      }
      if (form.startNow) await fetch(`/api/projects/${id}/generate`, { method: "POST" }).catch(() => {});
      router.push(`/projects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setSubmitting(false);
    }
  }

  const typeLabel = VIDEO_TYPES.find((t) => t.id === form.videoType)?.label ?? "Démo";
  const styleLabel = STYLE_CARDS.find((s) => s.id === form.videoStyle)?.label ?? "Cinématique";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
      <div>
        <WizardStepper current={step} onJump={(i) => i < step && setStep(i)} />

        <div className="card mt-6 p-6 sm:p-8">
          {step === 0 && (
            <Section title="Quel produit doit-on transformer en vidéo ?" hint="Le produit et la promesse que la vidéo doit faire passer.">
              <Field label="Nom du produit" hint="Exemple : Horse Ledger, CRM Nova, FinPilot.">
                <Input value={form.productName} onChange={(e) => set("productName", e.target.value)} placeholder="CRM Nova" />
              </Field>
              <Field label="URL du site ou de l'application" hint="L'URL de connexion ou du tableau de bord donne les meilleurs résultats.">
                <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://app.exemple.com" />
              </Field>
              <Field label="Audience cible" hint="Exemple : équipes commerciales B2B, gestionnaires d'écuries.">
                <Input value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} placeholder="Équipes commerciales B2B" />
              </Field>
              <Field label="Promesse principale" hint="Le bénéfice en une phrase simple.">
                <Input value={form.mainPromise} onChange={(e) => set("mainPromise", e.target.value)} placeholder="Concluez plus de ventes avec moins de tâches répétitives." />
              </Field>
            </Section>
          )}

          {step === 1 && (
            <Section title="Quel est l'objectif de la vidéo ?" hint="Choisissez l'angle. Le format, la durée et le ton s'ajustent automatiquement (modifiables ensuite).">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VIDEO_TYPES.map((t) => (
                  <OptionCard key={t.id} selected={form.videoType === t.id} onClick={() => pickType(t)} icon={t.icon} title={t.label} desc={t.desc} meta={`${t.format} · ${durLabel(t.duration)}`} />
                ))}
              </div>

              <Field label="Scénario" hint="Partez du modèle pré-rempli, puis adaptez-le à votre produit.">
                <Textarea value={form.scenario} onChange={(e) => set("scenario", e.target.value)} rows={4} placeholder="Ouvrir le tableau de bord, créer un nouveau client, afficher la page d'analyses, puis conclure." />
              </Field>
              <Field label="Appel à l'action final (optionnel)" hint="La phrase de fin. Exemple : « Essayez gratuitement dès aujourd'hui. »">
                <Input value={form.finalCta} onChange={(e) => set("finalCta", e.target.value)} placeholder="Réservez une démo en 2 minutes." />
              </Field>

              <div>
                <button type="button" onClick={() => setShowAccess((v) => !v)} className="flex items-center gap-2 text-sm font-medium text-accent-deep transition-colors hover:text-champagne">
                  <KeyRound size={15} /> {showAccess ? "Masquer" : "Ajouter"} un accès démo (optionnel)
                </button>
                {showAccess && (
                  <div className="mt-4 space-y-4 rounded-xl border border-hairline bg-surface p-4">
                    <div className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent-deep" />
                      Ces accès servent uniquement à capturer le parcours demandé. Préférez un compte de démonstration avec des données fictives.
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="URL de connexion">
                        <Input value={form.loginUrl} onChange={(e) => set("loginUrl", e.target.value)} placeholder="https://app.exemple.com/login" />
                      </Field>
                      <Field label="Email du compte démo">
                        <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="demo@exemple.com" />
                      </Field>
                    </div>
                    <Field label="Mot de passe">
                      <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" />
                    </Field>
                  </div>
                )}
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Quel style doit-elle avoir ?" hint="La direction artistique. Studio One garde votre identité, change le tempo.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {STYLE_CARDS.map((s) => (
                  <OptionCard key={s.id} selected={form.videoStyle === s.id} onClick={() => set("videoStyle", s.id)} icon={Wand2} title={s.label} desc={s.desc} />
                ))}
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Quel format et quelle durée ?" hint="Le cadre et le son. Vous pourrez relancer la génération plus tard.">
              <div>
                <label className="field-label">Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {FORMAT_CARDS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => set("format", f.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                        form.format === f.id ? "border-accent/50 bg-elevated shadow-glow-accent" : "border-hairline bg-surface hover:border-accent/30",
                      )}
                    >
                      <span className={cn("grid place-items-center rounded-md border border-hairline bg-canvas-soft", f.aspect)}>
                        <Play size={14} className="text-accent-deep" fill="currentColor" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-champagne">{f.id}</span>
                      <span className="text-xs text-faint">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Durée">
                  <Select value={form.durationSeconds} onChange={(e) => set("durationSeconds", Number(e.target.value))}>
                    {DEMO_DURATIONS.map((d) => (
                      <option key={d} value={d}>{durLabel(d)}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Langue">
                  <Select value={form.language} onChange={(e) => set("language", e.target.value)}>
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </Select>
                </Field>
              </div>

              <div>
                <label className="field-label">Voix off</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {VOICE_OPTIONS.map((v) => (
                    <OptionCard key={v.id} selected={form.voiceMode === v.id} onClick={() => set("voiceMode", v.id)} icon={Mic} title={v.label} desc={v.desc} />
                  ))}
                </div>
              </div>

              {form.voiceMode === "tts_provider" && (
                <div className="space-y-3">
                  <Field label="Style de voix">
                    <div className="flex flex-wrap gap-2">
                      {VOICE_STYLES.map((v) => (
                        <button key={v.id} type="button" onClick={() => set("voiceStyle", v.id)} className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors", form.voiceStyle === v.id ? "border-accent/40 bg-accent-soft text-champagne" : "border-hairline bg-surface text-muted hover:text-ink")}>
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-surface p-3.5">
                    <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 accent-accent" />
                    <span className="text-sm text-muted">Je confirme avoir les droits et le consentement pour synthétiser cette voix off.</span>
                  </label>
                </div>
              )}

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-hairline bg-surface px-4 py-3">
                <span className="flex items-center gap-2.5 text-sm text-ink"><Captions size={16} className="text-accent-deep" /> Sous-titres synchronisés</span>
                <input type="checkbox" checked={form.hasSubtitles} onChange={(e) => set("hasSubtitles", e.target.checked)} className="h-4 w-4 accent-accent" />
              </label>
            </Section>
          )}

          {step === 4 && (
            <Section title="Résumé avant production" hint="Vérifiez, ajoutez vos visuels, puis lancez la production.">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-hairline bg-surface p-5 text-sm">
                <Row k="Produit" v={form.productName || "Votre produit"} />
                <Row k="Objectif" v={typeLabel} />
                <Row k="Style" v={styleLabel} />
                <Row k="Format" v={form.format} />
                <Row k="Durée" v={durLabel(form.durationSeconds)} />
                <Row k="Scènes" v={`~${estimateScenes(form.durationSeconds)}`} />
                <Row k="Voix" v={VOICE_OPTIONS.find((v) => v.id === form.voiceMode)?.label ?? "Script seul"} />
                <Row k="Sous-titres" v={form.hasSubtitles ? "Oui" : "Non"} />
              </dl>

              <Field label="Vos visuels (optionnel)" hint="Ajoutez des captures : elles seront intégrées à la vidéo, utile si votre app est derrière une connexion.">
                <input ref={imgInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length) setImages((xs) => [...xs, ...files]);
                    if (imgInputRef.current) imgInputRef.current.value = "";
                  }}
                />
                {images.length > 0 && (
                  <div className="mb-3 grid grid-cols-4 gap-2">
                    {images.map((f, i) => (
                      <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-hairline bg-elevated">
                        <img src={URL.createObjectURL(f)} alt={f.name} className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setImages((xs) => xs.filter((_, j) => j !== i))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-bad group-hover:opacity-100" aria-label="Retirer">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={() => imgInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-surface px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-ink">
                  <ImagePlus size={16} /> Ajouter des images
                </button>
              </Field>

              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={form.startNow} onChange={(e) => set("startNow", e.target.checked)} className="h-4 w-4 accent-accent" />
                <span className="text-sm text-muted">Lancer la production immédiatement</span>
              </label>

              <div className="flex items-center justify-between rounded-xl border border-accent/25 bg-accent-soft px-4 py-3">
                <span className="text-sm text-muted">Cette vidéo</span>
                <span className="text-sm font-semibold text-champagne">Incluse dans votre abonnement · {PLAN.includedVideos} / mois</span>
              </div>
            </Section>
          )}

          {error && <p className="mt-5 rounded-xl border border-bad/30 bg-bad/10 px-3.5 py-2.5 text-sm text-bad">{error}</p>}

          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || submitting} className="btn-ghost disabled:opacity-40">
              <ArrowLeft size={16} /> Retour
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="btn-primary disabled:opacity-40">
                Continuer <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={submitting || !voiceConsentOk} className="btn-primary disabled:opacity-60">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {form.startNow ? "Lancer la production" : "Créer la démo"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live preview */}
      <PreviewPane form={form} typeLabel={typeLabel} styleLabel={styleLabel} />
    </div>
  );
}

function PreviewPane({ form, typeLabel, styleLabel }: { form: FormState; typeLabel: string; styleLabel: string }) {
  const initial = form.productName.trim().charAt(0).toUpperCase() || "S";
  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <p className="mb-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-faint">Aperçu en direct</p>
      <div className="card overflow-hidden p-5">
        <div className="flex justify-center">
          <div className={cn("group relative grid place-items-center overflow-hidden rounded-2xl border border-hairline bg-canvas-soft shadow-soft transition-all duration-500", PREVIEW_RATIO[form.format])}>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(198,134,66,0.18),transparent_60%)]" />
            <span aria-hidden className="absolute inset-0 grain" />
            <span className="pointer-events-none absolute -bottom-6 right-2 select-none text-[5rem] font-black leading-none text-cream/10">{initial}</span>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-bronze-sheen text-studio shadow-glow-accent">
              <Play size={20} className="ml-0.5" fill="currentColor" />
            </span>
            <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-champagne backdrop-blur-sm">
              {form.format} · {durLabel(form.durationSeconds)}
            </span>
            <span className="absolute inset-x-3 bottom-3 rounded-lg bg-black/45 px-2.5 py-1.5 text-center text-xs font-medium text-champagne backdrop-blur-sm">
              {form.productName.trim() ? form.productName : "Votre produit"} · {typeLabel}
            </span>
          </div>
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-hairline pt-5 text-sm">
          <PrevRow k="Style" v={styleLabel} />
          <PrevRow k="Voix off" v={form.voiceMode === "script_only" ? "Script seul" : form.voiceMode === "tts_provider" ? `Premium · ${form.voiceStyle}` : "Voix uploadée"} />
          <PrevRow k="Sous-titres" v={form.hasSubtitles ? "Oui" : "Non"} />
          <PrevRow k="Langue" v={form.language === "fr" ? "Français" : "Anglais"} />
        </dl>
      </div>
      <p className="mt-3 px-1 text-xs leading-relaxed text-faint">
        Aperçu indicatif. La vidéo finale est produite à partir de votre vrai produit.
      </p>
    </div>
  );
}

function WizardStepper({ current, onJump }: { current: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button type="button" onClick={() => onJump(i)} disabled={i >= current} className="flex min-w-0 items-center gap-2 text-left">
              <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors", active ? "bg-accent text-studio" : done ? "bg-accent-soft text-accent-deep" : "border border-hairline text-faint")}>
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={cn("hidden truncate text-sm font-medium sm:block", active ? "text-ink" : "text-faint")}>{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className={cn("h-px flex-1 transition-colors", done ? "bg-accent/50" : "bg-hairline")} />}
          </li>
        );
      })}
    </ol>
  );
}

function OptionCard({ selected, onClick, icon: Icon, title, desc, meta }: { selected: boolean; onClick: () => void; icon: typeof Mic; title: string; desc: string; meta?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-3 rounded-2xl border p-4 pr-9 text-left transition-all",
        selected ? "border-accent/50 bg-elevated shadow-glow-accent" : "border-hairline bg-surface hover:border-accent/30 hover:bg-elevated/50",
      )}
    >
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors", selected ? "border-accent/40 bg-accent-soft text-accent-deep" : "border-hairline text-muted")}>
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-semibold text-ink">{title}</span>
          {meta && <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">{meta}</span>}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{desc}</span>
      </span>
      {selected && <Check size={16} className="absolute right-3 top-3 text-accent-deep" />}
    </button>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      {hint && <p className="mt-1.5 text-sm leading-relaxed text-muted">{hint}</p>}
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-faint">{hint}</p>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="truncate font-medium text-ink">{v}</dd>
    </div>
  );
}

function PrevRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="truncate font-medium text-ink">{v}</dd>
    </div>
  );
}
