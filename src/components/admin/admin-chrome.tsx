"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Images,
  LayoutDashboard,
  LogOut,
  ScanLine,
  Settings,
  Users,
  MessageSquare,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/invitations", label: "Invitations", icon: Users },
  { href: "/admin/checkin", label: "Check-in", icon: ScanLine },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/guestbook", label: "Guestbook", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-stone-100 text-stone-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 flex w-60 flex-col border-e border-stone-200 bg-white max-md:hidden">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex size-8 items-center justify-center rounded-full bg-stone-900">
            <Heart className="size-4 text-white" />
          </span>
          <span className="text-sm font-bold">Wedding Studio</span>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-stone-100 p-3">
          <Link
            href="/demo"
            target="_blank"
            className="mb-1 block rounded-xl px-3 py-2 text-xs font-medium text-stone-400 hover:bg-stone-50 hover:text-stone-600"
          >
            View public site ↗
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="size-4 rtl:rotate-180" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:hidden">
        <span className="text-sm font-bold">Wedding Studio</span>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={`rounded-lg p-2 ${
                  active ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                <Icon className="size-4" />
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            className="rounded-lg p-2 text-stone-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="size-4" />
          </button>
        </nav>
      </header>

      <main className="min-w-0 flex-1 px-5 pb-16 pt-16 md:ps-[16.5rem] md:pe-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
