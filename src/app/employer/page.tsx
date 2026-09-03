import Link from "next/link";
import {
  IconArrowRight,
  IconClock,
  IconFileCheck,
  IconShieldCheck,
  IconUsers,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
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
      <PageHeader title={tenant.name} description="Verification overview" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} interactive>
            <CardContent className="flex items-start justify-between py-5">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                {stat.icon}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent verification cases</CardTitle>
          <Link
            href="/employer/cases"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            All cases
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentCases.length === 0 ? (
            <EmptyState
              title="No cases yet"
              description="Cases appear here as soon as you onboard an employee."
              icon={<IconFileCheck />}
            />
          ) : (
            <Table>
              <Thead>
                <Th>Employee</Th>
                <Th>Status</Th>
                <Th>Initiated</Th>
                <Th className="text-right">Case</Th>
              </Thead>
              <Tbody>
                {recentCases.map((c) => (
                  <Tr key={c.id}>
                    <Td className="font-medium">{c.employee.fullName}</Td>
                    <Td>
                      <Badge tone={CASE_STATUS_TONE[c.status]} dot>
                        {CASE_STATUS_LABELS[c.status]}
                      </Badge>
                    </Td>
                    <Td className="text-muted-foreground">
                      {c.initiatedAt.toLocaleDateString("en-IN")}
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/employer/cases/${c.id}`}
                        className="text-[13px] font-medium text-brand-600 hover:text-brand-700"
                      >
                        View
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
