"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import {
  DEMO_DURATIONS, VIDEO_FORMATS, DEMO_TONES, VOICE_MODES,
} from "@demoforge/shared";
import { Button } from "./ui/button.js";
import { Input, Textarea, Select } from "./ui/input.js";
import { cn } from "../lib/cn.js";

interface FormState {
  productName: string;
  url: string;
  targetAudience: string;
  mainPromise: string;
  durationSeconds: number;
  format: string;
  language: string;
  tone: string;
  voiceMode: string;
  loginUrl: string;
  email: string;
  password: string;
  scenario: string;
  consent: boolean;
  startNow: boolean;
}

const STEPS = ["Product", "Access & flow", "Format & voice"] as const;

const TONE_LABEL: Record<string, string> = {
  premium: "Premium",
  pedagogical: "Pedagogical",
  sales: "Sales",
  investor_demo: "Investor demo",
  onboarding: "Onboarding",
};
const VOICE_LABEL: Record<string, string> = {
  script_only: "Script only (record it yourself)",
  uploaded_human_voice: "Upload my own voice",
  tts_provider: "AI voiceover (with consent)",
};

export function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    productName: "",
    url: "",
    targetAudience: "",
    mainPromise: "",
    durationSeconds: 60,
    format: "16:9",
    language: "en",
    tone: "premium",
    voiceMode: "script_only",
    loginUrl: "",
    email: "",
    password: "",
    scenario: "",
    consent: false,
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
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const { id } = (await res.json()) as { id: string };
      if (form.startNow) {
        await fetch(`/api/projects/${id}/generate`, { method: "POST" }).catch(() => {});
      }
      router.push(`/projects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Stepper step={step} />

      <div className="card mt-6 p-6 sm:p-8">
        {step === 0 && (
          <Section title="What are we demoing?" hint="The product and the single promise the video should land.">
            <Field label="Product name">
              <Input value={form.productName} onChange={(e) => set("productName", e.target.value)} placeholder="Northwind CRM" />
            </Field>
            <Field label="App URL" hint="The live app the capture will run against.">
              <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://app.example.com" />
            </Field>
            <Field label="Audience">
              <Input
                value={form.targetAudience}
                onChange={(e) => set("targetAudience", e.target.value)}
                placeholder="RevOps leaders at B2B SaaS companies"
              />
            </Field>
            <Field label="Main promise">
              <Input
                value={form.mainPromise}
                onChange={(e) => set("mainPromise", e.target.value)}
                placeholder="Close more deals with less busywork."
              />
            </Field>
          </Section>
        )}

        {step === 1 && (
          <Section title="Access & the flow to record" hint="Credentials are encrypted in a vault — never stored in plaintext, never logged.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Login URL (optional)">
                <Input value={form.loginUrl} onChange={(e) => set("loginUrl", e.target.value)} placeholder="https://app.example.com/login" />
              </Field>
              <Field label="Demo account email (optional)">
                <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="demo@example.com" />
              </Field>
            </div>
            <Field label="Password (optional)" hint="2FA / CAPTCHA are never bypassed; you'll be prompted to finish those by hand.">
              <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" />
            </Field>
            <Field label="Scenario" hint="Plain English. One flow, a few steps — e.g. open the dashboard, then create a customer, then show analytics.">
              <Textarea
                value={form.scenario}
                onChange={(e) => set("scenario", e.target.value)}
                placeholder="Open the dashboard, then create a new customer, then show the analytics page, and end on the ROI summary."
                rows={4}
              />
            </Field>
          </Section>
        )}

        {step === 2 && (
          <Section title="Format & voice" hint="How it should look and sound. You can re-render later.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Duration">
                <Select value={form.durationSeconds} onChange={(e) => set("durationSeconds", Number(e.target.value))}>
                  {DEMO_DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} seconds
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Aspect ratio">
                <Select value={form.format} onChange={(e) => set("format", e.target.value)}>
                  {VIDEO_FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f === "16:9" ? "16:9 — landscape" : f === "9:16" ? "9:16 — vertical" : "1:1 — square"}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Tone">
                <Select value={form.tone} onChange={(e) => set("tone", e.target.value)}>
                  {DEMO_TONES.map((t) => (
                    <option key={t} value={t}>
                      {TONE_LABEL[t] ?? t}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Language">
                <Select value={form.language} onChange={(e) => set("language", e.target.value)}>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </Select>
              </Field>
            </div>
            <Field label="Voiceover">
              <Select value={form.voiceMode} onChange={(e) => set("voiceMode", e.target.value)}>
                {VOICE_MODES.map((v) => (
                  <option key={v} value={v}>
                    {VOICE_LABEL[v] ?? v}
                  </option>
                ))}
              </Select>
            </Field>

            {form.voiceMode === "tts_provider" && (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-surface p-3.5">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-accent"
                />
                <span className="text-sm text-muted">
                  I confirm I have the rights and consent to synthesize this voiceover. No voice is cloned or generated without it.
                </span>
              </label>
            )}

            <label className="mt-1 flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={form.startNow} onChange={(e) => set("startNow", e.target.checked)} className="h-4 w-4 accent-accent" />
              <span className="text-sm text-muted">Start the capture & render pipeline immediately</span>
            </label>
          </Section>
        )}

        {error && <p className="mt-5 rounded-xl border border-bad/30 bg-bad/10 px-3.5 py-2.5 text-sm text-bad">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || submitting}>
            <ArrowLeft size={16} /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {form.startNow ? "Create & generate" : "Create project"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                i < step
                  ? "border-accent bg-accent text-white"
                  : i === step
                    ? "border-accent text-accent"
                    : "border-hairline text-faint",
              )}
            >
              {i + 1}
            </span>
            <span className={cn("text-sm font-medium", i <= step ? "text-ink" : "text-faint")}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <span className={cn("h-px flex-1", i < step ? "bg-accent/60" : "bg-hairline")} />}
        </div>
      ))}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <h2 className="text-lg font-semibold tracking-tighter text-ink">{title}</h2>
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
