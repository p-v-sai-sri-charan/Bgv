import type { DocumentType } from "@/generated/prisma/client";

export type KycCheckOutcome = "VERIFIED" | "FAILED" | "MANUAL_REVIEW";

export interface KycVerificationInput {
  documentType: Extract<DocumentType, "AADHAR" | "PAN">;
  documentNumber: string;
  employeeName: string;
}

export interface KycVerificationResult {
  outcome: KycCheckOutcome;
  providerName: string;
  message: string;
  raw: Record<string, unknown>;
}

export interface KycProvider {
  name: string;
  verify(input: KycVerificationInput): Promise<KycVerificationResult>;
}
