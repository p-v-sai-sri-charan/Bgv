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
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { CASE_STATUS_LABELS, CASE_STATUS_TONE } from "@/lib/status-labels";

export default async function EmployerCasesPage() {
  const session = await requireSession(["EMPLOYER_ADMIN"]);

  const cases = await prisma.bgvCase.findMany({
    where: { tenantId: session.tenantId! },
    orderBy: { createdAt: "desc" },
    include: { employee: true },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification cases ({cases.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {cases.length === 0 ? (
          <p className="text-sm text-slate-500">No cases yet.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Re-verification</TableHeaderCell>
                <TableHeaderCell>Initiated</TableHeaderCell>
                <TableHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map((c) => (
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
                    {c.isReverification ? (
                      <Badge tone="info">Re-verification</Badge>
                    ) : (
                      "-"
                    )}
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
  );
}
