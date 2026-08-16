import "server-only";

import { randomUUID } from "node:crypto";
import path from "node:path";
import {
  CaseStatus,
  CheckMethod,
  DocumentStatus,
  DocumentType,
  NotificationEvent,
  type Prisma,
  UserRole,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getFlowType,
  getRequiredDocuments,
  isAutoVerifiable,
  REVERIFICATION_INTERVAL_DAYS,
  DOCUMENT_TYPE_LABELS,
} from "@/lib/flow-config";
import { kycProvider } from "@/lib/kyc";
import { assertValidUpload, storageProvider } from "@/lib/storage";
import { notifyBothChannels } from "@/lib/notifications/service";
import {
  caseCompletedEmployerTemplate,
  caseCompletedTemplate,
  caseCreatedTemplate,
  caseRejectedEmployerTemplate,
  caseRejectedTemplate,
  documentRejectedTemplate,
  reverificationCaseCreatedTemplate,
  reverificationDueEmployerTemplate,
  reverificationDueTemplate,
} from "@/lib/notifications/templates";

/** Creates a new BGV case for an employee, seeded from their tenant's category flow. */
export async function createCase(
  employeeId: string,
  opts?: { isReverification?: boolean; previousCaseId?: string },
) {
  const employee = await prisma.employee.findUniqueOrThrow({
    where: { id: employeeId },
    include: { tenant: true, user: true },
  });

  const bgvCase = await prisma.bgvCase.create({
    data: {
      tenantId: employee.tenantId,
      employeeId: employee.id,
      flowType: getFlowType(employee.tenant.category),
      status: CaseStatus.DOCS_PENDING,
      isReverification: opts?.isReverification ?? false,
      previousCaseId: opts?.previousCaseId,
    },
  });

  await notifyBothChannels({
    caseId: bgvCase.id,
    event: opts?.isReverification
      ? NotificationEvent.REVERIFICATION_CASE_CREATED
      : NotificationEvent.CASE_CREATED,
    email: employee.user.email,
    phone: employee.user.phone,
    ...(opts?.isReverification
      ? reverificationCaseCreatedTemplate(employee.fullName, employee.tenant.name)
      : caseCreatedTemplate(employee.fullName, employee.tenant.name)),
  });

  return bgvCase;
}

export interface CaseChecklistItem {
  type: DocumentType;
  label: string;
  autoVerifiable: boolean;
  document: {
    id: string;
    fileName: string;
    status: DocumentStatus;
    uploadedAt: Date;
  } | null;
  check: {
    id: string;
    status: DocumentStatus;
    method: CheckMethod;
    notes: string | null;
    verifiedAt: Date | null;
  } | null;
}

/** Per-required-document status for a case, most-recent upload per type wins. */
export async function getCaseChecklist(
  caseId: string,
): Promise<CaseChecklistItem[]> {
  const bgvCase = await prisma.bgvCase.findUniqueOrThrow({
    where: { id: caseId },
    include: {
      tenant: true,
      documents: {
        orderBy: { uploadedAt: "desc" },
        include: { check: true },
      },
    },
  });

  const requiredTypes = getRequiredDocuments(bgvCase.tenant.category);

  return requiredTypes.map((type) => {
    const document = bgvCase.documents.find((d) => d.type === type) ?? null;
    return {
      type,
      label: DOCUMENT_TYPE_LABELS[type],
      autoVerifiable: isAutoVerifiable(type),
      document: document
        ? {
            id: document.id,
            fileName: document.fileName,
            status: document.status,
            uploadedAt: document.uploadedAt,
          }
        : null,
      check: document?.check
        ? {
            id: document.check.id,
            status: document.check.status,
            method: document.check.method,
            notes: document.check.notes,
            verifiedAt: document.check.verifiedAt,
          }
        : null,
    };
  });
}

