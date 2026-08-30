import { NextResponse } from "next/server";
import { adminPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  if (!password || password !== adminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
