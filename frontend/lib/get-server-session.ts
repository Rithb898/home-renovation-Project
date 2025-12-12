import { headers } from "next/headers";

export async function getServerSession() {
  const cookieHeader = (await headers()).get("cookie") || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
