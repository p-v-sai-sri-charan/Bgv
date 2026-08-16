import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/rbac";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const session = await requireSession(["SUPER_ADMIN"]);

  return (
    <DashboardShell
      title="Platform Admin"
      navItems={[
        { href: "/admin", label: "Tenants" },
        { href: "/admin/agents", label: "Agents" },
      ]}
      userName={session.name}
      userRoleLabel="Super Admin"
    >
      {children}
    </DashboardShell>
  );
}
