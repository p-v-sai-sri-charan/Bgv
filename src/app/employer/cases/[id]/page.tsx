import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseChecklist } from "@/lib/case-service";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_TONE,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_TONE,
} from "@/lib/status-labels";

export default async function EmployerCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession(["EMPLOYER_ADMIN"]);
  const { id } = await params;

  const bgvCase = await prisma.bgvCase.findUnique({
    where: { id },
    include: { employee: true },
  });

  if (!bgvCase || bgvCase.tenantId !== session.tenantId) {
    notFound();
  }

  const checklist = await getCaseChecklist(id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{bgvCase.employee.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge tone={CASE_STATUS_TONE[bgvCase.status]} dot>
              {CASE_STATUS_LABELS[bgvCase.status]}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Initiated</p>
            <p className="font-medium text-foreground">
              {bgvCase.initiatedAt.toLocaleDateString("en-IN")}
            </p>
          </div>
          {bgvCase.completedAt && (
            <div>
              <p className="text-muted-foreground">Completed</p>
              <p className="font-medium text-foreground">
                {bgvCase.completedAt.toLocaleDateString("en-IN")}
              </p>
            </div>
          )}
          {bgvCase.nextReverificationDueAt && (
            <div>
              <p className="text-muted-foreground">Next re-verification</p>
              <p className="font-medium text-foreground">
                {bgvCase.nextReverificationDueAt.toLocaleDateString("en-IN")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {checklist.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.label}
                </p>
                {item.document && (
                  <p className="text-xs text-muted-foreground">
                    {item.document.fileName}
                  </p>
                )}
              </div>
              {item.check ? (
                <Badge tone={DOCUMENT_STATUS_TONE[item.check.status]}>
                  {DOCUMENT_STATUS_LABELS[item.check.status]}
                </Badge>
              ) : (
                <Badge tone="neutral">Not uploaded</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
