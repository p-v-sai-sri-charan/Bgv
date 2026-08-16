import type { CaseStatus, DocumentStatus } from "@/generated/prisma/client";

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  DRAFT: "Draft",
  DOCS_PENDING: "Documents Pending",
  IN_REVIEW: "In Review",
  MANUAL_REVIEW: "Manual Review",
  FLAGGED: "Flagged",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

export const CASE_STATUS_TONE: Record<
  CaseStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  DRAFT: "neutral",
  DOCS_PENDING: "info",
  IN_REVIEW: "info",
  MANUAL_REVIEW: "warning",
  FLAGGED: "danger",
  COMPLETED: "success",
  REJECTED: "danger",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  PENDING: "Pending",
  AUTO_VERIFIED: "Auto-Verified",
  MANUAL_VERIFIED: "Verified",
  REJECTED: "Rejected",
  FLAGGED: "Flagged",
};

export const DOCUMENT_STATUS_TONE: Record<
  DocumentStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  PENDING: "warning",
  AUTO_VERIFIED: "success",
  MANUAL_VERIFIED: "success",
  REJECTED: "danger",
  FLAGGED: "danger",
};
