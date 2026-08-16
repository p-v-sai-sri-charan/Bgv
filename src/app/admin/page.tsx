import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <TenantForm />

      <Card>
        <CardHeader>
          <CardTitle>Tenants ({tenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tenants.length === 0 ? (
            <p className="text-sm text-slate-500">No tenants yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Employees</th>
                  <th className="pb-2 font-medium">Cases</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-slate-100">
                    <td className="py-2">{tenant.name}</td>
                    <td className="py-2">
                      {TENANT_CATEGORY_LABELS[tenant.category]}
                    </td>
                    <td className="py-2">{tenant._count.employees}</td>
                    <td className="py-2">{tenant._count.cases}</td>
                    <td className="py-2">
                      <Badge tone={tenant.isActive ? "success" : "neutral"}>
                        {tenant.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
