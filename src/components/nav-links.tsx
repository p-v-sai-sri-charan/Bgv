"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

function closeMobileNav() {
  const toggle = document.getElementById(
    "mobile-nav-toggle",
  ) as HTMLInputElement | null;
  if (toggle) toggle.checked = false;
}

export function NavLinks({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isNested = item.href.split("/").filter(Boolean).length > 1;
        const isActive =
          pathname === item.href ||
          (isNested && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileNav}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
