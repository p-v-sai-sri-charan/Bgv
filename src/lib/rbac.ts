import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { UserRole } from "@/generated/prisma/enums";
import { getSession, type SessionPayload } from "./auth";
import { prisma } from "./prisma";

export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  EMPLOYER_ADMIN: "/employer",
  EMPLOYEE: "/employee",
  AGENT: "/agent",
};

/**
 * Re-check the JWT session against the database, memoised per request.
 *
 * A signed cookie can outlive the row it points at — most commonly after the
 * database is reseeded (new cuid tenant/user IDs) while the browser keeps an
 * old token. Rather than let a downstream `findUniqueOrThrow` 500, we treat a
 * drifted session as signed-out and bounce through /logout to clear it.
 */
const resolveSession = cache(
  async (): Promise<SessionPayload | "stale" | null> => {
    const session = await getSession();
    if (!session) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        isActive: true,
        role: true,
        tenantId: true,
        tenant: { select: { id: true } },
      },
    });

    const drifted =
      !user ||
      !user.isActive ||
      user.role !== session.role ||
      user.tenantId !== session.tenantId ||
      (user.tenantId != null && user.tenant == null);

    return drifted ? "stale" : session;
  },
);

export async function requireSession(
  allowedRoles?: UserRole[],
): Promise<SessionPayload> {
  const result = await resolveSession();

  if (result === null) {
    redirect("/login");
  }
  if (result === "stale") {
    // Route handler clears the cookie, then sends the user to /login.
    redirect("/logout");
  }

  if (allowedRoles && !allowedRoles.includes(result.role)) {
    redirect(ROLE_HOME[result.role]);
  }
  return result;
}
