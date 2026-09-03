import { Badge } from "@/components/ui/badge";
import { IconCheck, IconClock, IconScanFace, IconShieldCheck } from "@/components/icons";

const ROWS = [
  { label: "Aadhaar Card", meta: "Auto-verified · KYC", tone: "success" as const, icon: <IconScanFace className="h-4 w-4" /> },
  { label: "PAN Card", meta: "Auto-verified · KYC", tone: "success" as const, icon: <IconScanFace className="h-4 w-4" /> },
  { label: "Permanent Address Proof", meta: "Agent review", tone: "info" as const, icon: <IconShieldCheck className="h-4 w-4" /> },
  { label: "Experience Letter", meta: "Awaiting upload", tone: "warning" as const, icon: <IconClock className="h-4 w-4" /> },
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="animate-float rounded-2xl border border-border bg-surface p-5 shadow-lg"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Priya Nair</p>
            <p className="text-xs text-muted-foreground">Acme Technologies · MNC flow</p>
          </div>
          <Badge tone="info" dot>
            In review
          </Badge>
        </div>

        <div className="mt-4 space-y-2">
          {ROWS.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-3 py-2.5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-brand-600 shadow-xs">
                {row.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-foreground">
                  {row.label}
                </span>
                <span className="block text-[11px] text-muted-foreground">{row.meta}</span>
              </span>
              <Badge tone={row.tone}>{row.tone === "success" ? "Verified" : row.tone === "info" ? "Pending" : "Upload"}</Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-600 px-4 py-3 text-brand-foreground">
          <span className="text-[13px] font-medium">Verification progress</span>
          <span className="text-sm font-semibold">50%</span>
        </div>
      </div>

      <div
        className="absolute -right-4 -top-5 hidden animate-float rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-md sm:flex sm:items-center sm:gap-2"
        style={{ animationDelay: "0s" }}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <IconCheck className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs font-medium text-foreground">KYC passed in 1.2s</span>
      </div>

      <div
        className="absolute -bottom-6 -left-5 hidden animate-float rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-md sm:block"
        style={{ animationDelay: "1.1s" }}
      >
        <p className="text-xs font-medium text-foreground">Re-verifies on</p>
        <p className="text-[11px] text-muted-foreground">14 Aug 2027 · automatic</p>
      </div>
    </div>
  );
}
