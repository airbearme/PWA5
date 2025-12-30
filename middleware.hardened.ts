import { NextResponse, type NextRequest } from "next/server";
import { flags } from "./lib/flags";

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;

  if (flags.killSwitch && !p.startsWith("/api/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
