import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  CaseStatus,
  CheckMethod,
  DocumentStatus,
  TenantCategory,
} from "../src/generated/prisma/client";
import {
  getFlowType,
  getRequiredDocuments,
  isAutoVerifiable,
} from "../src/lib/flow-config";
import { prisma } from "../src/lib/prisma";
import { LocalStorageProvider } from "../src/lib/storage/local-provider";

// Seed runs under plain tsx/Node, not the Next.js bundler, so it can't
// import modules guarded by "server-only" (lib/auth, lib/storage) — those
// throw outside a react-server bundling context. Use the concrete
// implementations directly instead of the guarded barrels.
function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

const storageProvider = new LocalStorageProvider(
  process.env.STORAGE_LOCAL_DIR ?? "./storage",
);

const SEED_PASSWORD = "Passw0rd!";

interface TenantSeed {
  name: string;
  slug: string;
  category: TenantCategory;
  contactEmail: string;
  adminEmail: string;
}

const TENANT_SEEDS: TenantSeed[] = [
  {
    name: "Acme Technologies",
    slug: "acme-technologies",
    category: TenantCategory.MNC,
    contactEmail: "hr@acmetech.example",
    adminEmail: "hr@acmetech.example",
  },
  {
    name: "QuickMart Retail",
    slug: "quickmart-retail",
    category: TenantCategory.MART,
    contactEmail: "hr@quickmart.example",
    adminEmail: "hr@quickmart.example",
  },
  {
    name: "CityCenter Mall",
    slug: "citycenter-mall",
    category: TenantCategory.MALL,
    contactEmail: "hr@citycentermall.example",
    adminEmail: "hr@citycentermall.example",
  },
  {
    name: "Sunrise Bank",
    slug: "sunrise-bank",
    category: TenantCategory.BANK,
    contactEmail: "hr@sunrisebank.example",
    adminEmail: "hr@sunrisebank.example",
  },
  {
    name: "Highway Fuel Station",
    slug: "highway-fuel-station",
    category: TenantCategory.PETROL_BUNK,
    contactEmail: "hr@highwayfuel.example",
    adminEmail: "hr@highwayfuel.example",
  },
  {
    name: "Precision Industries",
    slug: "precision-industries",
    category: TenantCategory.INDUSTRY,
    contactEmail: "hr@precisionindustries.example",
    adminEmail: "hr@precisionindustries.example",
  },
];

async function seedDocument(
  caseId: string,
  type: Parameters<typeof isAutoVerifiable>[0],
  status: DocumentStatus,
  opts?: { verifiedById?: string; notes?: string },
) {
  const storageKey = `${caseId}/${type}/seed.pdf`;
  await storageProvider.save(storageKey, Buffer.from(`Seed document: ${type}`));

  const document = await prisma.document.create({
    data: {
      caseId,
      type,
      fileName: `${type.toLowerCase()}.pdf`,
      storageKey,
      mimeType: "application/pdf",
      fileSize: 32,
      status,
    },
  });

  const method = isAutoVerifiable(type)
    ? CheckMethod.AUTO_API
    : CheckMethod.MANUAL;

  await prisma.verificationCheck.create({
    data: {
      caseId,
      documentId: document.id,
      checkType: type,
      method,
      status,
      providerName: method === CheckMethod.AUTO_API ? "mock" : undefined,
      verifiedById: opts?.verifiedById,
      verifiedAt: status === DocumentStatus.PENDING ? null : new Date(),
      notes: opts?.notes,
    },
  });
}

