import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

/** Admin: mark a family as checked-in at the entrance. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { familyId, undo } = (await request.json()) as {
    familyId?: string;
    undo?: boolean;
  };
  if (!familyId) {
    return NextResponse.json({ error: "familyId required" }, { status: 400 });
  }

  try {
    const family = await prisma.family.update({
      where: { id: familyId },
      data: {
        checkedIn: !undo,
        checkedInAt: undo ? null : new Date(),
      },
    });
    return NextResponse.json({
      ok: true,
      family: {
        id: family.id,
        nameEn: family.nameEn,
        nameAr: family.nameAr,
        guestCount: family.guestCount,
        rsvpStatus: family.rsvpStatus,
        checkedIn: family.checkedIn,
      },
    });
  } catch {
    return NextResponse.json({ error: "Family not found" }, { status: 404 });
  }
}

/** Admin: look up a scanned code / pasted URL / raw id. */
export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const code = new URL(request.url).searchParams.get("code")?.trim() ?? "";
  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  // Accept: raw uuid, full checkin URL, or invite URL
  let id = code;
  const match = code.match(
    /(?:checkin|invite)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  if (match) id = match[1];

  const family = await prisma.family.findUnique({ where: { id } }).catch(() => null);
  if (!family) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    family: {
      id: family.id,
      nameEn: family.nameEn,
      nameAr: family.nameAr,
      guestCount: family.guestCount,
      phone: family.phone,
      rsvpStatus: family.rsvpStatus,
      checkedIn: family.checkedIn,
    },
  });
}
