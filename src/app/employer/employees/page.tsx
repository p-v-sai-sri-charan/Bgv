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
import { AddEmployeeForm } from "./add-employee-form";

export default async function EmployerEmployeesPage() {
  const session = await requireSession(["EMPLOYER_ADMIN"]);

  const employees = await prisma.employee.findMany({
    where: { tenantId: session.tenantId! },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      cases: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="space-y-6">
      <AddEmployeeForm />

      <Card>
        <CardHeader>
          <CardTitle>Employees ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-sm text-slate-500">No employees yet.</p>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Verification status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => {
                  const latestCase = employee.cases[0];
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium text-slate-900">
                        {employee.fullName}
                      </TableCell>
                      <TableCell>{employee.user.email}</TableCell>
                      <TableCell>
                        {latestCase ? (
                          <Badge tone={CASE_STATUS_TONE[latestCase.status]}>
                            {CASE_STATUS_LABELS[latestCase.status]}
                          </Badge>
                        ) : (
                          <Badge tone="neutral">No case</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
