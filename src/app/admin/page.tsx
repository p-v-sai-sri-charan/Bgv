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
import { TenantForm } from "./tenant-form";

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { employees: true, cases: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Tenants
        </h1>
        <p className="text-sm text-slate-500">
          Onboard and manage tenant organizations on the platform.
        </p>
      </div>

      <TenantForm />

      <Card>
        <CardHeader>
          <CardTitle>Tenants ({tenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tenants.length === 0 ? (
            <p className="text-sm text-slate-500">No tenants yet.</p>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Category</TableHeaderCell>
                  <TableHeaderCell>Employees</TableHeaderCell>
                  <TableHeaderCell>Cases</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium text-slate-900">
                      {tenant.name}
                    </TableCell>
                    <TableCell>
                      {TENANT_CATEGORY_LABELS[tenant.category]}
                    </TableCell>
                    <TableCell>{tenant._count.employees}</TableCell>
                    <TableCell>{tenant._count.cases}</TableCell>
                    <TableCell>
                      <Badge tone={tenant.isActive ? "success" : "neutral"}>
                        {tenant.isActive ? "Active" : "Inactive"}
                      </Badge>
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
