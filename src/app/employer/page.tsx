import Link from "next/link";
import {
  IconClock,
  IconFileCheck,
  IconShieldCheck,
  IconUsers,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { CASE_STATUS_LABELS, CASE_STATUS_TONE } from "@/lib/status-labels";

export default async function EmployerOverviewPage() {
  const session = await requireSession(["EMPLOYER_ADMIN"]);
  const tenantId = session.tenantId!;

  const [tenant, employeeCount, statusCounts, recentCases] =
    await Promise.all([
      prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } }),
      prisma.employee.count({ where: { tenantId } }),
      prisma.bgvCase.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: { _all: true },
      }),
      prisma.bgvCase.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { employee: true },
      }),
    ]);

  const countFor = (status: string) =>
    statusCounts.find((s) => s.status === status)?._count._all ?? 0;

  const stats = [
    { label: "Total employees", value: employeeCount, icon: <IconUsers /> },
    {
      label: "Documents pending",
      value: countFor("DOCS_PENDING"),
      icon: <IconClock />,
    },
    {
      label: "In manual review",
      value: countFor("MANUAL_REVIEW"),
      icon: <IconShieldCheck />,
    },
    {
      label: "Completed",
      value: countFor("COMPLETED"),
      icon: <IconFileCheck />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          {tenant.name}
        </h1>
        <p className="text-sm text-slate-500">Verification overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start justify-between py-5">
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
              <span className="text-blue-900">{stat.icon}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent verification cases</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCases.length === 0 ? (
            <p className="text-sm text-slate-500">No cases yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 font-medium">Employee</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Initiated</th>
                  <th className="pb-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {recentCases.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-2">{c.employee.fullName}</td>
                    <td className="py-2">
                      <Badge tone={CASE_STATUS_TONE[c.status]}>
                        {CASE_STATUS_LABELS[c.status]}
                      </Badge>
                    </td>
                    <td className="py-2">
                      {c.initiatedAt.toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-2 text-right">
                      <Link
                        href={`/employer/cases/${c.id}`}
                        className="text-sm font-medium text-slate-700 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
