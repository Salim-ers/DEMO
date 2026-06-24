"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { DEMO_DURATIONS, VIDEO_FORMATS, VOICE_MODES } from "@studio-one/shared";
import { Button } from "./ui/button.js";
import { Input, Textarea, Select } from "./ui/input.js";
import { Stepper } from "./ui/stepper.js";

interface FormState {
  productName: string;
  url: string;
  targetAudience: string;
  mainPromise: string;
  durationSeconds: number;
  format: string;
  language: string;
  tone: string;
  videoStyle: string;
  referenceUrl: string;
  voiceMode: string;
  loginUrl: string;
  email: string;
  password: string;
  scenario: string;
  consent: boolean;
  startNow: boolean;
}

const STEPS = ["Produit", "Accès & scénario", "Format & voix"] as const;

const VOICE_LABEL: Record<string, string> = {
  script_only: "Script seul",
  uploaded_human_voice: "Voix humaine (upload)",
  tts_provider: "Voix premium",
};

export function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    productName: "",
    url: "",
    targetAudience: "",
    mainPromise: "",
    durationSeconds: 90,
    format: "16:9",
    language: "fr",
    tone: "premium",
    videoStyle: "studio_one_cinematic",
    referenceUrl: "",
    // Demos default to a written script for studio / human recording — AI voice stays opt-in.
    voiceMode: "script_only",
    loginUrl: "",
    email: "",
    password: "",
    scenario: "",
    consent: true,
    startNow: true,
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    step === 0
      ? form.productName.trim().length >= 2 && /^https?:\/\//.test(form.url) && form.mainPromise.trim().length >= 2
      : step === 1
        ? form.scenario.trim().length >= 8
        : true;

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
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
      if (form.startNow) {
        await fetch(`/api/projects/${id}/generate`, { method: "POST" }).catch(() => {});
      }
      router.push(`/projects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Stepper steps={STEPS} current={step} />

      <div className="card mt-6 p-6 sm:p-8">
        {step === 0 && (
          <Section title="Produit" hint="Le produit et la promesse principale que la vidéo doit faire passer.">
            <Field label="Nom du produit">
              <Input value={form.productName} onChange={(e) => set("productName", e.target.value)} placeholder="Northwind CRM" />
            </Field>
            <Field label="URL de l’application">
              <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://app.exemple.com" />
            </Field>
            <Field label="Audience cible">
              <Input
                value={form.targetAudience}
                onChange={(e) => set("targetAudience", e.target.value)}
                placeholder="Responsables commerciaux dans des entreprises B2B"
              />
            </Field>
            <Field label="Promesse principale">
              <Input
                value={form.mainPromise}
                onChange={(e) => set("mainPromise", e.target.value)}
                placeholder="Concluez plus de ventes avec moins de tâches répétitives."
              />
            </Field>
          </Section>
        )}

        {step === 1 && (
          <Section title="Accès & scénario" hint="Ce que la vidéo doit montrer, et comment y accéder.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="URL de connexion (optionnel)">
                <Input value={form.loginUrl} onChange={(e) => set("loginUrl", e.target.value)} placeholder="https://app.exemple.com/login" />
              </Field>
              <Field label="Email du compte démo (optionnel)">
                <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="demo@exemple.com" />
              </Field>
            </div>
            <Field label="Mot de passe (optionnel)">
              <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" />
            </Field>
            <Field label="Scénario de démonstration">
              <Textarea
                value={form.scenario}
                onChange={(e) => set("scenario", e.target.value)}
                placeholder="Ouvrir le tableau de bord, créer un nouveau client, afficher la page d’analyses, et terminer sur le résumé."
                rows={4}
              />
            </Field>
            <p className="rounded-xl border border-hairline bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
              Les accès servent uniquement à capturer le parcours de démonstration. Ils ne sont jamais affichés dans la
              vidéo.
            </p>
          </Section>
        )}

        {step === 2 && (
          <Section title="Format & voix" hint="L’apparence et le son. Vous pourrez relancer la génération plus tard.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Durée">
                <Select value={form.durationSeconds} onChange={(e) => set("durationSeconds", Number(e.target.value))}>
                  {DEMO_DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d >= 180 ? "3 min" : `${d} s`}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Format">
                <Select value={form.format} onChange={(e) => set("format", e.target.value)}>
                  {VIDEO_FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f === "16:9" ? "16:9 — paysage" : f === "9:16" ? "9:16 — vertical" : "Carré (1:1)"}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Langue">
                <Select value={form.language} onChange={(e) => set("language", e.target.value)}>
                  <option value="fr">Français</option>
                </Select>
              </Field>
              <Field label="Voix">
                <Select value={form.voiceMode} onChange={(e) => set("voiceMode", e.target.value)}>
                  {VOICE_MODES.map((v) => (
                    <option key={v} value={v}>
                      {VOICE_LABEL[v] ?? v}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {form.voiceMode === "tts_provider" && (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-surface p-3.5">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-accent"
                />
                <span className="text-sm text-muted">
                  Je confirme avoir les droits et le consentement pour synthétiser cette voix off.
                </span>
              </label>
            )}

            <Field label="Vos visuels (optionnel)" hint="Ajoutez vos captures d’écran : elles seront intégrées à la vidéo, utile si votre app est derrière une connexion.">
              <input
                ref={imgInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                multiple
                className="hidden"
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(f)} alt={f.name} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((xs) => xs.filter((_, j) => j !== i))}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-bad group-hover:opacity-100"
                        aria-label="Retirer"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-surface px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-ink"
              >
                <ImagePlus size={16} /> Ajouter des images
              </button>
            </Field>

            <label className="mt-1 flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={form.startNow} onChange={(e) => set("startNow", e.target.checked)} className="h-4 w-4 accent-accent" />
              <span className="text-sm text-muted">Lancer la génération immédiatement</span>
            </label>
          </Section>
        )}

        {error && <p className="mt-5 rounded-xl border border-bad/30 bg-bad/10 px-3.5 py-2.5 text-sm text-bad">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || submitting}>
            <ArrowLeft size={16} /> Retour
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Continuer <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {form.startNow ? "Lancer la génération" : "Créer la démo"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm leading-relaxed text-muted">{hint}</p>}
      <div className="mt-6 flex flex-col gap-4">{children}</div>
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
