import type { UserRole } from "@/generated/prisma/enums";

export type PortalKey = "admin" | "employer" | "employee" | "agent";

export interface Portal {
  key: PortalKey;
  role: UserRole;
  /** Short label, e.g. "Employer". */
  label: string;
  /** Used in headings: "Employer sign in". */
  name: string;
  tagline: string;
  /** Where the user lands after a successful sign in. */
  home: string;
  /** Prefilled hint shown on the login screen (seed account). */
  sampleEmail: string;
  /** Tailwind icon accent classes. */
  accent: string;
}

export const PORTALS: Record<PortalKey, Portal> = {
  admin: {
    key: "admin",
    role: "SUPER_ADMIN",
    label: "Platform Admin",
    name: "Platform administrator",
    tagline: "Onboard tenant companies and verification agents.",
    home: "/admin",
    sampleEmail: "admin@bgv.example",
    accent: "bg-brand-600 text-brand-foreground",
  },
  employer: {
    key: "employer",
    role: "EMPLOYER_ADMIN",
    label: "Employer",
    name: "Employer admin",
    tagline: "Onboard employees and track every verification case.",
    home: "/employer",
    sampleEmail: "hr@acmetech.example",
    accent: "bg-emerald-600 text-white",
  },
  employee: {
    key: "employee",
    role: "EMPLOYEE",
    label: "Employee",
    name: "Employee",
    tagline: "Upload your documents and follow your verification checklist.",
    home: "/employee",
    sampleEmail: "newhire@acme-technologies.example",
    accent: "bg-amber-500 text-white",
  },
  agent: {
    key: "agent",
    role: "AGENT",
    label: "Verification Agent",
    name: "Verification agent",
    tagline: "Work the manual review queue and sign off documents.",
    home: "/agent",
    sampleEmail: "agent1@bgv.example",
    accent: "bg-violet-600 text-white",
  },
};

export const PORTAL_ORDER: PortalKey[] = [
  "employer",
  "employee",
  "agent",
  "admin",
];

export const ROLE_TO_PORTAL: Record<UserRole, PortalKey> = {
  SUPER_ADMIN: "admin",
  EMPLOYER_ADMIN: "employer",
  EMPLOYEE: "employee",
  AGENT: "agent",
};

export function isPortalKey(value: unknown): value is PortalKey {
  return (
    value === "admin" ||
    value === "employer" ||
    value === "employee" ||
    value === "agent"
  );
}
