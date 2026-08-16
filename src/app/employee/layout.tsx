import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/rbac";

export default async function EmployeeLayout({
  children,
}: LayoutProps<"/employee">) {
  const session = await requireSession(["EMPLOYEE"]);

  return (
    <DashboardShell
      title="Employee"
      navItems={[{ href: "/employee", label: "My Verification" }]}
      userName={session.name}
      userRoleLabel="Employee"
    >
      {children}
    </DashboardShell>
  );
}
