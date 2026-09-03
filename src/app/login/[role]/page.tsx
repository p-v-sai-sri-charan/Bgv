import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth-shell";
import {
  IconBuilding,
  IconClipboardList,
  IconShieldCheck,
  IconUserCog,
} from "@/components/icons";
import { PORTALS, isPortalKey, type PortalKey } from "@/lib/portals";
import { cn } from "@/lib/utils";
import { LoginForm } from "../login-form";

const PORTAL_ICON: Record<PortalKey, ReactNode> = {
  employer: <IconBuilding />,
  employee: <IconClipboardList />,
  agent: <IconShieldCheck />,
  admin: <IconUserCog />,
};

export async function generateStaticParams() {
  return Object.keys(PORTALS).map((role) => ({ role }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  if (!isPortalKey(role)) return { title: "Sign in" };
  return { title: `${PORTALS[role].label} sign in` };
}

export default async function PortalLoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!isPortalKey(role)) notFound();
  const portal = PORTALS[role];

  return (
    <AuthShell>
      <div className="mb-8">
        <span
          className={cn(
            "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl",
            portal.accent,
          )}
        >
          {PORTAL_ICON[role]}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {portal.name} sign in
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{portal.tagline}</p>
      </div>

      <LoginForm portal={portal} />

      <div className="mt-8 rounded-xl border border-border bg-surface-muted p-4 text-[13px] text-muted">
        <p className="font-medium text-foreground">Demo account</p>
        <p className="mt-1">
          <span className="font-mono text-foreground">{portal.sampleEmail}</span>{" "}
          · password <span className="font-mono text-foreground">Passw0rd!</span>
        </p>
        <Link
          href="/login"
          className="mt-2 inline-block font-medium text-brand-600 hover:text-brand-700"
        >
          See all portals
        </Link>
      </div>
    </AuthShell>
  );
}
