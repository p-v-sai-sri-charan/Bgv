"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PORTALS, ROLE_TO_PORTAL, isPortalKey } from "@/lib/portals";
import { ROLE_HOME } from "@/lib/rbac";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  portal: z.string().optional(),
});

export interface LoginState {
  error?: string;
  /** When set, the entered account belongs to a different portal. */
  wrongPortal?: { key: string; label: string };
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    portal: formData.get("portal") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password" };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !user.isActive) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  const expectedPortal = parsed.data.portal;
  if (isPortalKey(expectedPortal)) {
    const actualPortal = ROLE_TO_PORTAL[user.role];
    if (actualPortal !== expectedPortal) {
      return {
        error: `This account isn't a ${PORTALS[expectedPortal].label} account.`,
        wrongPortal: {
          key: actualPortal,
          label: PORTALS[actualPortal].label,
        },
      };
    }
  }

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
  });

  redirect(ROLE_HOME[user.role]);
}
