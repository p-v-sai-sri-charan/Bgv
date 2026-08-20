import {
  IconFileCheck,
  IconLayoutDashboard,
  IconUsers,
} from "@/components/icons";
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
        { href: "/employer", label: "Overview", icon: <IconLayoutDashboard /> },
        { href: "/employer/employees", label: "Employees", icon: <IconUsers /> },
        {
          href: "/employer/cases",
          label: "Verification Cases",
          icon: <IconFileCheck />,
        },
      ]}
      userName={session.name}
      userRoleLabel="Employer Admin"
    >
      {children}
    </DashboardShell>
  );
}
