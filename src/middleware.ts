import { NextResponse } from "next/server";

// Middleware disabled — was consuming 80% of Vercel free-tier CPU by running
// on every request. Old WordPress URLs will 404 naturally. The one 301 redirect
// was moved to next.config.ts.
export function middleware() {
  return NextResponse.next();
}

export const config = { matcher: [] };
