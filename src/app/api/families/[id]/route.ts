import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getOrigin, serializeFamily } from "@/lib/families";

const RSVP_STATUSES = ["PENDING", "CONFIRMED", "DECLINED"];

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as {
    nameAr?: string;
    nameEn?: string;
    phone?: string | null;
    guestCount?: number;
    rsvpStatus?: string;
  };

  const data: Record<string, unknown> = {};
  if (typeof body.nameAr === "string" && body.nameAr.trim()) data.nameAr = body.nameAr.trim();
  if (typeof body.nameEn === "string" && body.nameEn.trim()) data.nameEn = body.nameEn.trim();
  if (body.phone !== undefined) data.phone = body.phone?.toString().trim() || null;
  if (body.guestCount !== undefined) {
    data.guestCount = Math.max(1, Math.min(50, Number(body.guestCount) || 1));
  }
  if (body.rsvpStatus && RSVP_STATUSES.includes(body.rsvpStatus)) {
    data.rsvpStatus = body.rsvpStatus;
  }

  const family = await prisma.family.update({ where: { id }, data });
  return NextResponse.json({ family: serializeFamily(family, getOrigin(request)) });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.family.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
