import Link from "next/link";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/rbac";
import { PORTALS, PORTAL_ORDER } from "@/lib/portals";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBank,
  IconBell,
  IconBuilding,
  IconClipboardList,
  IconFactory,
  IconFuel,
  IconGauge,
  IconLayoutDashboard,
  IconRefresh,
  IconScanFace,
  IconShieldCheck,
  IconSparkles,
  IconStore,
  IconUserCog,
} from "@/components/icons";

const SECTORS = [
  { label: "MNC", note: "Comprehensive flow", icon: <IconBuilding /> },
  { label: "Mart", note: "Standard flow", icon: <IconStore /> },
  { label: "Mall", note: "Standard flow", icon: <IconStore /> },
  { label: "Bank / Finance", note: "Standard flow", icon: <IconBank /> },
  { label: "Petrol Bunk", note: "Standard flow", icon: <IconFuel /> },
  { label: "Industry", note: "Standard + local proof", icon: <IconFactory /> },
];

const STEPS = [
  {
    title: "Onboard",
    body: "Employers add employees in seconds. Each one gets a tailored document checklist based on their sector's flow.",
    icon: <IconClipboardList />,
  },
  {
    title: "Verify",
    body: "Aadhaar and PAN clear automatically through a pluggable KYC provider. Every other document routes to a human agent for sign-off.",
    icon: <IconScanFace />,
  },
  {
    title: "Re-verify",
    body: "Once complete, a case re-verifies itself every year — notifying the employee and employer by email and WhatsApp.",
    icon: <IconRefresh />,
  },
];

const FEATURES = [
  {
    title: "Automated KYC",
    body: "Aadhaar & PAN checked in real time. Swap the mock provider for Karza, Signzy, IDfy or Surepass without touching the flow.",
    icon: <IconScanFace />,
  },
  {
    title: "Human sign-off",
    body: "Address proofs, payslips, experience letters and Form-16 always land in an agent's queue with approve / reject and notes.",
    icon: <IconShieldCheck />,
  },
  {
    title: "Annual re-verification",
    body: "An idempotent daily sweep reopens completed cases 365 days on. Safe to run on Vercel Cron, system cron or GitHub Actions.",
    icon: <IconRefresh />,
  },
  {
    title: "True multi-tenancy",
    body: "Every company is isolated. Row-level scoping on every query, role-guarded routes, and a super-admin that onboards tenants.",
    icon: <IconGauge />,
  },
  {
    title: "Email + WhatsApp",
    body: "Every notification is templated and logged. Console providers out of the box; wire SendGrid/SES or the WhatsApp Cloud API when ready.",
    icon: <IconBell />,
  },
  {
    title: "Pluggable storage",
    body: "Documents write to local disk in development and to S3, R2 or GCS in production behind one small interface.",
    icon: <IconLayoutDashboard />,
  },
];

const STATS = [
  { value: "6", label: "Sectors covered" },
  { value: "13", label: "Document types" },
  { value: "2", label: "Verification flows" },
  { value: "365d", label: "Auto re-verification" },
];

const FAQ = [
  {
    q: "How is Aadhaar and PAN verified?",
    a: "Through a pluggable KYC provider interface. The platform ships with a deterministic mock that validates format and returns a result with no external calls — implement KycProvider for a real vendor and register it to go live.",
  },
  {
    q: "What still needs a human?",
    a: "Everything that isn't Aadhaar or PAN. Address proofs, qualification certificates, payslips, experience and relieving letters, Form-16, local proof and witness statements all require an agent's manual sign-off.",
  },
  {
    q: "How do the two flows differ?",
    a: "MNC tenants run the comprehensive flow — identity, address and full employment history. Mart, Mall, Bank and Petrol Bunk run the standard identity + address flow. Industry adds a local proof / witness statement on top.",
  },
  {
    q: "Is it really production-ready?",
    a: "It uses custom JWT session auth, driver-adapter Prisma, role-based route guards and a Dockerised Postgres. Every external dependency — KYC, notifications, storage — is a swappable interface with a working default.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-brand-700">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {body && <p className="mt-3 text-base text-muted">{body}</p>}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
  );
}

