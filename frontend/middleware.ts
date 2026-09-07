import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes anyone can see without logging in
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)", // Allows /sign-in and all its sub-paths
  "/sign-up(.*)", // Allows /sign-up and all its sub-paths
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // Protects every other page
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
