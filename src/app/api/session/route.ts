import { NextRequest, NextResponse } from "next/server";
import { assertOrigin, endpoint, limitedBody } from "@/lib/server/http";
import { assertScreening, COOKIE_NAME, issueSession } from "@/lib/server/session";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  return endpoint(async () => {
    assertOrigin(request); assertScreening();
    await limitedBody(request, 0);
    const session = issueSession(request);
    const response = NextResponse.json({ remaining: session.remaining, serverTime: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(COOKIE_NAME, session.cookie, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 3600 });
    return response;
  });
}
