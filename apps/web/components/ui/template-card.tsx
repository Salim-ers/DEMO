import { cn } from "../../lib/cn.js";

export interface TemplateCardProps {
  title: string;
  desc: string;
  duration: string;
  ideal: string;
  className?: string;
}

export function TemplateCard({ title, desc, duration, ideal, className }: TemplateCardProps) {
  return (
    <div className={cn("card h-full p-7", className)}>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>

      <div className="mt-5 border-t border-hairline pt-4">
        <p className="text-sm text-faint">
          <span className="text-muted">Durée recommandée :</span>{" "}
          <span className="text-ink">{duration}</span>
        </p>
        <p className="mt-2 text-sm text-faint">
          <span className="text-muted">Idéal pour :</span>{" "}
          <span className="text-ink">{ideal}</span>
        </p>
      </div>
    </div>
  );
}
