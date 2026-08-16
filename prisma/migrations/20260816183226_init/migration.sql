-- CreateEnum
CREATE TYPE "TenantCategory" AS ENUM ('MNC', 'MART', 'MALL', 'BANK', 'PETROL_BUNK', 'INDUSTRY');

-- CreateEnum
CREATE TYPE "FlowType" AS ENUM ('MNC_COMPREHENSIVE', 'STANDARD');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'EMPLOYER_ADMIN', 'EMPLOYEE', 'AGENT');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('DRAFT', 'DOCS_PENDING', 'IN_REVIEW', 'MANUAL_REVIEW', 'FLAGGED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('AADHAR', 'PAN', 'PERMANENT_ADDRESS_PROOF', 'CURRENT_ADDRESS_PROOF', 'PAYSLIP', 'EXPERIENCE_LETTER', 'RELIEVING_LETTER', 'FORM_16', 'LOCAL_PROOF', 'WITNESS_STATEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'AUTO_VERIFIED', 'MANUAL_VERIFIED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "CheckMethod" AS ENUM ('AUTO_API', 'MANUAL');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationEvent" AS ENUM ('CASE_CREATED', 'DOCUMENT_UPLOADED', 'DOCUMENT_REJECTED', 'CASE_COMPLETED', 'CASE_REJECTED', 'REVERIFICATION_DUE', 'REVERIFICATION_CASE_CREATED');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "TenantCategory" NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "tenantId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "aadharNumber" TEXT,
    "panNumber" TEXT,
    "permanentAddress" TEXT,
    "currentAddress" TEXT,
    "dateOfJoining" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BgvCase" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "flowType" "FlowType" NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'DRAFT',
    "isReverification" BOOLEAN NOT NULL DEFAULT false,
    "previousCaseId" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "nextReverificationDueAt" TIMESTAMP(3),
    "reverificationNotifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BgvCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCheck" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "documentId" TEXT,
    "checkType" "DocumentType" NOT NULL,
    "method" "CheckMethod" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "providerName" TEXT,
    "providerResponse" JSONB,
    "notes" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentAssignment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),

    CONSTRAINT "AgentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "event" "NotificationEvent" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_category_idx" ON "Tenant"("category");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "Employee_tenantId_idx" ON "Employee"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "BgvCase_previousCaseId_key" ON "BgvCase"("previousCaseId");

-- CreateIndex
CREATE INDEX "BgvCase_tenantId_status_idx" ON "BgvCase"("tenantId", "status");

-- CreateIndex
CREATE INDEX "BgvCase_employeeId_idx" ON "BgvCase"("employeeId");

-- CreateIndex
CREATE INDEX "BgvCase_nextReverificationDueAt_idx" ON "BgvCase"("nextReverificationDueAt");

-- CreateIndex
CREATE INDEX "Document_caseId_idx" ON "Document"("caseId");

-- CreateIndex
CREATE INDEX "Document_caseId_type_idx" ON "Document"("caseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCheck_documentId_key" ON "VerificationCheck"("documentId");

-- CreateIndex
CREATE INDEX "VerificationCheck_caseId_idx" ON "VerificationCheck"("caseId");

-- CreateIndex
CREATE INDEX "VerificationCheck_status_idx" ON "VerificationCheck"("status");

-- CreateIndex
CREATE INDEX "AgentAssignment_caseId_idx" ON "AgentAssignment"("caseId");

-- CreateIndex
CREATE INDEX "AgentAssignment_agentId_idx" ON "AgentAssignment"("agentId");

-- CreateIndex
CREATE INDEX "NotificationLog_caseId_idx" ON "NotificationLog"("caseId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BgvCase" ADD CONSTRAINT "BgvCase_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BgvCase" ADD CONSTRAINT "BgvCase_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BgvCase" ADD CONSTRAINT "BgvCase_previousCaseId_fkey" FOREIGN KEY ("previousCaseId") REFERENCES "BgvCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "BgvCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCheck" ADD CONSTRAINT "VerificationCheck_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "BgvCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCheck" ADD CONSTRAINT "VerificationCheck_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCheck" ADD CONSTRAINT "VerificationCheck_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentAssignment" ADD CONSTRAINT "AgentAssignment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "BgvCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentAssignment" ADD CONSTRAINT "AgentAssignment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "BgvCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
