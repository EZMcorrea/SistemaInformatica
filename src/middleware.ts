import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("si_session")?.value;
  const isPublic = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/api/auth/login");
  if (!token && !isPublic && !req.nextUrl.pathname.startsWith("/_next")) return NextResponse.redirect(new URL("/login", req.url));
  if (token && req.nextUrl.pathname === "/") return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
