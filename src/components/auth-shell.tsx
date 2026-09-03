import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand";
import { IconArrowRight, IconCheck } from "@/components/icons";

const HIGHLIGHTS = [
  "Automated Aadhar & PAN checks",
  "Human agent sign-off on every other document",
  "Annual re-verification, on autopilot",
];

/**
 * Split-screen shell for every auth screen: a static brand panel on the left,
 * the interactive content (chooser or form) on the right.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="relative hidden overflow-hidden bg-brand-900 px-12 py-14 text-white lg:flex lg:w-[42%] lg:flex-col lg:justify-between xl:px-16">
        <div className="aurora opacity-40" />
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-[0.14]" />
        <div className="relative">
          <Link href="/" className="inline-flex">
            <Wordmark className="[&_span]:text-white" />
          </Link>
        </div>
        <div className="relative max-w-md animate-fade-up">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Background verification your whole org can trust.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-brand-100">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <IconCheck className="h-3.5 w-3.5 text-white" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-brand-200 transition-colors hover:text-white"
          >
            <IconArrowRight className="h-4 w-4 rotate-180" />
            Back to home
          </Link>
        </div>
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 grid-texture opacity-40 lg:hidden" />
        <div className="relative w-full max-w-md animate-fade-up">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex">
              <Wordmark />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
