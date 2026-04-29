import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/login",
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();

  // Require login
  if (!isPublic(req)) {
    await auth.protect();
  }

  // Admin-only routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }
  }
});
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};