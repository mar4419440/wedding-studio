import { prisma } from "@/lib/prisma";
import { DEFAULT_THEME, isThemeId } from "@/lib/themes";

export type SettingsMap = Record<string, string>;

export const SETTING_DEFAULTS: SettingsMap = {
  active_theme: DEFAULT_THEME,
  couple_monogram: "A & K",
  couple_name_en: "Amira & Khalid",
  couple_name_ar: "أميرة و خالد",
  bride_en: "Amira",
  bride_ar: "أميرة",
  groom_en: "Khalid",
  groom_ar: "خالد",
  kicker_en: "We are getting married",
  kicker_ar: "نحن نحتفل بزواجنا",
  wedding_date_en: "Wednesday, October 14, 2026",
  wedding_date_ar: "الأربعاء، ١٤ أكتوبر ٢٠٢٦",
  wedding_time_en: "4:00 PM",
  wedding_time_ar: "٤:٠٠ مساءً",
  venue_en: "The Desert Oasis, Dubai",
  venue_ar: "واحة الصحراء، دبي",
  venue_address_en: "Al Qudra Road, Desert Oasis Resort, Dubai, UAE",
  venue_address_ar: "طريق القدرة، منتجع واحة الصحراء، دبي، الإمارات",
  map_embed_url:
    "https://www.openstreetmap.org/export/embed.html?bbox=55.1550%2C24.6500%2C55.7500%2C25.1000&layer=mapnik&marker=24.8750%2C55.4500",
  hero_image_url: "",
  rsvp_deadline_en: "Please kindly respond by September 1st, 2026.",
  rsvp_deadline_ar: "نرجو التكرم بالرد قبل الأول من سبتمبر ٢٠٢٦.",
};

export async function getSettings(): Promise<SettingsMap> {
  try {
    const rows = await prisma.setting.findMany();
    const map: SettingsMap = { ...SETTING_DEFAULTS };
    for (const row of rows) map[row.key] = row.value;
    if (!isThemeId(map.active_theme)) map.active_theme = DEFAULT_THEME;
    return map;
  } catch {
    return { ...SETTING_DEFAULTS };
  }
}

/** Pick a bilingual setting pair based on language suffix. */
export function pickSetting(
  settings: SettingsMap,
  baseKey: string,
  lang: "en" | "ar"
): string {
  return settings[`${baseKey}_${lang}`] ?? settings[`${baseKey}_en`] ?? "";
}
