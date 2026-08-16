"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TenantCategory } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth";
import { NotificationChannel, NotificationEvent } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { sendNotification } from "@/lib/notifications/service";

function generateTempPassword() {
  return randomBytes(6).toString("base64url");
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || randomBytes(4).toString("hex")
  );
}

const tenantSchema = z.object({
  name: z.string().min(2),
  category: z.nativeEnum(TenantCategory),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional().or(z.literal("")),
  adminName: z.string().min(2),
  adminEmail: z.string().email(),
});

export interface CreateTenantState {
  error?: string;
  success?: { tenantName: string; adminEmail: string; tempPassword: string };
}

export async function createTenantAction(
  _prevState: CreateTenantState,
  formData: FormData,
): Promise<CreateTenantState> {
  await requireSession(["SUPER_ADMIN"]);

  const parsed = tenantSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone") || "",
    adminName: formData.get("adminName"),
    adminEmail: formData.get("adminEmail"),
  });

  if (!parsed.success) {
    return { error: "Please fill in all required fields correctly" };
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: parsed.data.adminEmail },
  });
  if (existingAdmin) {
    return { error: "A user with the admin email already exists" };
  }

  let slug = slugify(parsed.data.name);
  const slugTaken = await prisma.tenant.findUnique({ where: { slug } });
  if (slugTaken) {
    slug = `${slug}-${randomBytes(3).toString("hex")}`;
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: parsed.data.name,
      slug,
      category: parsed.data.category,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone || null,
    },
  });

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const admin = await prisma.user.create({
    data: {
      email: parsed.data.adminEmail,
      name: parsed.data.adminName,
      passwordHash,
      role: "EMPLOYER_ADMIN",
      tenantId: tenant.id,
    },
  });

  await sendNotification({
    event: NotificationEvent.CASE_CREATED,
    channel: NotificationChannel.EMAIL,
    recipient: admin.email,
    subject: `${tenant.name} is now onboarded on the BGV platform`,
    body: `Hi ${admin.name}, your company (${tenant.name}) has been onboarded.\nLogin: ${admin.email}\nTemporary password: ${tempPassword}`,
  });

  revalidatePath("/admin");

  return {
    success: {
      tenantName: tenant.name,
      adminEmail: admin.email,
      tempPassword,
    },
  };
}

const agentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export interface CreateAgentState {
  error?: string;
  success?: { email: string; tempPassword: string };
}

export async function createAgentAction(
  _prevState: CreateAgentState,
  formData: FormData,
): Promise<CreateAgentState> {
  await requireSession(["SUPER_ADMIN"]);

  const parsed = agentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: "Please provide a valid name and email" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "A user with this email already exists" };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const agent = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: "AGENT",
    },
  });

  await sendNotification({
    event: NotificationEvent.CASE_CREATED,
    channel: NotificationChannel.EMAIL,
    recipient: agent.email,
    subject: "Your verification agent account is ready",
    body: `Hi ${agent.name}, your agent account has been created.\nLogin: ${agent.email}\nTemporary password: ${tempPassword}`,
  });

  revalidatePath("/admin/agents");

  return { success: { email: agent.email, tempPassword } };
}
