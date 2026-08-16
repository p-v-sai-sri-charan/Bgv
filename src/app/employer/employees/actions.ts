"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { createCase } from "@/lib/case-service";
import { NotificationChannel, NotificationEvent } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { sendNotification } from "@/lib/notifications/service";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).optional().or(z.literal("")),
});

export interface AddEmployeeState {
  error?: string;
  success?: { email: string; tempPassword: string };
}

function generateTempPassword() {
  return randomBytes(6).toString("base64url");
}

export async function addEmployeeAction(
  _prevState: AddEmployeeState,
  formData: FormData,
): Promise<AddEmployeeState> {
  const session = await requireSession(["EMPLOYER_ADMIN"]);
  const tenantId = session.tenantId!;

  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
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

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      passwordHash,
      name: parsed.data.fullName,
      role: "EMPLOYEE",
      tenantId,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      userId: user.id,
      tenantId,
      fullName: parsed.data.fullName,
    },
  });

  await createCase(employee.id);

  await sendNotification({
    event: NotificationEvent.CASE_CREATED,
    channel: NotificationChannel.EMAIL,
    recipient: user.email,
    subject: "Welcome — complete your background verification",
    body: `Hi ${user.name}, an account has been created for you on the BGV platform.\nLogin: ${user.email}\nTemporary password: ${tempPassword}\nPlease sign in and upload your verification documents.`,
  });

  revalidatePath("/employer/employees");

  return { success: { email: user.email, tempPassword } };
}
