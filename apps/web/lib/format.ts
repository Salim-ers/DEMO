export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `il y a ${days} j`;
  return d.toLocaleDateString("fr-FR");
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Brouillon",
  capturing: "Capture",
  storyboarding: "Storyboard",
  rendering: "Génération vidéo",
  ready: "Prêt",
  failed: "Action requise",
  queued: "En attente",
  running: "En cours",
  succeeded: "Terminé",
};

export function prettyStatus(status: string): string {
  return STATUS_LABEL[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
}
