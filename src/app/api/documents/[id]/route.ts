import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storageProvider } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.document.findUnique({
    where: { id },
    include: { case: { include: { employee: true } } },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const authorized =
    session.role === "SUPER_ADMIN" ||
    session.role === "AGENT" ||
    (session.role === "EMPLOYER_ADMIN" &&
      session.tenantId === document.case.tenantId) ||
    (session.role === "EMPLOYEE" &&
      session.userId === document.case.employee.userId);

  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const buffer = await storageProvider.read(document.storageKey);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Disposition": `inline; filename="${document.fileName}"`,
    },
  });
}
