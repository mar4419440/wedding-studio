import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Public: a guest RSVPs from their personalized invitation. */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    familyId?: string;
    status?: string;
  };

  if (!body.familyId || !["CONFIRMED", "DECLINED"].includes(body.status ?? "")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const family = await prisma.family.update({
      where: { id: body.familyId },
      data: { rsvpStatus: body.status! },
    });
    return NextResponse.json({
      ok: true,
      rsvpStatus: family.rsvpStatus,
      guestCount: family.guestCount,
    });
  } catch {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }
}
