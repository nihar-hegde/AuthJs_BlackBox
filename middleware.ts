import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  // checking if currently logged in by boolean of req.auth
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // check if we are on public route
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // check if auht route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // NOTE: THE order of checking matters so make sure you follow the order while checking the below stuff;

  if (isApiAuthRoute) {
    // do not do any action on this
    return null;
  }
  if (isAuthRoute) {
    // NOTE: if is logged in then redirect to default otherwise don't do anything;
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  // NOTE: allow every other route
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  // NOTE: the matcher will invoke the function for every single route execpt some next static files .
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// NOTE: every route on the app is protected by default then we will exclude some routes like landing page  for public acces
