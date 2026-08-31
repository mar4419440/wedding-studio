export type ThemeId =
  | "ethereal-union-1"
  | "ethereal-union-2"
  | "emerald-gilt"
  | "paper-terracotta"
  | "botanical-hearth"
  | "nocturne-elegance"
  | "video-lumina";

export interface HeroMediaConfig {
  type: "image" | "video";
  src: string;
  poster?: string;
  overlay: string;
}

export interface TypographyConfig {
  headingFontFamily: string; // The CSS variable of the Google Font to use as fallback
  headingFontFamilyAr: string; // The CSS variable for the Arabic font
  headingFontVariationSettings: string;
  bodyFontVariationSettings: string;
  letterSpacing: string;
  lineHeight: string;
  svgAssets: {
    heroNames: string;
    sectionTitle: string;
  };
}

export interface ThemeMeta {
  id: ThemeId;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  swatch: { surface: string; primary: string; secondary: string };
  typography: TypographyConfig;
  heroMedia: HeroMediaConfig;
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
    typography: {
      headingFontFamily: "var(--font-bodoni-moda)",
      headingFontFamilyAr: "var(--font-ar-scheherazade)",
      headingFontVariationSettings: '"wght" 800, "wdth" 100', // Didone inspired, high contrast
      bodyFontVariationSettings: '"wght" 400, "wdth" 100',
      letterSpacing: '0.05em',
      lineHeight: '1.6',
      svgAssets: {
        heroNames: '/themes/ethereal-union-1/hero-names.svg',
        sectionTitle: '/themes/ethereal-union-1/section-title.svg',
      },
    },
    heroMedia: {
      type: 'image',
      src: '/images/hero/theme-1.webp',
      overlay: 'rgba(255, 255, 255, 0.4)',
    },
  },
  {
    id: "ethereal-union-2",
    nameEn: "Modern Romantic",
    nameAr: "رومانسي عصري",
    taglineEn: "Blush linen, rose gold & italic serifs",
    taglineAr: "كتان وردي وذهبية وردية بخط مائل",
    swatch: { surface: "#fbf9f8", primary: "#8c4b55", secondary: "#f5e6e8" },
    typography: {
      headingFontFamily: "var(--font-belluccia)",
      headingFontFamilyAr: "var(--font-ar-aref)",
      headingFontVariationSettings: '"wght" 400', // Script fonts usually don't have weight axis
      bodyFontVariationSettings: '"wght" 300, "wdth" 100',
      letterSpacing: '0.02em',
      lineHeight: '1.8',
      svgAssets: {
        heroNames: '/themes/ethereal-union-2/hero-names.svg',
        sectionTitle: '/themes/ethereal-union-2/section-title.svg',
      },
    },
    heroMedia: {
      type: 'image',
      src: '/images/hero/theme-2.webp',
      overlay: 'rgba(255, 255, 255, 0.5)',
    },
  },
  {
    id: "emerald-gilt",
    nameEn: "Emerald & Gilt",
    nameAr: "الزمرد والمذهّب",
    taglineEn: "Mashrabiya geometry & gold leaf frames",
    taglineAr: "هندسة مشربية وإطارات من ورق الذهب",
    swatch: { surface: "#fff8f5", primary: "#06402b", secondary: "#fed65b" },
    typography: {
      headingFontFamily: "var(--font-cinzel-deco)",
      headingFontFamilyAr: "var(--font-ar-amiri)",
      headingFontVariationSettings: '"wght" 700',
      bodyFontVariationSettings: '"wght" 500, "wdth" 90',
      letterSpacing: '0.02em',
      lineHeight: '1.5',
      svgAssets: {
        heroNames: '/themes/emerald-gilt/hero-names.svg',
        sectionTitle: '/themes/emerald-gilt/section-title.svg',
      },
    },
    heroMedia: {
      type: 'image',
      src: '/images/hero/theme-3.webp',
      overlay: 'rgba(6, 64, 43, 0.3)',
    },
  },
  {
    id: "paper-terracotta",
    nameEn: "Paper & Terracotta",
    nameAr: "ورق وطين",
    taglineEn: "Editorial ink with a Mediterranean spark",
    taglineAr: "حبر تحريري بلمسة متوسطية",
    swatch: { surface: "#f9f9f9", primary: "#000000", secondary: "#9f402d" },
    typography: {
      headingFontFamily: "var(--font-domine)",
      headingFontFamilyAr: "var(--font-ar-katibeh)",
      headingFontVariationSettings: '"wght" 900',
      bodyFontVariationSettings: '"wght" 400, "wdth" 100',
      letterSpacing: '-0.02em',
      lineHeight: '1.4',
      svgAssets: {
        heroNames: '/themes/paper-terracotta/hero-names.svg',
        sectionTitle: '/themes/paper-terracotta/section-title.svg',
      },
    },
    heroMedia: {
      type: 'image',
      src: '/images/hero/theme-4.webp',
      overlay: 'rgba(249, 249, 249, 0.6)',
    },
  },
  {
    id: "botanical-hearth",
    nameEn: "Botanical Hearth",
    nameAr: "دفء النباتات",
    taglineEn: "Sun-baked terracotta, sage & scrapbook",
    taglineAr: "طين مشمس وحكاكة سكرابوك دافئة",
    swatch: { surface: "#fcf9f4", primary: "#974400", secondary: "#3c653f" },
    typography: {
      headingFontFamily: "var(--font-kadwa)",
      headingFontFamilyAr: "var(--font-ar-reem)",
      headingFontVariationSettings: '"wght" 500', 
      bodyFontVariationSettings: '"wght" 400, "wdth" 105',
      letterSpacing: '0.04em',
      lineHeight: '1.7',
      svgAssets: {
        heroNames: '/themes/botanical-hearth/hero-names.svg',
        sectionTitle: '/themes/botanical-hearth/section-title.svg',
      },
    },
    heroMedia: {
      type: 'image',
      src: '/images/hero/theme-5.webp',
      overlay: 'rgba(252, 249, 244, 0.5)',
    },
  },
  {
    id: "nocturne-elegance",
    nameEn: "Nocturne Elegance",
    nameAr: "أناقة الليل",
    taglineEn: "Midnight black, glowing champagne gold",
    taglineAr: "أسود منتصف الليل وذهب متوهج",
    swatch: { surface: "#131313", primary: "#f2ca50", secondary: "#c8c8b0" },
    typography: {
      headingFontFamily: "var(--font-cinzel)",
      headingFontFamilyAr: "var(--font-ar-cairo)",
      headingFontVariationSettings: '"wght" 400', 
      bodyFontVariationSettings: '"wght" 300, "wdth" 105',
      letterSpacing: '0.02em', // Less letter spacing for Arabic
      lineHeight: '2.0',
      svgAssets: {
        heroNames: '/themes/nocturne-elegance/hero-names.svg',
        sectionTitle: '/themes/nocturne-elegance/section-title.svg',
      },
    },
    heroMedia: {
      type: 'image',
      src: '/images/hero/theme-6.webp',
      overlay: 'rgba(19, 19, 19, 0.6)',
    },
  },
  {
    id: "video-lumina",
    nameEn: "Video: Lumina Sequence",
    nameAr: "فيديو: تسلسل لومينا",
    taglineEn: "Envelope reveal with looping curtain",
    taglineAr: "فيديو افتتاحي مع خلفية متحركة",
    swatch: { surface: "#0a0a0a", primary: "#c8a55b", secondary: "#1a1a1a" },
    typography: {
      headingFontFamily: "var(--font-betania-patmos)",
      headingFontFamilyAr: "var(--font-ar-tajawal)",
      headingFontVariationSettings: 'normal', 
      bodyFontVariationSettings: '"wght" 400, "wdth" 100',
      letterSpacing: '0.06em',
      lineHeight: '1.5',
      svgAssets: {
        heroNames: '/themes/video-lumina/hero-names.svg',
        sectionTitle: '/themes/video-lumina/section-title.svg',
      },
    },
    heroMedia: {
      type: 'video',
      src: '/videos/curtain-loop-theme7.mp4',
      poster: '/images/hero/theme-7-poster.jpg',
      overlay: 'rgba(10, 10, 10, 0.3)',
    },
  },

  {
    id: "ethereal-union-1-video",
    nameEn: "Ethereal Gold (Video)",
    nameAr: "الذهب الأثيري (فيديو)",
    taglineEn: "Ivory & gold hairlines, serif on serif",
    taglineAr: "عاجي وذهبي بخطوط رفيعة كلاسيكية",
    swatch: { surface: "#faf9f9", primary: "#d4af37", secondary: "#2d2d2d" },
    typography: {
      headingFontFamily: "var(--font-bodoni-moda)",
      headingFontFamilyAr: "var(--font-ar-scheherazade)",
      headingFontVariationSettings: '"wght" 800, "wdth" 100',
      bodyFontVariationSettings: '"wght" 400, "wdth" 100',
      letterSpacing: '0.05em',
      lineHeight: '1.6',
      svgAssets: {
        heroNames: '/themes/ethereal-union-1/hero-names.svg',
        sectionTitle: '/themes/ethereal-union-1/section-title.svg',
      },
    },
    heroMedia: {
      type: 'video',
      src: '/videos/curtain/curtain-theme1.mp4',
      poster: '/images/hero/theme-1-poster.jpg',
      overlay: 'rgba(255, 255, 255, 0.4)',
    },
    envelopeSrc: '/videos/envelope/envelope-theme1.mp4',
    envelopeRevealTimestamp: 6.5,
    qrOverlayPosition: { top: '50%', left: '50%' },
    curtainSrc: '/videos/curtain/curtain-theme1.mp4',
    curtainPoster: '/images/hero/theme-1-poster.jpg',
  },
  {
    id: "ethereal-union-2-video",
    nameEn: "Modern Romantic (Video)",
    nameAr: "رومانسي عصري (فيديو)",
    taglineEn: "Blush linen, rose gold & italic serifs",
    taglineAr: "كتان وردي وذهبية وردية بخط مائل",
    swatch: { surface: "#fbf9f8", primary: "#8c4b55", secondary: "#f5e6e8" },
    typography: {
      headingFontFamily: "var(--font-belluccia)",
      headingFontFamilyAr: "var(--font-ar-aref)",
      headingFontVariationSettings: '"wght" 400',
      bodyFontVariationSettings: '"wght" 300, "wdth" 100',
      letterSpacing: '0.02em',
      lineHeight: '1.8',
      svgAssets: {
        heroNames: '/themes/ethereal-union-2/hero-names.svg',
        sectionTitle: '/themes/ethereal-union-2/section-title.svg',
      },
    },
    heroMedia: {
      type: 'video',
      src: '/videos/curtain/curtain-theme2.mp4',
      poster: '/images/hero/theme-2-poster.jpg',
      overlay: 'rgba(255, 255, 255, 0.5)',
    },
    envelopeSrc: '/videos/envelope/envelope-theme2.mp4',
    envelopeRevealTimestamp: 6.5,
    qrOverlayPosition: { top: '50%', left: '50%' },
    curtainSrc: '/videos/curtain/curtain-theme2.mp4',
    curtainPoster: '/images/hero/theme-2-poster.jpg',
  },
  {
    id: "emerald-gilt-video",
    nameEn: "Emerald & Gilt (Video)",
    nameAr: "الزمرد والمذهّب (فيديو)",
    taglineEn: "Mashrabiya geometry & gold leaf frames",
    taglineAr: "هندسة مشربية وإطارات من ورق الذهب",
    swatch: { surface: "#fff8f5", primary: "#06402b", secondary: "#fed65b" },
    typography: {
      headingFontFamily: "var(--font-cinzel-deco)",
      headingFontFamilyAr: "var(--font-ar-amiri)",
      headingFontVariationSettings: '"wght" 700',
      bodyFontVariationSettings: '"wght" 500, "wdth" 90',
      letterSpacing: '0.02em',
      lineHeight: '1.5',
      svgAssets: {
        heroNames: '/themes/emerald-gilt/hero-names.svg',
        sectionTitle: '/themes/emerald-gilt/section-title.svg',
      },
    },
    heroMedia: {
      type: 'video',
      src: '/videos/curtain/curtain-theme3.mp4',
      poster: '/images/hero/theme-3-poster.jpg',
      overlay: 'rgba(6, 64, 43, 0.3)',
    },
    envelopeSrc: '/videos/envelope/envelope-theme3.mp4',
    envelopeRevealTimestamp: 6.5,
    qrOverlayPosition: { top: '50%', left: '50%' },
    curtainSrc: '/videos/curtain/curtain-theme3.mp4',
    curtainPoster: '/images/hero/theme-3-poster.jpg',
  },
  {
    id: "paper-terracotta-video",
    nameEn: "Paper & Terracotta (Video)",
    nameAr: "ورق وطين (فيديو)",
    taglineEn: "Editorial ink with a Mediterranean spark",
    taglineAr: "حبر تحريري بلمسة متوسطية",
    swatch: { surface: "#f9f9f9", primary: "#000000", secondary: "#9f402d" },
    typography: {
      headingFontFamily: "var(--font-domine)",
      headingFontFamilyAr: "var(--font-ar-katibeh)",
      headingFontVariationSettings: '"wght" 900',
      bodyFontVariationSettings: '"wght" 400, "wdth" 100',
      letterSpacing: '-0.02em',
      lineHeight: '1.4',
      svgAssets: {
        heroNames: '/themes/paper-terracotta/hero-names.svg',
        sectionTitle: '/themes/paper-terracotta/section-title.svg',
      },
    },
    heroMedia: {
      type: 'video',
      src: '/videos/curtain/curtain-theme4.mp4',
      poster: '/images/hero/theme-4-poster.jpg',
      overlay: 'rgba(249, 249, 249, 0.6)',
    },
    envelopeSrc: '/videos/envelope/envelope-theme4.mp4',
    envelopeRevealTimestamp: 6.5,
    qrOverlayPosition: { top: '50%', left: '50%' },
    curtainSrc: '/videos/curtain/curtain-theme4.mp4',
    curtainPoster: '/images/hero/theme-4-poster.jpg',
  },
  {
    id: "botanical-hearth-video",
    nameEn: "Botanical Hearth (Video)",
    nameAr: "دفء النباتات (فيديو)",
    taglineEn: "Sun-baked terracotta, sage & scrapbook",
    taglineAr: "طين مشمس وحكاكة سكرابوك دافئة",
    swatch: { surface: "#fcf9f4", primary: "#974400", secondary: "#3c653f" },
    typography: {
      headingFontFamily: "var(--font-kadwa)",
      headingFontFamilyAr: "var(--font-ar-reem)",
      headingFontVariationSettings: '"wght" 500', 
      bodyFontVariationSettings: '"wght" 400, "wdth" 105',
      letterSpacing: '0.04em',
      lineHeight: '1.7',
      svgAssets: {
        heroNames: '/themes/botanical-hearth/hero-names.svg',
        sectionTitle: '/themes/botanical-hearth/section-title.svg',
      },
    },
    heroMedia: {
      type: 'video',
      src: '/videos/curtain/curtain-theme5.mp4',
      poster: '/images/hero/theme-5-poster.jpg',
      overlay: 'rgba(252, 249, 244, 0.5)',
    },
    envelopeSrc: '/videos/envelope/envelope-theme5.mp4',
    envelopeRevealTimestamp: 6.5,
    qrOverlayPosition: { top: '50%', left: '50%' },
    curtainSrc: '/videos/curtain/curtain-theme5.mp4',
    curtainPoster: '/images/hero/theme-5-poster.jpg',
  },
  {
    id: "nocturne-elegance-video",
    nameEn: "Nocturne Elegance (Video)",
    nameAr: "أناقة الليل (فيديو)",
    taglineEn: "Midnight black, glowing champagne gold",
    taglineAr: "أسود منتصف الليل وذهب متوهج",
    swatch: { surface: "#131313", primary: "#f2ca50", secondary: "#c8c8b0" },
    typography: {
      headingFontFamily: "var(--font-cinzel)",
      headingFontFamilyAr: "var(--font-ar-cairo)",
      headingFontVariationSettings: '"wght" 400', 
      bodyFontVariationSettings: '"wght" 300, "wdth" 105',
      letterSpacing: '0.02em',
      lineHeight: '2.0',
      svgAssets: {
        heroNames: '/themes/nocturne-elegance/hero-names.svg',
        sectionTitle: '/themes/nocturne-elegance/section-title.svg',
      },
    },
    heroMedia: {
      type: 'video',
      src: '/videos/curtain/curtain-theme6.mp4',
      poster: '/images/hero/theme-6-poster.jpg',
      overlay: 'rgba(19, 19, 19, 0.6)',
    },
    envelopeSrc: '/videos/envelope/envelope-theme6.mp4',
    envelopeRevealTimestamp: 6.5,
    qrOverlayPosition: { top: '50%', left: '50%' },
    curtainSrc: '/videos/curtain/curtain-theme6.mp4',
    curtainPoster: '/images/hero/theme-6-poster.jpg',
  }

];

export const DEFAULT_THEME: ThemeId = "ethereal-union-1";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

export function getTheme(id: string): ThemeMeta | undefined {
  return THEMES.find((t) => t.id === id);
}
