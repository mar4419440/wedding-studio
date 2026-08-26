import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { isThemeId } from "@/lib/themes";

/** Public subset of settings used to render the site. */
const PUBLIC_KEYS = new Set([
  "active_theme",
  "couple_monogram",
  "couple_name_en",
  "couple_name_ar",
  "kicker_en",
  "kicker_ar",
  "wedding_date_en",
  "wedding_date_ar",
  "wedding_time_en",
  "wedding_time_ar",
  "venue_en",
  "venue_ar",
  "venue_address_en",
  "venue_address_ar",
  "map_embed_url",
  "hero_image_url",
  "rsvp_deadline_en",
  "rsvp_deadline_ar",
]);

export async function GET() {
  const all = await getSettings();
  const filtered = Object.fromEntries(
    Object.entries(all).filter(([k]) => PUBLIC_KEYS.has(k))
  );
  return NextResponse.json(filtered);
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const updates: { key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(body)) {
    if (key === "active_theme") {
      if (!isThemeId(value)) continue;
    }
    if (typeof value === "string" && value.length <= 2000) {
      updates.push({ key, value });
    }
  }
  for (const u of updates) {
    await prisma.setting.upsert({
      where: { key: u.key },
      update: { value: u.value },
      create: u,
    });
  }
  const all = await getSettings();
  return NextResponse.json({ ok: true, active_theme: all.active_theme });
}
