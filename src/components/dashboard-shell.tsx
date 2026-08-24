import type { ReactNode } from "react";
import { signOutAction } from "@/app/sign-out-action";
import { IconShieldCheck } from "@/components/icons";
import { NavLinks, type NavItem } from "@/components/nav-links";
import { Button } from "@/components/ui/button";

export type { NavItem };

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
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
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <input type="checkbox" id="mobile-nav-toggle" className="peer hidden" />

      <label
        htmlFor="mobile-nav-toggle"
        aria-hidden="true"
        className="fixed inset-0 z-30 hidden bg-slate-900/40 peer-checked:block md:hidden"
      />

      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out peer-checked:translate-x-0 md:static md:z-auto md:w-60 md:shrink-0 md:translate-x-0">
        <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <IconShieldCheck width={17} height={17} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              BGV Platform
            </p>
            <p className="truncate text-xs text-slate-500">{title}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <NavLinks navItems={navItems} />
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:px-6">
          <div className="flex items-center gap-3">
            <label
              htmlFor="mobile-nav-toggle"
              aria-label="Toggle navigation"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <p className="text-sm font-semibold text-slate-900 md:hidden">
              {title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{userRoleLabel}</p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initials(userName) || "?"}
            </span>
            <form action={signOutAction}>
              <Button type="submit" variant="secondary">
                Sign out
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
