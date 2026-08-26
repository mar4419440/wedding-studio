export type ThemeId =
  | "ethereal-union-1"
  | "ethereal-union-2"
  | "emerald-gilt"
  | "paper-terracotta"
  | "botanical-hearth"
  | "nocturne-elegance";

export interface ThemeMeta {
  id: ThemeId;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  swatch: { surface: string; primary: string; secondary: string };
}

/**
 * The six design systems from the Stitch bilingual wedding suite.
 * Tokens live in src/app/themes.css keyed by these ids.
 */
export const THEMES: ThemeMeta[] = [
  {
    id: "ethereal-union-1",
    nameEn: "Ethereal Gold",
    nameAr: "الذهب الأثيري",
    taglineEn: "Ivory & gold hairlines, serif on serif",
    taglineAr: "عاجي وذهبي بخطوط رفيعة كلاسيكية",
    swatch: { surface: "#faf9f9", primary: "#d4af37", secondary: "#2d2d2d" },
  },
  {
    id: "ethereal-union-2",
    nameEn: "Modern Romantic",
    nameAr: "رومانسي عصري",
    taglineEn: "Blush linen, rose gold & italic serifs",
    taglineAr: "كتان وردي وذهبية وردية بخط مائل",
    swatch: { surface: "#fbf9f8", primary: "#8c4b55", secondary: "#f5e6e8" },
  },
  {
    id: "emerald-gilt",
    nameEn: "Emerald & Gilt",
    nameAr: "الزمرد والمذهّب",
    taglineEn: "Mashrabiya geometry & gold leaf frames",
    taglineAr: "هندسة مشربية وإطارات من ورق الذهب",
    swatch: { surface: "#fff8f5", primary: "#06402b", secondary: "#fed65b" },
  },
  {
    id: "paper-terracotta",
    nameEn: "Paper & Terracotta",
    nameAr: "ورق وطين",
    taglineEn: "Editorial ink with a Mediterranean spark",
    taglineAr: "حبر تحريري بلمسة متوسطية",
    swatch: { surface: "#f9f9f9", primary: "#000000", secondary: "#9f402d" },
  },
  {
    id: "botanical-hearth",
    nameEn: "Botanical Hearth",
    nameAr: "دفء النباتات",
    taglineEn: "Sun-baked terracotta, sage & scrapbook",
    taglineAr: "طين مشمس وحكاكة سكرابوك دافئة",
    swatch: { surface: "#fcf9f4", primary: "#974400", secondary: "#3c653f" },
  },
  {
    id: "nocturne-elegance",
    nameEn: "Nocturne Elegance",
    nameAr: "أناقة الليل",
    taglineEn: "Midnight black, glowing champagne gold",
    taglineAr: "أسود منتصف الليل وذهب متوهج",
    swatch: { surface: "#131313", primary: "#f2ca50", secondary: "#c8c8b0" },
  },
];

export const DEFAULT_THEME: ThemeId = "ethereal-union-1";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

export function getTheme(id: string): ThemeMeta | undefined {
  return THEMES.find((t) => t.id === id);
}