/** Re-evaluates a case's overall status from its checklist and fires completion notifications once. */
export async function evaluateCaseCompletion(caseId: string) {
  const checklist = await getCaseChecklist(caseId);

  const allVerified = checklist.every(
    (item) =>
      item.check?.status === DocumentStatus.AUTO_VERIFIED ||
      item.check?.status === DocumentStatus.MANUAL_VERIFIED,
  );
  const anyPendingManual = checklist.some(
    (item) => item.check && item.check.status === DocumentStatus.PENDING,
  );

  const bgvCase = await prisma.bgvCase.findUniqueOrThrow({
    where: { id: caseId },
    include: { employee: { include: { user: true, tenant: true } } },
  });

  if (bgvCase.status === CaseStatus.COMPLETED || bgvCase.status === CaseStatus.REJECTED) {
    return bgvCase;
  }

  if (allVerified) {
    const completedAt = new Date();
    const nextReverificationDueAt = new Date(completedAt);
    nextReverificationDueAt.setDate(
      nextReverificationDueAt.getDate() + REVERIFICATION_INTERVAL_DAYS,
    );

    const updated = await prisma.bgvCase.update({
      where: { id: caseId },
      data: {
        status: CaseStatus.COMPLETED,
        completedAt,
        nextReverificationDueAt,
      },
    });

    const { fullName } = bgvCase.employee;
    const { email, phone } = bgvCase.employee.user;
    const tenantName = bgvCase.employee.tenant.name;

    await notifyBothChannels({
      caseId,
      event: NotificationEvent.CASE_COMPLETED,
      email,
      phone,
      ...caseCompletedTemplate(fullName, tenantName),
    });

    const employerAdmins = await prisma.user.findMany({
      where: { tenantId: bgvCase.tenantId, role: UserRole.EMPLOYER_ADMIN },
    });
    for (const admin of employerAdmins) {
      await notifyBothChannels({
        caseId,
        event: NotificationEvent.CASE_COMPLETED,
        email: admin.email,
        phone: admin.phone,
        ...caseCompletedEmployerTemplate(fullName),
      });
    }

    return updated;
  }

  const nextStatus = anyPendingManual
    ? CaseStatus.MANUAL_REVIEW
    : CaseStatus.DOCS_PENDING;

  if (bgvCase.status !== nextStatus) {
    return prisma.bgvCase.update({
      where: { id: caseId },
      data: { status: nextStatus },
    });
  }

  return bgvCase;
}

/** Marks a case as rejected and notifies employee + employer admins. */
export async function rejectCase(caseId: string) {
  const bgvCase = await prisma.bgvCase.update({
    where: { id: caseId },
    data: { status: CaseStatus.REJECTED },
    include: { employee: { include: { user: true, tenant: true } } },
  });

  const { fullName } = bgvCase.employee;
  const { email, phone } = bgvCase.employee.user;

  await notifyBothChannels({
    caseId,
    event: NotificationEvent.CASE_REJECTED,
    email,
    phone,
    ...caseRejectedTemplate(fullName, bgvCase.employee.tenant.name),
  });

  const employerAdmins = await prisma.user.findMany({
    where: { tenantId: bgvCase.tenantId, role: "EMPLOYER_ADMIN" },
  });
  for (const admin of employerAdmins) {
    await notifyBothChannels({
      caseId,
      event: NotificationEvent.CASE_REJECTED,
      email: admin.email,
      phone: admin.phone,
      ...caseRejectedEmployerTemplate(fullName),
    });
  }

  return bgvCase;
}

/**
 * Handles a document upload: stores the file, records the Document +
 * VerificationCheck rows, and — for auto-verifiable types (Aadhar/PAN) —
 * runs the KYC check immediately. Everything else waits for an agent.
 */
export async function processDocumentUpload(input: {
  caseId: string;
  type: DocumentType;
  file: File;
  documentNumber?: string;
}) {
  assertValidUpload(input.file);

  const bgvCase = await prisma.bgvCase.findUniqueOrThrow({
    where: { id: input.caseId },
    include: { employee: true },
  });

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const safeName = path.basename(input.file.name).replace(/[^\w.\-]/g, "_");
  const storageKey = `${input.caseId}/${input.type}/${randomUUID()}-${safeName}`;
  await storageProvider.save(storageKey, buffer);

  const document = await prisma.document.create({
    data: {
      caseId: input.caseId,
      type: input.type,
      fileName: input.file.name,
      storageKey,
      mimeType: input.file.type,
      fileSize: input.file.size,
      status: DocumentStatus.PENDING,
    },
  });

  const method = isAutoVerifiable(input.type)
    ? CheckMethod.AUTO_API
    : CheckMethod.MANUAL;

  let check = await prisma.verificationCheck.create({
    data: {
      caseId: input.caseId,
      documentId: document.id,
      checkType: input.type,
      method,
      status: DocumentStatus.PENDING,
    },
  });

  if (method === CheckMethod.AUTO_API) {
    if (input.type !== "AADHAR" && input.type !== "PAN") {
      throw new Error("Auto-verifiable path only supports AADHAR/PAN");
    }
    const documentNumber = input.documentNumber?.trim();
    if (!documentNumber) {
      throw new Error(`${input.type} number is required for auto-verification`);
    }

    const result = await kycProvider.verify({
      documentType: input.type,
      documentNumber,
      employeeName: bgvCase.employee.fullName,
    });

    const newStatus =
      result.outcome === "VERIFIED"
        ? DocumentStatus.AUTO_VERIFIED
        : result.outcome === "MANUAL_REVIEW"
          ? DocumentStatus.PENDING
          : DocumentStatus.REJECTED;

    await prisma.document.update({
      where: { id: document.id },
      data: { status: newStatus },
    });

    check = await prisma.verificationCheck.update({
      where: { id: check.id },
      data: {
        status: newStatus,
        providerName: result.providerName,
        providerResponse: result.raw as Prisma.InputJsonValue,
        notes: result.message,
        verifiedAt: newStatus === DocumentStatus.PENDING ? null : new Date(),
        method:
          newStatus === DocumentStatus.PENDING
            ? CheckMethod.MANUAL // fell through to manual review
            : CheckMethod.AUTO_API,
      },
    });

    if (newStatus === DocumentStatus.REJECTED) {
      const employee = await prisma.employee.findUniqueOrThrow({
        where: { id: bgvCase.employeeId },
        include: { user: true },
      });
      await notifyBothChannels({
        caseId: input.caseId,
        event: NotificationEvent.DOCUMENT_REJECTED,
        email: employee.user.email,
        phone: employee.user.phone,
        ...documentRejectedTemplate(
          employee.fullName,
          DOCUMENT_TYPE_LABELS[input.type],
          result.message,
        ),
      });
    }
  }

  await evaluateCaseCompletion(input.caseId);

  return { document, check };
}

