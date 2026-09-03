import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
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
          <p className="text-sm text-muted">
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

  const verifiedCount = checklist.filter(
    (i) =>
      i.check?.status === "AUTO_VERIFIED" ||
      i.check?.status === "MANUAL_VERIFIED",
  ).length;
  const progress = checklist.length
    ? Math.round((verifiedCount / checklist.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${employee.fullName}`}
        description="Track your background verification and upload what's still needed."
      />

      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Employer</p>
              <p className="font-medium text-foreground">
                {employee.tenant.name} (
                {TENANT_CATEGORY_LABELS[employee.tenant.category]})
              </p>
            </div>
            {currentCase && (
              <div>
                <p className="text-muted-foreground">Verification status</p>
                <Badge tone={CASE_STATUS_TONE[currentCase.status]} dot>
                  {CASE_STATUS_LABELS[currentCase.status]}
                </Badge>
              </div>
            )}
            {currentCase?.status === "COMPLETED" &&
              currentCase.nextReverificationDueAt && (
                <div>
                  <p className="text-muted-foreground">Next re-verification</p>
                  <p className="font-medium text-foreground">
                    {currentCase.nextReverificationDueAt.toLocaleDateString(
                      "en-IN",
                    )}
                  </p>
                </div>
              )}
          </div>

          {currentCase && !isClosed && checklist.length > 0 && (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>
                  {verifiedCount} of {checklist.length} documents verified
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                <div
                  className="h-full rounded-full bg-brand-600 transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {currentCase && !isClosed && (
        <Card>
          <CardHeader>
            <CardTitle>Document checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.type}
                className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  {item.check ? (
                    <Badge tone={DOCUMENT_STATUS_TONE[item.check.status]} dot>
                      {DOCUMENT_STATUS_LABELS[item.check.status]}
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Not uploaded</Badge>
                  )}
                </div>
                {item.document && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.document.fileName}
                  </p>
                )}
                {item.check?.notes &&
                  item.check.status === "REJECTED" && (
                    <p className="mt-1.5 text-xs text-red-600">
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
              <Thead>
                <Th>Initiated</Th>
                <Th>Status</Th>
                <Th>Completed</Th>
              </Thead>
              <Tbody>
                {historyCases.map((c) => (
                  <Tr key={c.id}>
                    <Td className="text-muted-foreground">
                      {c.initiatedAt.toLocaleDateString("en-IN")}
                    </Td>
                    <Td>
                      <Badge tone={CASE_STATUS_TONE[c.status]} dot>
                        {CASE_STATUS_LABELS[c.status]}
                      </Badge>
                    </Td>
                    <Td className="text-muted-foreground">
                      {c.completedAt
                        ? c.completedAt.toLocaleDateString("en-IN")
                        : "—"}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
