import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb";
import { nanoid } from "nanoid";

function generatePassword(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
  try {
    const client = await clerkClient();

    const username = nanoid();
    const password = generatePassword();

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