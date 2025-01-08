import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  console.log("auth middle ware !");
  const { nextUrl } = req;
  const isAuthorized = req.auth?.user;

  // Public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/register",
    "/auth/error",
    "/check-mail",
    "/complete-registeration",
    "/reset-password",
    "/forgot-password",
  ];
  const isPublicPath = publicPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  // Protected paths that require authentication
  const protectedPaths = ["/sample-page"];
  const isProtectedPath = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  // Redirect authenticated users away from public pages
  if (isAuthorized && isPublicPath) {
    return NextResponse.redirect(new URL("/sample-page", nextUrl));
  }

  // Redirect unauthenticated users to login page
  if (!isAuthorized && isProtectedPath) {
    const redirectUrl = new URL("/login", nextUrl);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
