"use server";

import { revalidatePath } from "next/cache";
import { agentReviewCheck } from "@/lib/case-service";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";

export async function reviewCheckAction(formData: FormData) {
  const session = await requireSession(["AGENT"]);

  const checkId = formData.get("checkId");
  const decision = formData.get("decision");
  const notes = formData.get("notes");
  const caseId = formData.get("caseId");

  if (
    typeof checkId !== "string" ||
    typeof caseId !== "string" ||
    (decision !== "VERIFIED" && decision !== "REJECTED")
  ) {
    throw new Error("Invalid review submission");
  }

  const existingAssignment = await prisma.agentAssignment.findFirst({
    where: { caseId, agentId: session.userId },
  });
  if (!existingAssignment) {
    await prisma.agentAssignment.create({
      data: { caseId, agentId: session.userId },
    });
  }

  await agentReviewCheck({
    checkId,
    agentUserId: session.userId,
    decision,
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : undefined,
  });

  revalidatePath(`/agent/cases/${caseId}`);
  revalidatePath("/agent");
}
