import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublic = createRouteMatcher([
  "/",
  "/login",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  // redirect to login page
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isPublic(req)) {
    await auth.protect();
  }

  if (pathname.startsWith("/admin")) {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Forbidden", { status: 403 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;

    if (role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};