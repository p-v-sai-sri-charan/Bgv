import { NextResponse } from "next/server";
import { DocumentType } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { processDocumentUpload } from "@/lib/case-service";
import { getRequiredDocuments } from "@/lib/flow-config";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const caseId = formData.get("caseId");
  const type = formData.get("type");
  const file = formData.get("file");
  const documentNumber = formData.get("documentNumber");

  if (
    typeof caseId !== "string" ||
    typeof type !== "string" ||
    !(file instanceof File)
  ) {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  if (!(type in DocumentType)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  const bgvCase = await prisma.bgvCase.findUnique({
    where: { id: caseId },
    include: { employee: true, tenant: true },
  });

  if (!bgvCase || bgvCase.employee.userId !== session.userId) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  if (bgvCase.status === "COMPLETED" || bgvCase.status === "REJECTED") {
    return NextResponse.json(
      { error: "This case is closed and no longer accepts uploads" },
      { status: 409 },
    );
  }

  const requiredTypes = getRequiredDocuments(bgvCase.tenant.category);
  if (!requiredTypes.includes(type as DocumentType)) {
    return NextResponse.json(
      { error: "This document type is not required for this case" },
      { status: 400 },
    );
  }

  try {
    await processDocumentUpload({
      caseId,
      type: type as DocumentType,
      file,
      documentNumber:
        typeof documentNumber === "string" ? documentNumber : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
