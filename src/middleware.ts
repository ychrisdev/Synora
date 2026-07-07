import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname.startsWith("/admin")) {
      const role = token?.role;
      if (role !== "ADMIN" && role !== "SUPPORT") {
        return NextResponse.redirect(new URL("/feed", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/settings(.*)",
    "/chat(.*)",
    "/community(.*)",
    "/notifications(.*)",
    "/admin(.*)",
  ],
};