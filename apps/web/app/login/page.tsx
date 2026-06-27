"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { LogoMark } from "../../components/brand/logo.js";

function LoginForm() {
  const params = useSearchParams();
  const nextRaw = params.get("next") || "/projects";
  // Only allow internal redirects (no open-redirect).
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/projects";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Connexion impossible.");
      }
      // Hard redirect so the new cookie is applied and the middleware re-evaluates server-side.
      window.location.assign(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="mb-8 flex items-center gap-2.5" aria-label="Studio One, accueil">
        <LogoMark tone="cream" size={40} />
        <span className="text-lg font-semibold tracking-tight text-ink">Studio One</span>
      </Link>

      <div className="card p-7">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent-deep">
          <Lock size={20} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">Espace privé</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Cet espace est réservé. Entrez votre code d’accès pour continuer.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code d’accès"
            autoFocus
            className="h-11 w-full rounded-xl border border-hairline bg-surface px-3.5 text-sm text-ink outline-none transition-colors focus:border-accent/50"
          />
          {error && <p className="rounded-lg border border-bad/30 bg-bad/10 px-3 py-2 text-sm text-bad">{error}</p>}
          <button type="submit" disabled={loading || code.trim().length === 0} className="btn-primary justify-center py-3">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Se connecter <ArrowRight size={16} />
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Pas encore client ?{" "}
        <Link href="/demo" className="font-medium text-accent-deep hover:underline">
          Voir une vidéo générée
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
