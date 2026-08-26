"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        return;
      }
      window.location.href = next;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6 text-stone-900">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-stone-900">
          <Lock className="size-5 text-white" />
        </span>
        <h1 className="mt-5 text-center text-xl font-bold">Wedding Studio — Admin</h1>
        <p className="mt-1 text-center text-sm text-stone-500">
          Enter the admin password to continue.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          required
          className="mt-6 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition-colors focus:border-stone-500"
        />
        {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full cursor-pointer rounded-xl bg-stone-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <Link
          href="/demo"
          className="mt-4 block text-center text-xs font-medium text-stone-400 underline-offset-4 hover:text-stone-600 hover:underline"
        >
          ← Back to public site
        </Link>
      </form>
    </main>
  );
}
