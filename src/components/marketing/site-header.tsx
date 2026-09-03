"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand";
import { IconArrowRight, IconMenu, IconX } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#flows", label: "Coverage" },
  { href: "#roles", label: "For your team" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader({
  isAuthed,
  dashboardHref,
}: {
  isAuthed: boolean;
  dashboardHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-border bg-surface/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <Link href={dashboardHref}>
              <Button size="sm">
                Dashboard
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-sunken md:hidden"
        >
          {open ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-border bg-surface px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-surface-sunken"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            {isAuthed ? (
              <Link href={dashboardHref} onClick={() => setOpen(false)}>
                <Button className="w-full">Go to dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
