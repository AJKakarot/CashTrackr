import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});

const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return (await auth()).redirectToSignIn();
  }

  return NextResponse.next();
});

// ✅ ArcJet FIRST, Clerk SECOND
export default createMiddleware(aj, clerk);

// ✅ VERY IMPORTANT FIX HERE
export const config = {
  matcher: [
    /*
      🚨 EXCLUDE CLERK INTERNAL ROUTES
    */
    "/((?!_next|_clerk|\\.well-known/clerk|favicon.ico).*)",
    "/api(.*)",
  ],
};
