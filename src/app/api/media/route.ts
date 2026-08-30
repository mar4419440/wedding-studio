import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { normalizeMediaUrl } from "@/lib/drive";

export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  const media = await prisma.media.findMany({
    where: kind && ["gallery", "story"].includes(kind) ? { kind } : undefined,
    orderBy: [{ kind: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ media });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    url?: string;
    mediaType?: string;
    kind?: string;
    captionAr?: string;
    captionEn?: string;
    titleAr?: string;
    titleEn?: string;
    bodyAr?: string;
    bodyEn?: string;
    dateLabel?: string;
    eventTag?: string;
    order?: number;
  };

  if (!body.url?.trim()) {
    return NextResponse.json({ error: "Media link is required." }, { status: 400 });
  }

  const media = await prisma.media.create({
    data: {
      url: normalizeMediaUrl(body.url),
      mediaType: body.mediaType === "video" ? "video" : "image",
      kind: body.kind === "story" ? "story" : "gallery",
      captionAr: body.captionAr || null,
      captionEn: body.captionEn || null,
      titleAr: body.titleAr || null,
      titleEn: body.titleEn || null,
      bodyAr: body.bodyAr || null,
      bodyEn: body.bodyEn || null,
      dateLabel: body.dateLabel || null,
      eventTag: body.eventTag || "other",
      order: Number(body.order) || 0,
    },
  });

  return NextResponse.json({ media }, { status: 201 });
}
