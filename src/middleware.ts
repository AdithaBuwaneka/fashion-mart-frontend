// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks(.*)",
    "/sign-in",
    "/sign-up",
  ],
  ignoredRoutes: [
    "/api/webhooks/clerk"
  ]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};