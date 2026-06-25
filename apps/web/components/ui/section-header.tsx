import { cn } from "../../lib/cn.js";

export type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow", centered && "justify-center")}>{eyebrow}</p>
      ) : null}
      <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
