import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/sign-out-action";
import { Button } from "@/components/ui/button";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
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
    <div className="flex min-h-screen w-full bg-white">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="text-sm font-semibold text-slate-900">BGV Platform</p>
          <p className="text-xs text-slate-500">{title}</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="text-blue-900">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <p className="text-sm font-medium text-slate-900 md:hidden">
            {title}
          </p>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {userName}
              </p>
              <p className="text-xs text-slate-500">{userRoleLabel}</p>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="secondary">
                Sign out
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
