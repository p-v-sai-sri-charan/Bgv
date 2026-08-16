import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TENANT_CATEGORY_LABELS } from "@/lib/flow-config";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";

export default async function AgentQueuePage() {
  await requireSession(["AGENT"]);

  const pendingChecks = await prisma.verificationCheck.findMany({
    where: { status: "PENDING", method: "MANUAL" },
    include: {
      case: { include: { employee: { include: { tenant: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  const byCase = new Map<
    string,
    {
      caseId: string;
      employeeName: string;
      tenantName: string;
      category: string;
      count: number;
      oldest: Date;
    }
  >();

  for (const check of pendingChecks) {
    const existing = byCase.get(check.caseId);
    if (existing) {
      existing.count += 1;
      if (check.createdAt < existing.oldest) existing.oldest = check.createdAt;
    } else {
      byCase.set(check.caseId, {
        caseId: check.caseId,
        employeeName: check.case.employee.fullName,
        tenantName: check.case.employee.tenant.name,
        category:
          TENANT_CATEGORY_LABELS[check.case.employee.tenant.category],
        count: 1,
        oldest: check.createdAt,
      });
    }
  }

  const rows = Array.from(byCase.values()).sort(
    (a, b) => a.oldest.getTime() - b.oldest.getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending manual review ({rows.length} cases)</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nothing waiting for manual review right now.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-2 font-medium">Employee</th>
                <th className="pb-2 font-medium">Employer</th>
                <th className="pb-2 font-medium">Pending items</th>
                <th className="pb-2 font-medium">Waiting since</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.caseId} className="border-b border-slate-100">
                  <td className="py-2">{row.employeeName}</td>
                  <td className="py-2">
                    {row.tenantName}{" "}
                    <Badge tone="neutral" className="ml-1">
                      {row.category}
                    </Badge>
                  </td>
                  <td className="py-2">{row.count}</td>
                  <td className="py-2">
                    {row.oldest.toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/agent/cases/${row.caseId}`}
                      className="text-sm font-medium text-slate-700 hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
