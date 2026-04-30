"use client";

import { useClerk } from "@clerk/nextjs";

export default function LogoutButton() {
  const { signOut } = useClerk();

  return (
    <button onClick={() => signOut()} className="bg-red-500 text-white px-3 py-1">
      Logout
    </button>
  );
}