import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { HtmlSync } from "@/components/html-sync";
import { getSettings } from "@/lib/settings";
import "./globals.css";

// Primary body font (using Google Fonts as the single variable body text font)
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

// Local fonts mapped to themes
const bodoniModa = localFont({ src: "../../public/fonts/Bodoni_Moda.ttf", variable: "--font-bodoni-moda", display: "swap", weight: "100 900" });
const belluccia = localFont({ src: "../../public/fonts/Belluccia.ttf", variable: "--font-belluccia", display: "swap", weight: "400" });
const cinzel = localFont({ src: "../../public/fonts/Cinzel.ttf", variable: "--font-cinzel", display: "swap", weight: "100 900" });
const cinzelDeco = localFont({ src: "../../public/fonts/Cinzel_Decorative.ttf", variable: "--font-cinzel-deco", display: "swap", weight: "400" });
const domine = localFont({ src: "../../public/fonts/Domine.ttf", variable: "--font-domine", display: "swap", weight: "100 900" });
const betaniaPatmos = localFont({ src: "../../public/fonts/Betania_Patmos.ttf", variable: "--font-betania-patmos", display: "swap", weight: "400" });
const kadwa = localFont({ src: "../../public/fonts/Kadwa.ttf", variable: "--font-kadwa", display: "swap", weight: "400" });

// Arabic Fonts
const arScheherazade = localFont({ src: "../../public/fonts/arabic/Scheherazade_New.ttf", variable: "--font-ar-scheherazade", display: "swap", weight: "400" });
const arArefRuqaa = localFont({ src: "../../public/fonts/arabic/Aref_Ruqaa.ttf", variable: "--font-ar-aref", display: "swap", weight: "400" });
const arAmiri = localFont({ src: "../../public/fonts/arabic/Amiri.ttf", variable: "--font-ar-amiri", display: "swap", weight: "400" });
const arKatibeh = localFont({ src: "../../public/fonts/arabic/Katibeh.ttf", variable: "--font-ar-katibeh", display: "swap", weight: "400" });
const arReemKufi = localFont({ src: "../../public/fonts/arabic/Reem_Kufi.ttf", variable: "--font-ar-reem", display: "swap", weight: "400" });
const arCairo = localFont({ src: "../../public/fonts/arabic/Cairo.ttf", variable: "--font-ar-cairo", display: "swap", weight: "400" });
const arTajawal = localFont({ src: "../../public/fonts/arabic/Tajawal.ttf", variable: "--font-ar-tajawal", display: "swap", weight: "400" });

// Configure our single variable font (which must support Arabic and Latin wide axes)
// NOTE: Uncomment this once you place your variable font in /public/fonts/
/*
const customVariableFont = localFont({
  src: "../../public/fonts/variable-font.woff2",
  variable: "--font-variable",
  weight: "100 900",
  display: "swap",
});
*/

export const metadata: Metadata = {
  title: "Amira & Khalid — Wedding Platform",
  description:
    "A bilingual wedding invitation platform with multiple switchable design themes.",
};

/**
 * Pre-paint bootstrap: applies the visitor's persisted language and (on the
 * public demo only) their persisted theme preview before first paint to
 * avoid any flash of the wrong language/theme. Mirrors zustand persist data.
 */
const uiBootstrap = `
try {
  var raw = localStorage.getItem('wedding-ui');
  var h = document.documentElement;
  if (raw) {
    var s = JSON.parse(raw).state || {};
    if (s.language === 'ar') { h.lang = 'ar'; h.dir = 'rtl'; }
    if (s.language === 'en') { h.lang = 'en'; h.dir = 'ltr'; }
    if (s.previewTheme && location.pathname.indexOf('/demo') === 0) {
      h.setAttribute('data-theme', s.previewTheme);
    }
  }
} catch (e) {}
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html
      lang="en"
      dir="ltr"
      data-theme={settings.active_theme}
      suppressHydrationWarning
      className={`h-full antialiased ${inter.variable} ${bodoniModa.variable} ${belluccia.variable} ${cinzel.variable} ${cinzelDeco.variable} ${domine.variable} ${betaniaPatmos.variable} ${kadwa.variable} ${arScheherazade.variable} ${arArefRuqaa.variable} ${arAmiri.variable} ${arKatibeh.variable} ${arReemKufi.variable} ${arCairo.variable} ${arTajawal.variable} font-variable`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: uiBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col">
        <HtmlSync baseTheme={settings.active_theme} />
        {children}
      </body>
    </html>
  );
}
