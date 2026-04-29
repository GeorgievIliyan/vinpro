import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/login",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect();
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const { sessionClaims } = await auth();
    console.log("sessionClaims:", JSON.stringify(sessionClaims, null, 2));
    
    const role = (sessionClaims?.publicMetadata as any)?.role;
    console.log("role:", role);

    if (role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }
  }
});
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};