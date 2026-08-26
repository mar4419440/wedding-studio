import { cookies } from "next/headers";
import {
  createSessionToken,
  verifySessionToken,
  SESSION_TTL_MS,
} from "@/lib/session-token";

const COOKIE_NAME = "wedding_admin_session";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "wedding2026";
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
