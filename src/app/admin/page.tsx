import { IconBuilding } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { TENANT_CATEGORY_LABELS } from "@/lib/flow-config";
import { prisma } from "@/lib/prisma";
import { TenantForm } from "./tenant-form";

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { employees: true, cases: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant companies"
        description="Onboard companies and issue their first employer-admin login."
      />

      <TenantForm />

      <Card>
        <CardHeader>
          <CardTitle>Tenants ({tenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tenants.length === 0 ? (
            <EmptyState
              title="No tenants yet"
              description="Create your first tenant using the form above."
              icon={<IconBuilding />}
            />
          ) : (
            <Table>
              <Thead>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Employees</Th>
                <Th>Cases</Th>
                <Th>Status</Th>
              </Thead>
              <Tbody>
                {tenants.map((tenant) => (
                  <Tr key={tenant.id}>
                    <Td className="font-medium">{tenant.name}</Td>
                    <Td className="text-muted-foreground">
                      {TENANT_CATEGORY_LABELS[tenant.category]}
                    </Td>
                    <Td className="text-muted-foreground">
                      {tenant._count.employees}
                    </Td>
                    <Td className="text-muted-foreground">
                      {tenant._count.cases}
                    </Td>
                    <Td>
                      <Badge tone={tenant.isActive ? "success" : "neutral"} dot>
                        {tenant.isActive ? "Active" : "Inactive"}
                      </Badge>
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
