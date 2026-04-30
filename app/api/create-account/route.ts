import { clerkClient } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/mongodb";

export async function POST() {
  const db = await getDb();
  try {
    const client = await clerkClient();

    const username = nanoid(8);
    const password = nanoid(8);

    // create user in db
    const user = await client.users.createUser({
      username,
      password,
    });

    try {
      // save acc to db
      await db.collection("accounts").insertOne({
        clerkId: user.id,
        username,
        role: "temp",
        createdAt: new Date(),
        checks_remaining: 1,
      });
    } catch (dbError) {
      // rollback clerk user
      await client.users.deleteUser(user.id);
      console.error(dbError)
      return Response.json(
        { error: "Failed to store user in database" },
        { status: 500 }
      );
    }

    return Response.json(
      { username, password },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json(
      {
        error:
          err?.errors?.[0]?.longMessage ??
          "Failed to create temporary account",
      },
      { status: 500 }
    );
  }
}