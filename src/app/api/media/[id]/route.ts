import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  const data: Record<string, unknown> = {};
  for (const key of [
    "captionAr",
    "captionEn",
    "titleAr",
    "titleEn",
    "bodyAr",
    "bodyEn",
    "dateLabel",
    "eventTag",
  ]) {
    if (body[key] !== undefined) {
      data[key] = String(body[key] ?? "").slice(0, 2000) || null;
    }
  }
  if (body.kind === "gallery" || body.kind === "story") data.kind = body.kind;
  if (body.mediaType === "image" || body.mediaType === "video") {
    data.mediaType = body.mediaType;
  }
  if (body.order !== undefined) data.order = Number(body.order) || 0;

  const media = await prisma.media.update({ where: { id }, data });
  return NextResponse.json({ media });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.media.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
