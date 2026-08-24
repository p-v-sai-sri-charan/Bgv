import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10",
  info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10",
  success:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/10",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10",
} as const;

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof TONES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
