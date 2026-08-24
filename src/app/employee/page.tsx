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
import { getCaseChecklist } from "@/lib/case-service";
import { TENANT_CATEGORY_LABELS } from "@/lib/flow-config";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_TONE,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_TONE,
} from "@/lib/status-labels";
import { UploadForm } from "./upload-form";

export default async function EmployeeDashboardPage() {
  const session = await requireSession(["EMPLOYEE"]);

  const employee = await prisma.employee.findUnique({
    where: { userId: session.userId },
    include: {
      tenant: true,
      cases: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!employee) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-slate-600">
            Your employee profile hasn&apos;t been set up yet. Contact your
            employer admin.
          </p>
        </CardContent>
      </Card>
    );
  }

  const [currentCase, ...historyCases] = employee.cases;
  const checklist = currentCase
    ? await getCaseChecklist(currentCase.id)
    : [];
  const isClosed =
    currentCase?.status === "COMPLETED" || currentCase?.status === "REJECTED";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {employee.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-8 text-sm">
          <div>
            <p className="text-slate-500">Employer</p>
            <p className="font-medium text-slate-900">
              {employee.tenant.name} (
              {TENANT_CATEGORY_LABELS[employee.tenant.category]})
            </p>
          </div>
          {currentCase && (
            <div>
              <p className="text-slate-500">Verification status</p>
              <Badge tone={CASE_STATUS_TONE[currentCase.status]}>
                {CASE_STATUS_LABELS[currentCase.status]}
              </Badge>
            </div>
          )}
          {currentCase?.status === "COMPLETED" &&
            currentCase.nextReverificationDueAt && (
              <div>
                <p className="text-slate-500">Next re-verification due</p>
                <p className="font-medium text-slate-900">
                  {currentCase.nextReverificationDueAt.toLocaleDateString(
                    "en-IN",
                  )}
                </p>
              </div>
            )}
        </CardContent>
      </Card>

      {currentCase && !isClosed && (
        <Card>
          <CardHeader>
            <CardTitle>Document checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {checklist.map((item) => (
              <div
                key={item.type}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    {item.label}
                  </p>
                  {item.check ? (
                    <Badge tone={DOCUMENT_STATUS_TONE[item.check.status]}>
                      {DOCUMENT_STATUS_LABELS[item.check.status]}
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Not uploaded</Badge>
                  )}
                </div>
                {item.document && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.document.fileName}
                  </p>
                )}
                {item.check?.notes &&
                  item.check.status === "REJECTED" && (
                    <p className="mt-1 text-xs text-rose-600">
                      {item.check.notes}
                    </p>
                  )}
                {(!item.check || item.check.status === "REJECTED") && (
                  <UploadForm
                    caseId={currentCase.id}
                    type={item.type}
                    requiresDocumentNumber={item.autoVerifiable}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {historyCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verification history</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Initiated</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Completed</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.initiatedAt.toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge tone={CASE_STATUS_TONE[c.status]}>
                        {CASE_STATUS_LABELS[c.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.completedAt
                        ? c.completedAt.toLocaleDateString("en-IN")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
