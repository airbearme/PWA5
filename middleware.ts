import { NextResponse, type NextRequest } from "next/server";
import { flags } from "./lib/flags";

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;

  if (flags.killSwitch && !p.startsWith("/api/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  // Generate a nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Define the Content Security Policy
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    `style-src 'self' 'unsafe-inline' https:`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
    "connect-src 'self' https: wss:",
    "upgrade-insecure-requests",
  ].join("; ");

  // Clone the request headers and set the CSP header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("Content-Security-Policy", csp);

  // Create a response object and set the nonce in its headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
