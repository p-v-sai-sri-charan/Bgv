// Import enums from the dedicated (side-effect-free) enums module rather
// than the main client entry point — the latter also pulls in the full
// PrismaClient runtime (Node builtins included), which breaks when this
// file is reached from a "use client" component's bundle.
import { DocumentType, FlowType, TenantCategory } from "@/generated/prisma/enums";

/**
 * Which flow a tenant category runs through:
 * - MNC gets the comprehensive employment-history flow (payslips, experience
 *   letter, relieving letter, Form-16 in addition to ID + address).
 * - Everyone else (Mart, Mall, Bank, Petrol Bunk, Industry) runs the standard
 *   ID + address flow. Industry additionally requires local proof / witness.
 */
export const CATEGORY_FLOW_TYPE: Record<TenantCategory, FlowType> = {
  MNC: FlowType.MNC_COMPREHENSIVE,
  MART: FlowType.STANDARD,
  MALL: FlowType.STANDARD,
  BANK: FlowType.STANDARD,
  PETROL_BUNK: FlowType.STANDARD,
  INDUSTRY: FlowType.STANDARD,
};

const BASE_IDENTITY_DOCS: DocumentType[] = [
  DocumentType.AADHAR,
  DocumentType.PAN,
  DocumentType.PASSPORT,
  DocumentType.PERMANENT_ADDRESS_PROOF,
  DocumentType.CURRENT_ADDRESS_PROOF,
  DocumentType.HIGHER_QUALIFICATION,
];

const MNC_EMPLOYMENT_DOCS: DocumentType[] = [
  DocumentType.PAYSLIP,
  DocumentType.EXPERIENCE_LETTER,
  DocumentType.RELIEVING_LETTER,
  DocumentType.FORM_16,
];

const INDUSTRY_LOCAL_DOCS: DocumentType[] = [
  DocumentType.LOCAL_PROOF,
  DocumentType.WITNESS_STATEMENT,
];

/** Required document checklist per tenant category. */
export const CATEGORY_DOCUMENT_REQUIREMENTS: Record<
  TenantCategory,
  DocumentType[]
> = {
  MNC: [...BASE_IDENTITY_DOCS, ...MNC_EMPLOYMENT_DOCS],
  MART: [...BASE_IDENTITY_DOCS],
  MALL: [...BASE_IDENTITY_DOCS],
  BANK: [...BASE_IDENTITY_DOCS],
  PETROL_BUNK: [...BASE_IDENTITY_DOCS],
  INDUSTRY: [...BASE_IDENTITY_DOCS, ...INDUSTRY_LOCAL_DOCS],
};

/** Document types that can be auto-verified through a KYC API. Everything
 * else always requires an agent's manual sign-off. */
export const AUTO_VERIFIABLE_DOCUMENT_TYPES: DocumentType[] = [
  DocumentType.AADHAR,
  DocumentType.PAN,
];

export function isAutoVerifiable(type: DocumentType): boolean {
  return AUTO_VERIFIABLE_DOCUMENT_TYPES.includes(type);
}

export function getRequiredDocuments(
  category: TenantCategory,
): DocumentType[] {
  return CATEGORY_DOCUMENT_REQUIREMENTS[category];
}

export function getFlowType(category: TenantCategory): FlowType {
  return CATEGORY_FLOW_TYPE[category];
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  AADHAR: "Aadhar Card",
  PAN: "PAN Card",
  PASSPORT: "Passport",
  PERMANENT_ADDRESS_PROOF: "Permanent Address Proof",
  CURRENT_ADDRESS_PROOF: "Current Address Proof",
  HIGHER_QUALIFICATION: "Higher Qualification Certificate",
  PAYSLIP: "Payslip",
  EXPERIENCE_LETTER: "Experience Letter",
  RELIEVING_LETTER: "Relieving Letter",
  FORM_16: "Form-16",
  LOCAL_PROOF: "Local Proof",
  WITNESS_STATEMENT: "Witness Statement",
  OTHER: "Other Document",
};

export const TENANT_CATEGORY_LABELS: Record<TenantCategory, string> = {
  MNC: "MNC",
  MART: "Mart",
  MALL: "Mall",
  BANK: "Bank / Finance",
  PETROL_BUNK: "Petrol Bunk",
  INDUSTRY: "Industry",
};

/** Cases auto-reverify annually from the date they were completed. */
export const REVERIFICATION_INTERVAL_DAYS = 365;
