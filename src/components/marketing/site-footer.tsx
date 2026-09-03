import Link from "next/link";
import { Wordmark } from "@/components/brand";

const LINKS = [
  {
    heading: "Product",
    items: [
      { label: "How it works", href: "#how" },
      { label: "Coverage", href: "#flows" },
      { label: "For your team", href: "#roles" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Portals",
    items: [
      { label: "Employer", href: "/login/employer" },
      { label: "Employee", href: "/login/employee" },
      { label: "Agent", href: "/login/agent" },
      { label: "Platform admin", href: "/login/admin" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "Contact", href: "#contact" },
      { label: "Security", href: "#faq" },
      { label: "Status", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Multi-tenant background verification for regulated and high-volume
            hiring across India.
          </p>
        </div>
        {LINKS.map((col) => (
          <div key={col.heading}>
            <p className="text-[13px] font-semibold text-foreground">
              {col.heading}
            </p>
            <ul className="mt-3 space-y-2">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Verifi. All rights reserved.</p>
          <p>Built on a pluggable KYC, notification and storage architecture.</p>
        </div>
      </div>
    </footer>
  );
}
