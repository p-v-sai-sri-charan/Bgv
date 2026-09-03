import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

/**
 * GET /logout — clears the session cookie and redirects to /login.
 *
 * A route handler (not a page) so `requireSession` can redirect here to drop a
 * cookie that has drifted from the database; cookies can't be mutated during a
 * page render. The Location is relative so it resolves against whatever host
 * the browser used (the container sets HOSTNAME=0.0.0.0 for binding).
 */
export async function GET() {
  const response = new NextResponse(null, {
    status: 303,
    headers: { Location: "/login" },
  });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
