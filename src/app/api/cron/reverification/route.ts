import { NextResponse } from "next/server";
import { runReverificationSweep } from "@/lib/case-service";

/**
 * Triggered by an external scheduler (e.g. Vercel Cron, a daily cron job)
 * hitting this route with `Authorization: Bearer $CRON_SECRET`. Finds
 * completed cases whose annual re-verification is due, notifies
 * employee + employer, and opens a fresh case for each.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runReverificationSweep();
  return NextResponse.json(result);
}
