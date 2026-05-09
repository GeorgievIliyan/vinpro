import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/login",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect();
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const { userId } = await auth();

    if (!userId) return new Response("Forbidden", { status: 403 });
    // get role
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;

    if (role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};