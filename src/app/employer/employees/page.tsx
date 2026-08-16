import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Verification status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => {
                  const latestCase = employee.cases[0];
                  return (
                    <tr key={employee.id} className="border-b border-slate-100">
                      <td className="py-2">{employee.fullName}</td>
                      <td className="py-2">{employee.user.email}</td>
                      <td className="py-2">
                        {latestCase ? (
                          <Badge tone={CASE_STATUS_TONE[latestCase.status]}>
                            {CASE_STATUS_LABELS[latestCase.status]}
                          </Badge>
                        ) : (
                          <Badge tone="neutral">No case</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
