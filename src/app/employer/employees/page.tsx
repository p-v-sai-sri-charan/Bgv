import { IconUsers } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
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
      <PageHeader
        title="Employees"
        description="Onboard an employee to open their verification case automatically."
      />

      <AddEmployeeForm />

      <Card>
        <CardHeader>
          <CardTitle>Employees ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <EmptyState
              title="No employees yet"
              description="Add your first employee using the form above."
              icon={<IconUsers />}
            />
          ) : (
            <Table>
              <Thead>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Verification status</Th>
              </Thead>
              <Tbody>
                {employees.map((employee) => {
                  const latestCase = employee.cases[0];
                  return (
                    <Tr key={employee.id}>
                      <Td className="font-medium">{employee.fullName}</Td>
                      <Td className="text-muted-foreground">
                        {employee.user.email}
                      </Td>
                      <Td>
                        {latestCase ? (
                          <Badge tone={CASE_STATUS_TONE[latestCase.status]} dot>
                            {CASE_STATUS_LABELS[latestCase.status]}
                          </Badge>
                        ) : (
                          <Badge tone="neutral">No case</Badge>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
