import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getOrigin, serializeFamily } from "@/lib/families";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status") ?? "";
  const checkedInOnly = url.searchParams.get("checkedIn") === "1";
  const limit = Math.min(200, Number(url.searchParams.get("limit")) || 200);
  const origin = getOrigin(request);

  const where: Record<string, unknown> = {};
  if (status && ["PENDING", "CONFIRMED", "DECLINED"].includes(status)) {
    where.rsvpStatus = status;
  }
  if (checkedInOnly) {
    where.checkedIn = true;
  }
  if (q) {
    where.OR = [
      { nameAr: { contains: q } },
      { nameEn: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const families = await prisma.family.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({
    families: families.map((f) => serializeFamily(f, origin)),
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    nameAr?: string;
    nameEn?: string;
    phone?: string;
    guestCount?: number;
  };

  const nameAr = body.nameAr?.trim();
  const nameEn = body.nameEn?.trim();
  if (!nameAr || !nameEn) {
    return NextResponse.json(
      { error: "Family name in Arabic and English is required." },
      { status: 400 }
    );
  }

  const origin = getOrigin(request);
  const family = await prisma.family.create({
    data: {
      nameAr,
      nameEn,
      phone: body.phone?.trim() || null,
      guestCount: Math.max(1, Math.min(50, Number(body.guestCount) || 1)),
      inviteUrl: null, // set below once we have the id
    },
  });

  const invitePath = `/checkin/${family.id}`;
  const qrUrl = `${origin}/checkin/${family.id}`;

  const updated = await prisma.family.update({
    where: { id: family.id },
    data: { inviteUrl: invitePath, qrCodeData: qrUrl },
  });

  return NextResponse.json({ family: serializeFamily(updated, origin) }, { status: 201 });
}
