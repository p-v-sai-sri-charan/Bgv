import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { TENANT_CATEGORY_LABELS } from "@/lib/flow-config";
import { getCaseChecklist } from "@/lib/case-service";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_TONE,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_TONE,
} from "@/lib/status-labels";
import { reviewCheckAction } from "./actions";

export default async function AgentCaseReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession(["AGENT"]);
  const { id } = await params;

  const bgvCase = await prisma.bgvCase.findUnique({
    where: { id },
    include: { employee: { include: { tenant: true } } },
  });

  if (!bgvCase) {
    notFound();
  }

  const checklist = await getCaseChecklist(id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{bgvCase.employee.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-8 text-sm">
          <div>
            <p className="text-slate-500">Employer</p>
            <p className="font-medium text-slate-900">
              {bgvCase.employee.tenant.name} (
              {TENANT_CATEGORY_LABELS[bgvCase.employee.tenant.category]})
            </p>
          </div>
          <div>
            <p className="text-slate-500">Case status</p>
            <Badge tone={CASE_STATUS_TONE[bgvCase.status]}>
              {CASE_STATUS_LABELS[bgvCase.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {checklist.map((item) => {
            const needsReview =
              item.document &&
              item.check &&
              item.check.status === "PENDING" &&
              item.check.method === "MANUAL";

            return (
              <div
                key={item.type}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.label}
                    </p>
                    {item.document && (
                      <a
                        href={`/api/documents/${item.document.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        {item.document.fileName}
                      </a>
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

                {needsReview && (
                  <form
                    action={reviewCheckAction}
                    className="mt-3 flex flex-wrap items-end gap-2"
                  >
                    <input type="hidden" name="checkId" value={item.check!.id} />
                    <input type="hidden" name="caseId" value={id} />
                    <div className="min-w-48 flex-1">
                      <Textarea
                        name="notes"
                        placeholder="Notes (optional)"
                        rows={1}
                      />
                    </div>
                    <Button type="submit" name="decision" value="VERIFIED">
                      Approve
                    </Button>
                    <Button
                      type="submit"
                      name="decision"
                      value="REJECTED"
                      variant="danger"
                    >
                      Reject
                    </Button>
                  </form>
                )}

                {item.check?.status === "AUTO_VERIFIED" && (
                  <p className="mt-2 text-xs text-slate-500">
                    Auto-verified via KYC provider.
                  </p>
                )}
                {item.check?.notes && item.check.status !== "PENDING" && (
                  <p className="mt-2 text-xs text-slate-500">
                    Note: {item.check.notes}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
