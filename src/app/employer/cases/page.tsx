import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-2 font-medium">Employee</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Re-verification</th>
                <th className="pb-2 font-medium">Initiated</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-slate-100">
                  <td className="py-2">{c.employee.fullName}</td>
                  <td className="py-2">
                    <Badge tone={CASE_STATUS_TONE[c.status]}>
                      {CASE_STATUS_LABELS[c.status]}
                    </Badge>
                  </td>
                  <td className="py-2">
                    {c.isReverification ? (
                      <Badge tone="info">Re-verification</Badge>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2">
                    {c.initiatedAt.toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/employer/cases/${c.id}`}
                      className="text-sm font-medium text-slate-700 hover:underline"
                    >
                      View
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