/** Agent decision on a manually-reviewed check. */
export async function agentReviewCheck(input: {
  checkId: string;
  agentUserId: string;
  decision: "VERIFIED" | "REJECTED";
  notes?: string;
}) {
  const check = await prisma.verificationCheck.findUniqueOrThrow({
    where: { id: input.checkId },
    include: { document: true },
  });

  const newStatus =
    input.decision === "VERIFIED"
      ? DocumentStatus.MANUAL_VERIFIED
      : DocumentStatus.REJECTED;

  const updatedCheck = await prisma.verificationCheck.update({
    where: { id: input.checkId },
    data: {
      status: newStatus,
      notes: input.notes,
      verifiedById: input.agentUserId,
      verifiedAt: new Date(),
    },
  });

  if (check.documentId) {
    await prisma.document.update({
      where: { id: check.documentId },
      data: { status: newStatus },
    });
  }

  if (newStatus === DocumentStatus.REJECTED) {
    const bgvCase = await prisma.bgvCase.findUniqueOrThrow({
      where: { id: check.caseId },
      include: { employee: { include: { user: true } } },
    });
    await notifyBothChannels({
      caseId: check.caseId,
      event: NotificationEvent.DOCUMENT_REJECTED,
      email: bgvCase.employee.user.email,
      phone: bgvCase.employee.user.phone,
      ...documentRejectedTemplate(
        bgvCase.employee.fullName,
        DOCUMENT_TYPE_LABELS[check.checkType],
        input.notes ?? null,
      ),
    });
  }

  await evaluateCaseCompletion(check.caseId);

  return updatedCheck;
}

/**
 * Finds completed cases whose annual re-verification is due, notifies
 * employee + employer, and opens a fresh case for each. Safe to call
 * repeatedly (e.g. from a daily cron) — each case is only processed once
 * via reverificationNotifiedAt.
 */
export async function runReverificationSweep() {
  const now = new Date();
  const dueCases = await prisma.bgvCase.findMany({
    where: {
      status: CaseStatus.COMPLETED,
      nextReverificationDueAt: { lte: now },
      reverificationNotifiedAt: null,
    },
    include: { employee: { include: { user: true, tenant: true } } },
  });

  let created = 0;
  for (const bgvCase of dueCases) {
    const dueDateLabel = bgvCase.nextReverificationDueAt!.toLocaleDateString(
      "en-IN",
    );

    await notifyBothChannels({
      caseId: bgvCase.id,
      event: NotificationEvent.REVERIFICATION_DUE,
      email: bgvCase.employee.user.email,
      phone: bgvCase.employee.user.phone,
      ...reverificationDueTemplate(bgvCase.employee.fullName, dueDateLabel),
    });

    const employerAdmins = await prisma.user.findMany({
      where: { tenantId: bgvCase.tenantId, role: UserRole.EMPLOYER_ADMIN },
    });
    for (const admin of employerAdmins) {
      await notifyBothChannels({
        caseId: bgvCase.id,
        event: NotificationEvent.REVERIFICATION_DUE,
        email: admin.email,
        phone: admin.phone,
        ...reverificationDueEmployerTemplate(
          bgvCase.employee.fullName,
          dueDateLabel,
        ),
      });
    }

    await prisma.bgvCase.update({
      where: { id: bgvCase.id },
      data: { reverificationNotifiedAt: now },
    });

    await createCase(bgvCase.employeeId, {
      isReverification: true,
      previousCaseId: bgvCase.id,
    });
    created += 1;
  }

  return { scanned: dueCases.length, created };
}