async function seedEmployeeWithCase(
  tenantId: string,
  category: TenantCategory,
  input: {
    fullName: string;
    email: string;
    scenario: "fresh" | "overdue" | "manual_review" | "rejected";
    agentId?: string;
  },
) {
  // Idempotency: the scenario rows below use create() (not upsert), so bail
  // out if this employee was already seeded — makes `prisma db seed` and the
  // docker-compose `migrate` service safe to run on every `up`.
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existingUser) {
    console.log(`  - ${input.email} already seeded, skipping`);
    return;
  }

  const passwordHash = await hashPassword(SEED_PASSWORD);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      phone: "+919900000000",
      passwordHash,
      name: input.fullName,
      role: "EMPLOYEE",
      tenantId,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      userId: user.id,
      tenantId,
      fullName: input.fullName,
      aadharNumber: "123456789012",
      panNumber: "ABCDE1234F",
      permanentAddress: "123 Seed Street, Bengaluru, KA",
      currentAddress: "123 Seed Street, Bengaluru, KA",
    },
  });

  const requiredDocs = getRequiredDocuments(category);
  const flowType = getFlowType(category);

  if (input.scenario === "fresh") {
    await prisma.bgvCase.create({
      data: {
        tenantId,
        employeeId: employee.id,
        flowType,
        status: CaseStatus.DOCS_PENDING,
      },
    });
    return;
  }

  if (input.scenario === "overdue") {
    const completedAt = new Date();
    completedAt.setDate(completedAt.getDate() - 400);
    const nextReverificationDueAt = new Date(completedAt);
    nextReverificationDueAt.setDate(nextReverificationDueAt.getDate() + 365);

    const bgvCase = await prisma.bgvCase.create({
      data: {
        tenantId,
        employeeId: employee.id,
        flowType,
        status: CaseStatus.COMPLETED,
        initiatedAt: completedAt,
        completedAt,
        nextReverificationDueAt,
      },
    });
    for (const type of requiredDocs) {
      await seedDocument(
        bgvCase.id,
        type,
        isAutoVerifiable(type)
          ? DocumentStatus.AUTO_VERIFIED
          : DocumentStatus.MANUAL_VERIFIED,
      );
    }
    return;
  }

  if (input.scenario === "manual_review") {
    const bgvCase = await prisma.bgvCase.create({
      data: {
        tenantId,
        employeeId: employee.id,
        flowType,
        status: CaseStatus.MANUAL_REVIEW,
      },
    });
    for (const type of requiredDocs) {
      if (isAutoVerifiable(type)) {
        await seedDocument(bgvCase.id, type, DocumentStatus.AUTO_VERIFIED);
      } else {
        await seedDocument(bgvCase.id, type, DocumentStatus.PENDING);
      }
    }
    return;
  }

  if (input.scenario === "rejected") {
    const bgvCase = await prisma.bgvCase.create({
      data: {
        tenantId,
        employeeId: employee.id,
        flowType,
        status: CaseStatus.REJECTED,
      },
    });
    const [firstType, ...rest] = requiredDocs;
    await seedDocument(bgvCase.id, firstType, DocumentStatus.REJECTED, {
      notes: "Document illegible, does not match records",
      verifiedById: input.agentId,
    });
    for (const type of rest) {
      await seedDocument(
        bgvCase.id,
        type,
        isAutoVerifiable(type)
          ? DocumentStatus.AUTO_VERIFIED
          : DocumentStatus.MANUAL_VERIFIED,
        { verifiedById: input.agentId },
      );
    }
  }
}

async function main() {
  console.log("Seeding BGV platform data...");

  const superAdminHash = await hashPassword(SEED_PASSWORD);
  await prisma.user.upsert({
    where: { email: "admin@bgv.example" },
    update: {},
    create: {
      email: "admin@bgv.example",
      name: "Platform Admin",
      passwordHash: superAdminHash,
      role: "SUPER_ADMIN",
    },
  });

  const agentHash = await hashPassword(SEED_PASSWORD);
  const agent = await prisma.user.upsert({
    where: { email: "agent1@bgv.example" },
    update: {},
    create: {
      email: "agent1@bgv.example",
      name: "Priya Sharma",
      passwordHash: agentHash,
      role: "AGENT",
    },
  });
  await prisma.user.upsert({
    where: { email: "agent2@bgv.example" },
    update: {},
    create: {
      email: "agent2@bgv.example",
      name: "Rahul Verma",
      passwordHash: agentHash,
      role: "AGENT",
    },
  });

  for (const seed of TENANT_SEEDS) {
    const tenant = await prisma.tenant.upsert({
      where: { slug: seed.slug },
      update: {},
      create: {
        name: seed.name,
        slug: seed.slug,
        category: seed.category,
        contactEmail: seed.contactEmail,
      },
    });

    const adminHash = await hashPassword(SEED_PASSWORD);
    await prisma.user.upsert({
      where: { email: seed.adminEmail },
      update: {},
      create: {
        email: seed.adminEmail,
        name: `${seed.name} HR Admin`,
        passwordHash: adminHash,
        role: "EMPLOYER_ADMIN",
        tenantId: tenant.id,
      },
    });

    await seedEmployeeWithCase(tenant.id, seed.category, {
      fullName: "New Hire (Docs Pending)",
      email: `newhire@${seed.slug}.example`,
      scenario: "fresh",
    });

    await seedEmployeeWithCase(tenant.id, seed.category, {
      fullName: "Verified Employee (Overdue Re-verification)",
      email: `verified@${seed.slug}.example`,
      scenario: "overdue",
    });

    if (seed.category === TenantCategory.MNC) {
      await seedEmployeeWithCase(tenant.id, seed.category, {
        fullName: "Awaiting Agent Review",
        email: `pendingreview@${seed.slug}.example`,
        scenario: "manual_review",
      });
      await seedEmployeeWithCase(tenant.id, seed.category, {
        fullName: "Rejected Candidate",
        email: `rejected@${seed.slug}.example`,
        scenario: "rejected",
        agentId: agent.id,
      });
    }
  }

  console.log("Seed complete.");
  console.log(`All seeded users share the password: ${SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
