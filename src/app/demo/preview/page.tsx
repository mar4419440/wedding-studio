import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { isThemeId } from "@/lib/themes";
import { PreviewClient, type PreviewData } from "@/components/demo/preview-client";

export const dynamic = "force-dynamic";

export default async function DemoPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const [{ theme }, settings] = await Promise.all([
    searchParams,
    getSettings(),
  ]);

  let media: any[] = [];
  try {
    media = await prisma.media.findMany({
      orderBy: [{ kind: "asc" }, { order: "asc" }],
    });
  } catch (error) {
    console.error("Database connection error on demo page, falling back to empty media", error);
  }

  const story = media
    .filter((m) => m.kind === "story")
    .map((m) => ({
      id: m.id,
      url: m.url,
      mediaType: m.mediaType as "image" | "video",
      titleEn: m.titleEn,
      titleAr: m.titleAr,
      bodyEn: m.bodyEn,
      bodyAr: m.bodyAr,
      dateLabel: m.dateLabel,
    }));

  const gallery = media
    .filter((m) => m.kind === "gallery")
    .map((m) => ({
      id: m.id,
      url: m.url,
      mediaType: m.mediaType as "image" | "video",
      captionEn: m.captionEn,
      captionAr: m.captionAr,
      eventTag: m.eventTag,
    }));

  const data: Omit<PreviewData, never> = {
    settings,
    story,
    gallery,
    initialTheme: theme && isThemeId(theme) ? theme : null,
  };

  return (
    <>
      <PreviewClient {...data} />
    </>
  );
}
