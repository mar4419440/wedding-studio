import type { Metadata } from "next";
import {
  Amiri,
  EB_Garamond,
  Inter,
  Noto_Serif,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Source_Serif_4,
} from "next/font/google";
import { HtmlSync } from "@/components/html-sync";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const garamond = EB_Garamond({ variable: "--font-garamond", subsets: ["latin"] });
const notoSerif = Noto_Serif({ variable: "--font-noto-serif", subsets: ["latin"] });
const sourceSerif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Amira & Khalid — Wedding Platform",
  description:
    "A bilingual wedding invitation platform with six switchable design themes.",
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
      className={`${playfair.variable} ${garamond.variable} ${notoSerif.variable} ${sourceSerif.variable} ${jakarta.variable} ${inter.variable} ${amiri.variable} h-full antialiased`}
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
