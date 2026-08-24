import Link from "next/link";
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
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Employer</TableHeaderCell>
                <TableHeaderCell>Pending items</TableHeaderCell>
                <TableHeaderCell>Waiting since</TableHeaderCell>
                <TableHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.caseId}>
                  <TableCell className="font-medium text-slate-900">
                    {row.employeeName}
                  </TableCell>
                  <TableCell>
                    {row.tenantName}{" "}
                    <Badge tone="neutral" className="ml-1">
                      {row.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{row.oldest.toLocaleDateString("en-IN")}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/agent/cases/${row.caseId}`}
                      className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Review
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
