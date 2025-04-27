import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const roleMap: Record<number, "student" | "lessor" | "admin"> = {
  1: "student",
  2: "lessor",
  3: "admin",
};

const roleAccessMap: Record<"admin" | "student" | "lessor", string[]> = {
  "admin": ["/admin", "/dashboard/users", "/dashboard/settings", "/dashboard/home", "/dashboard/messages","/dashboard/settings", "/dashboard/payments", "/dashboard/leases","/dashboard/test"],
  "student": ["/dashboard/profile", "/dashboard/home", "/dashboard/messages", "/dashboard/settings", "/dashboard/profile", "/dashboard/rentals", "/dashboard/request", "/dashboard/payments", "/dashboard/leases", "/dashboard/test"],
  "lessor": ["/dashboard/publish", "/dashboard/properties", "/dashboard/home", "/dashboard/messages", "/dashboard/settings", "/dashboard/profile", "/dashboard/rentals", "/dashboard/request", "/dashboard/payments", "/dashboard/leases","/dashboard/test"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/users/login", request.url));
  }

  const { pathname } = request.nextUrl;
  const roleId = token.role as number; // token.user viene del callback jwt
  const role = roleMap[roleId];

  if (!role) {
    console.error("Role not found for user:", roleId);
    return NextResponse.redirect(new URL("/403", request.url));
  }

  const allowedPaths = roleAccessMap[role] || [];

  const isAllowed = allowedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin",
    "/user/:path*",
    "/checkout",
  ],
};
