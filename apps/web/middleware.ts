import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Minimal access gate for the private workspace. Until a full auth provider is
 * wired, access is granted by a shared code (env STUDIO_ONE_ACCESS_CODE, with a
 * safe default). The public marketing surface (/, /demo, /security, /login) and
 * the auth API stay open; everything that exposes internal data is protected.
 */
const ACCESS_CODE = process.env.STUDIO_ONE_ACCESS_CODE || "studio-one";

const PROTECTED: RegExp[] = [
  /^\/projects(?:\/|$)/,
  /^\/settings(?:\/|$)/,
  /^\/new$/,
  /^\/api\/projects(?:\/|$)/,
  /^\/api\/settings(?:\/|$)/,
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some((re) => re.test(pathname))) return NextResponse.next();

  const granted = req.cookies.get("so_access")?.value === ACCESS_CODE;
  if (granted) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Accès privé. Connectez-vous pour continuer." }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/projects/:path*", "/settings/:path*", "/new", "/api/projects/:path*", "/api/settings/:path*"],
};
