import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-brand-foreground shadow-sm",
        className,
      )}
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2.5 4.5 5.4v6.1c0 4.7 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.8 7.5-9.5V5.4L12 2.5Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <path
          d="M12 2.5 4.5 5.4v6.1c0 4.7 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.8 7.5-9.5V5.4L12 2.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="m8.5 12 2.4 2.4L15.8 9.4"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Wordmark({
  className,
  subtitle,
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-foreground">
          Verifi
        </span>
        {subtitle && (
          <span className="block text-[11px] font-medium text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
