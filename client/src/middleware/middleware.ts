import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-edge";

// Any route under these prefixes requires a logged-in user
const PROTECTED_PREFIXES = ["/user", "/admin"];

// Route prefixes that require a specific role on top of being logged in
const ROLE_RESTRICTED: Record<string, string[]> = {
  "/admin": ["admin"],
};

// Logged-in users shouldn't be able to revisit these
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  const payload = token ? await verifyToken(token) : null;
  const isAuthenticated = Boolean(payload);

  // Not logged in, hitting a protected route -> send to login, remember where they were going
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in, hitting login/register -> send them to their home instead
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/user/home", req.url));
  }

  // Logged in, but role doesn't match what this section requires
  if (isAuthenticated) {
    const restrictedPrefix = Object.keys(ROLE_RESTRICTED).find((p) => pathname.startsWith(p));
    if (restrictedPrefix && !ROLE_RESTRICTED[restrictedPrefix].includes(payload!.role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

// Skip static assets, images, and API routes — only run on page navigations
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};