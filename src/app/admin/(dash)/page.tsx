import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Users, UserCheck, UserX, Clock3, ScanLine, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let totalFamilies = 0;
  let confirmed = 0;
  let declined = 0;
  let checkedInFamilies = 0;
  let totalGuests = 0;

  try {
    const [tf, c, d, cif, guestAgg] = await Promise.all([
      prisma.family.count(),
      prisma.family.count({ where: { rsvpStatus: "CONFIRMED" } }),
      prisma.family.count({ where: { rsvpStatus: "DECLINED" } }),
      prisma.family.count({ where: { checkedIn: true } }),
      prisma.family.aggregate({ _sum: { guestCount: true } }),
    ]);
    totalFamilies = tf;
    confirmed = c;
    declined = d;
    checkedInFamilies = cif;
    totalGuests = guestAgg._sum.guestCount ?? 0;
  } catch (error) {
    console.error("Database connection failed, using mock data for dashboard", error);
  }

  const pending = Math.max(0, totalFamilies - confirmed - declined);

  const stats = [
    {
      label: "Total Invited",
      value: `${totalFamilies} families`,
      sub: `${totalGuests} guests`,
      icon: Users,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: "Confirmed",
      value: confirmed,
      sub: `families`,
      icon: UserCheck,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Declined",
      value: declined,
      sub: `families`,
      icon: UserX,
      tone: "bg-rose-50 text-rose-500",
    },
    {
      label: "Checked-in",
      value: checkedInFamilies,
      sub: `of ${confirmed} confirmed`,
      icon: ScanLine,
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "Pending RSVPs",
      value: pending,
      sub: `awaiting response`,
      icon: Clock3,
      tone: "bg-amber-50 text-amber-600",
    },
  ];

  let recent: any[] = [];
  try {
    recent = await prisma.family.findMany({
      orderBy: [{ checkedInAt: "desc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch (error) {
    // Empty array for recent if DB fails
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">
            Live overview of invitations and event-day check-ins.
          </p>
        </div>
        <Link
          href="/admin/invitations"
          className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
        >
          <Plus className="size-4" />
          New invitation
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-stone-200 bg-white p-4"
          >
            <span className={`inline-flex rounded-lg p-2 ${stat.tone}`}>
              <stat.icon className="size-4" />
            </span>
            <p className="mt-3 text-2xl font-bold tabular-nums">{stat.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              {stat.label}
            </p>
            <p className="mt-0.5 text-xs text-stone-400">{stat.sub}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-stone-400">
          Latest activity
        </h2>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <tbody>
              {recent.map((family) => (
                <tr key={family.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{family.nameEn}</td>
                  <td className="px-4 py-3 text-stone-500" dir="rtl" lang="ar">
                    {family.nameAr}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-stone-500">
                    {family.guestCount} guests
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        family.rsvpStatus === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-600"
                          : family.rsvpStatus === "DECLINED"
                            ? "bg-rose-50 text-rose-500"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {family.rsvpStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-400">
                    {family.checkedIn
                      ? `Checked in ${family.checkedInAt?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) ?? ""}`
                      : "Not arrived"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
