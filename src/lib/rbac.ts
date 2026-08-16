import "server-only";

import { redirect } from "next/navigation";
import type { UserRole } from "@/generated/prisma/client";
import { getSession, type SessionPayload } from "./auth";

export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  EMPLOYER_ADMIN: "/employer",
  EMPLOYEE: "/employee",
  AGENT: "/agent",
};

export async function requireSession(
  allowedRoles?: UserRole[],
): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect(ROLE_HOME[session.role]);
  }
  return session;
}
