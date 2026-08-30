import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

/** Admin: summary stats for the dashboard + live check-in counter. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalFamilies, confirmed, declined, checkedInFamilies] =
    await Promise.all([
      prisma.family.count(),
      prisma.family.count({ where: { rsvpStatus: "CONFIRMED" } }),
      prisma.family.count({ where: { rsvpStatus: "DECLINED" } }),
      prisma.family.count({ where: { checkedIn: true } }),
    ]);

  const groups = await prisma.family.groupBy({
    by: ["rsvpStatus"],
    _sum: { guestCount: true },
    _count: { _all: true },
  });

  const sumFor = (status: string) =>
    groups.find((g) => g.rsvpStatus === status)?._sum.guestCount ?? 0;

  const totalGuests = groups.reduce((acc, g) => acc + (g._sum.guestCount ?? 0), 0);

  return NextResponse.json({
    families: {
      total: totalFamilies,
      confirmed,
      declined,
      pending: totalFamilies - confirmed - declined,
      checkedIn: checkedInFamilies,
    },
    guests: {
      total: totalGuests,
      confirmed: sumFor("CONFIRMED"),
      declined: sumFor("DECLINED"),
      pending: sumFor("PENDING"),
      checkedIn: await prisma.family
        .aggregate({ where: { checkedIn: true }, _sum: { guestCount: true } })
        .then((r) => r._sum.guestCount ?? 0),
    },
  });
}
