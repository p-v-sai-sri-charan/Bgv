import Link from "next/link";
import { IconFileCheck } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
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
    <div className="space-y-6">
      <PageHeader
        title="Verification cases"
        description="Every case for your organisation, newest first."
      />

      <Card>
        <CardHeader>
          <CardTitle>Cases ({cases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <EmptyState
              title="No cases yet"
              description="Onboard an employee to open the first verification case."
              icon={<IconFileCheck />}
            />
          ) : (
            <Table>
              <Thead>
                <Th>Employee</Th>
                <Th>Status</Th>
                <Th>Re-verification</Th>
                <Th>Initiated</Th>
                <Th className="text-right">Case</Th>
              </Thead>
              <Tbody>
                {cases.map((c) => (
                  <Tr key={c.id}>
                    <Td className="font-medium">{c.employee.fullName}</Td>
                    <Td>
                      <Badge tone={CASE_STATUS_TONE[c.status]} dot>
                        {CASE_STATUS_LABELS[c.status]}
                      </Badge>
                    </Td>
                    <Td>
                      {c.isReverification ? (
                        <Badge tone="info">Re-verification</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