export default async function LandingPage() {
  const session = await getSession();
  const dashboardHref = session ? ROLE_HOME[session.role] : "/login";

  return (
    <>
      <SiteHeader isAuthed={Boolean(session)} dashboardHref={dashboardHref} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
          <div className="aurora" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] grid-texture opacity-60" />
          <Shell>
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                  <IconSparkles className="h-3.5 w-3.5 text-brand-500" />
                  Automated checks · human judgement · annual renewals
                </span>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Background verification your whole org can trust.
                </h1>
                <p className="mt-5 max-w-xl text-lg text-muted">
                  One multi-tenant platform for MNC, retail, banking, fuel and
                  industrial hiring. Aadhaar &amp; PAN clear in seconds, agents
                  sign off the rest, and every case re-verifies itself each year.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href={session ? dashboardHref : "/login"}>
                    <Button size="lg">
                      {session ? "Go to dashboard" : "Get started"}
                      <IconArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="secondary">
                      Explore the portals
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <IconShieldCheck className="h-4 w-4 text-brand-500" />
                    Role-guarded portals
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconScanFace className="h-4 w-4 text-brand-500" />
                    Pluggable KYC
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconRefresh className="h-4 w-4 text-brand-500" />
                    Idempotent re-verification
                  </span>
                </div>
              </div>
              <div className="animate-scale-in">
                <HeroVisual />
              </div>
            </div>
          </Shell>
        </section>

        {/* Sector strip */}
        <section className="border-y border-border bg-surface-muted py-8">
          <Shell>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Two flows. Six sectors. One workflow.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {SECTORS.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <span className="text-brand-600">{s.icon}</span>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </Shell>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 py-24">
          <Shell>
            <Reveal>
              <SectionHeading
                eyebrow="How it works"
                title="From offer letter to verified — and it stays that way"
                body="Three moves. The platform handles routing, reminders and renewals so your team just makes decisions."
              />
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 90}>
                  <div className="group h-full rounded-2xl border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        {step.icon}
                      </span>
                      <span className="font-mono text-sm text-border-strong">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Shell>
        </section>

        {/* Coverage */}
        <section id="flows" className="scroll-mt-20 border-y border-border bg-surface-muted py-24">
          <Shell>
            <Reveal>
              <SectionHeading
                eyebrow="Coverage"
                title="A checklist tuned to every sector"
                body="Each tenant category maps to a flow type and a required-document set. MNC hiring gets full employment history; everyone else runs lean."
              />
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SECTORS.map((sector, i) => (
                <Reveal key={sector.label} delay={i * 70}>
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      {sector.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {sector.label}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">
                        {sector.note}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Shell>
        </section>

        {/* Features */}
        <section className="py-24">
          <Shell>
            <Reveal>
              <SectionHeading
                eyebrow="Platform"
                title="Built like the product it is"
                body="Not a demo with hard-coded happy paths — every external dependency is a swappable interface with a working default."
              />
            </Reveal>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <Reveal key={feature.title} delay={(i % 3) * 80}>
                  <div className="h-full rounded-2xl border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-brand-foreground">
                      {feature.icon}
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {feature.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Shell>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-brand-900 py-16 text-white">
          <Shell>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 70} className="text-center">
                  <p className="text-4xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-brand-200">{stat.label}</p>
                </Reveal>
              ))}
            </div>
          </Shell>
        </section>

        {/* Roles */}
        <section id="roles" className="scroll-mt-20 py-24">
          <Shell>
            <Reveal>
              <SectionHeading
                eyebrow="For your team"
                title="A focused workspace for every role"
                body="Four portals, four purpose-built dashboards. Sign in through the right door and land exactly where you need to be."
              />
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {PORTAL_ORDER.map((key, i) => {
                const portal = PORTALS[key];
                const icon =
                  key === "employer" ? (
                    <IconBuilding />
                  ) : key === "employee" ? (
                    <IconClipboardList />
                  ) : key === "agent" ? (
                    <IconShieldCheck />
                  ) : (
                    <IconUserCog />
                  );
                return (
                  <Reveal key={key} delay={i * 80}>
                    <Link
                      href={`/login/${key}`}
                      className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
                    >
                      <span
                        className={cn(
                          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                          portal.accent,
                        )}
                      >
                        {icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {portal.label}
                        </span>
                        <span className="block text-[13px] text-muted-foreground">
                          {portal.tagline}
                        </span>
                      </span>
                      <IconArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-600" />
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Shell>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-y border-border bg-surface-muted py-24">
          <Shell>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <Reveal>
                <SectionHeading
                  eyebrow="FAQ"
                  title="The questions we get asked"
                />
              </Reveal>
              <Reveal delay={90}>
                <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
                  {FAQ.map((item) => (
                    <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground">
                        {item.q}
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </Shell>
        </section>

        {/* CTA */}
        <section id="contact" className="scroll-mt-20 py-24">
          <Shell>
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-border bg-brand-900 px-8 py-16 text-center text-white sm:px-16">
                <div className="aurora opacity-30" />
                <div className="relative mx-auto max-w-2xl">
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Ready to verify with confidence?
                  </h2>
                  <p className="mt-3 text-base text-brand-100">
                    Sign in with a demo account and walk every role — admin,
                    employer, employee and agent — end to end.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href="/login">
                      <Button size="lg" variant="secondary">
                        Open a portal
                        <IconArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/login/employer">
                      <Button
                        size="lg"
                        className="bg-white text-brand-700 hover:bg-brand-50"
                      >
                        Sign in as employer
                      </Button>
                    </Link>
                  </div>
                  <p className="mt-6 font-mono text-xs text-brand-200">
                    hr@acmetech.example · Passw0rd!
                  </p>
                </div>
              </div>
            </Reveal>
          </Shell>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
