import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/rbac";

export default async function EmployerLayout({
  children,
}: LayoutProps<"/employer">) {
  const session = await requireSession(["EMPLOYER_ADMIN"]);

  return (
    <DashboardShell
      title="Employer"
      navItems={[
        { href: "/employer", label: "Overview" },
        { href: "/employer/employees", label: "Employees" },
        { href: "/employer/cases", label: "Verification Cases" },
      ]}
      userName={session.name}
      userRoleLabel="Employer Admin"
    >
      {children}
    </DashboardShell>
  );
}
