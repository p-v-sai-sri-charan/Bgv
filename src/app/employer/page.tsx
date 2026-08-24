import Link from "next/link";
import {
  IconClock,
  IconFileCheck,
  IconShieldCheck,
  IconUsers,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
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
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                {stat.icon}
              </span>
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Employee</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Initiated</TableHeaderCell>
                  <TableHeaderCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {recentCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-slate-900">
                      {c.employee.fullName}
                    </TableCell>
                    <TableCell>
                      <Badge tone={CASE_STATUS_TONE[c.status]}>
                        {CASE_STATUS_LABELS[c.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.initiatedAt.toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/employer/cases/${c.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
