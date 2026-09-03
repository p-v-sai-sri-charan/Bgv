"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOutAction } from "@/app/sign-out-action";
import { Wordmark } from "@/components/brand";
import { IconMenu, IconX } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

function isActive(pathname: string, href: string) {
  if (href === pathname) return true;
  // Treat the first nav item (dashboard root) as exact-only.
  const segments = href.split("/").filter(Boolean);
  if (segments.length <= 1) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  navItems,
  pathname,
  onNavigate,
}: {
  navItems: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
              active
                ? "bg-brand-50 text-brand-700"
                : "text-muted hover:bg-surface-sunken hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "transition-colors",
                active ? "text-brand-600" : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              {item.icon}
            </span>
            {item.label}
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  title,
  navItems,
  userName,
  userRoleLabel,
  children,
}: {
  title: string;
  navItems: NavItem[];
  userName: string;
  userRoleLabel: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen w-full bg-surface-muted">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
        <div className="border-b border-border px-5 py-5">
          <Link href="/">
            <Wordmark subtitle={title} />
          </Link>
        </div>
        <NavLinks navItems={navItems} pathname={pathname} />
        <div className="border-t border-border px-3 py-3">
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-brand-900/40 animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-surface shadow-lg animate-fade-in">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Wordmark subtitle={title} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-sunken"
              >
                <IconX />
              </button>
            </div>
            <NavLinks
              navItems={navItems}
              pathname={pathname}
              onNavigate={() => setDrawerOpen(false)}
            />
            <div className="border-t border-border px-3 py-3">
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface/85 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-surface-sunken md:hidden"
            >
              <IconMenu />
            </button>
            <p className="text-sm font-semibold text-foreground md:hidden">{title}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userRoleLabel}</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-brand-foreground">
              {initials}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div key={pathname} className="mx-auto max-w-5xl animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
