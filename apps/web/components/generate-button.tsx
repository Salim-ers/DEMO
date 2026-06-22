"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play, RotateCw } from "lucide-react";
import { Button } from "./ui/button.js";

export function GenerateButton({ projectId, hasRun }: { projectId: string; hasRun: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/generate`, { method: "POST" });
      router.refresh();
    } finally {
      // Keep the spinner briefly; the page refresh will re-render with live status.
      setTimeout(() => setLoading(false), 1200);
    }
  }

  return (
    <Button onClick={go} disabled={loading} variant={hasRun ? "secondary" : "primary"}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : hasRun ? <RotateCw size={16} /> : <Play size={16} />}
      {hasRun ? "Re-run pipeline" : "Generate demo"}
    </Button>
  );
}
