import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth-shell";
import {
  IconArrowRight,
  IconBuilding,
  IconClipboardList,
  IconShieldCheck,
  IconUserCog,
} from "@/components/icons";
import { PORTALS, PORTAL_ORDER, type PortalKey } from "@/lib/portals";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Sign in" };

const PORTAL_ICON: Record<PortalKey, ReactNode> = {
  employer: <IconBuilding />,
  employee: <IconClipboardList />,
  agent: <IconShieldCheck />,
  admin: <IconUserCog />,
};

export default function LoginChooserPage() {
  return (
    <AuthShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Sign in to Verifi
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pick the workspace that matches your role.
        </p>
      </div>

      <div className="space-y-3">
        {PORTAL_ORDER.map((key, i) => {
          const portal = PORTALS[key];
          return (
            <Link
              key={key}
              href={`/login/${key}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                "group flex animate-fade-up items-center gap-4 rounded-xl border border-border bg-surface p-4",
                "shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out",
                "hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                  portal.accent,
                )}
              >
                {PORTAL_ICON[key]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {portal.label}
                </span>
                <span className="block truncate text-[13px] text-muted-foreground">
                  {portal.tagline}
                </span>
              </span>
              <IconArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-600" />
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New company?{" "}
        <Link
          href="/#contact"
          className="font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Talk to us about onboarding
        </Link>
      </p>
    </AuthShell>
  );
}
