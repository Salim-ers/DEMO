import * as React from "react";
import { cn } from "../../lib/cn.js";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-ivory hover:bg-accent-deep shadow-glow hover:shadow-soft hover:-translate-y-0.5",
  secondary: "bg-panel text-ink border border-hairline hover:border-accent/40 hover:bg-elevated",
  ghost: "text-muted hover:text-ink hover:bg-elevated",
  danger: "bg-bad/10 text-bad border border-bad/30 hover:bg-bad/20",
};
const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
