import { IconShieldCheck } from "@/components/icons";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/rbac";

export default async function AgentLayout({
  children,
}: LayoutProps<"/agent">) {
  const session = await requireSession(["AGENT"]);

  return (
    <DashboardShell
      title="Agent"
      navItems={[
        { href: "/agent", label: "Review Queue", icon: <IconShieldCheck /> },
      ]}
      userName={session.name}
      userRoleLabel="Verification Agent"
    >
      {children}
    </DashboardShell>
  );
}
