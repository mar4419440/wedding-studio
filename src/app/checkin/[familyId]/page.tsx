import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckinConfirm } from "@/components/admin/checkin-confirm";

export const dynamic = "force-dynamic";

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = await params;
  const family = await prisma.family
    .findUnique({ where: { id: familyId } })
    .catch(() => null);

  if (!family) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6 text-stone-900">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Entrance Check-in
        </p>
        <h1 className="mt-3 text-2xl font-bold">{family.nameEn}</h1>
        <p className="text-lg text-stone-500" dir="rtl" lang="ar">
          {family.nameAr}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-stone-50 p-3">
            <dt className="text-stone-400">Guests</dt>
            <dd className="mt-0.5 text-lg font-semibold">{family.guestCount}</dd>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <dt className="text-stone-400">RSVP</dt>
            <dd
              className={`mt-0.5 text-lg font-semibold ${
                family.rsvpStatus === "CONFIRMED"
                  ? "text-emerald-600"
                  : family.rsvpStatus === "DECLINED"
                    ? "text-rose-500"
                    : "text-amber-500"
              }`}
            >
              {family.rsvpStatus}
            </dd>
          </div>
        </dl>

        <CheckinConfirm
          familyId={family.id}
          initialCheckedIn={family.checkedIn}
          guestCount={family.guestCount}
        />

        <Link
          href="/admin/checkin"
          className="mt-4 block text-center text-xs font-medium text-stone-400 underline-offset-4 hover:text-stone-600 hover:underline"
        >
          Back to check-in console
        </Link>
      </div>
    </main>
  );
}
