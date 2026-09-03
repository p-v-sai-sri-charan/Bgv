import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-surface-sunken text-muted ring-border-strong",
  info: "bg-brand-50 text-brand-700 ring-brand-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
} as const;

const DOT = {
  neutral: "bg-muted-foreground",
  info: "bg-brand-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
} as const;

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: keyof typeof TONES;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", DOT[tone])} />
      )}
      {children}
    </span>
  );
}
