import { cn } from "../../lib/cn.js";

/** Small uppercase eyebrow with a gradient dot — used above section headings. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("eyebrow", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
      {children}
    </span>
  );
}
