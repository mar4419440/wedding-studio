"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { useUi } from "@/store/ui";

export function CatalogClient() {
  const language = useUi((s) => s.language);
  const toggleLanguage = useUi((s) => s.toggleLanguage);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-widest text-stone-400">
          Wedding Studio
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="cursor-pointer rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-900"
          >
            {language === "en" ? "العربية" : "English"}
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-900"
          >
            <Lock className="size-3.5" />
            {language === "en" ? "Admin" : "الإدارة"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:pt-16">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          {language === "en"
            ? "Six designs. One wedding."
            : "ستة تصاميم. حفل زفاف واحد."}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-500">
          {language === "en"
            ? "Pick a design style and preview the full bilingual site live — hero, our story, memories gallery and event details. The couple sets the final theme from the admin dashboard; guests receive personalized QR invitations rendered in that style."
            : "اختر نمط التصميم وشاهد الموقع ثنائي اللغة مباشرة — الواجهة، قصتنا، معرض الذكريات وتفاصيل الحفل. يحدد العروسين النمط النهائي من لوحة الإدارة؛ ويتسلم الضيوف دعوات مخصصة برمز QR بنفس النمط."}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme, index) => (
            <Link
              key={theme.id}
              href={`/demo/preview?theme=${theme.id}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="relative flex h-32 items-end p-4"
                style={{
                  background: `linear-gradient(120deg, ${theme.swatch.surface} 0%, ${theme.swatch.secondary} 55%, ${theme.swatch.primary} 100%)`,
                }}
              >
                <span
                  className={`font-display text-2xl ${
                    theme.id === "nocturne-elegance" || theme.id === "emerald-gilt"
                      ? "text-white/90 drop-shadow"
                      : "text-stone-800/80"
                  }`}
                >
                  A&amp;K
                </span>
                <span className="absolute end-4 top-4 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-stone-500 backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold">
                  {language === "en" ? theme.nameEn : theme.nameAr}
                </h2>
                <p className="mt-1 line-clamp-2 min-h-[2rem] text-sm text-stone-500">
                  {language === "en" ? theme.taglineEn : theme.taglineAr}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex gap-1.5">
                    {[theme.swatch.surface, theme.swatch.primary, theme.swatch.secondary].map(
                      (color) => (
                        <span
                          key={color}
                          className="size-4 rounded-full ring-1 ring-black/10"
                          style={{ background: color }}
                        />
                      )
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-stone-400 transition-colors group-hover:text-stone-700">
                    {language === "en" ? "Live preview" : "معاينة مباشرة"}
                    {language === "en" ? (
                      <ArrowRight className="size-3.5 rtl:hidden" />
                    ) : (
                      <ArrowLeft className="size-3.5" />
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-6">
          <span className="rounded-full bg-stone-100 p-3">
            <Mail className="size-5 text-stone-500" />
          </span>
          <div>
            <h3 className="font-semibold">
              {language === "en" ? "Looking for your invitation?" : "تبحث عن دعوتك؟"}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-500">
              {language === "en"
                ? "Every family receives a private invitation link with a personal QR code for entrance check-in. Open the link you received on your phone."
                : "تتلقى كل عائلة رابط دعوة خاصًا مع رمز QR شخصي لتسجيل الحضور عند المدخل. افتح الرابط الذي وصلكم على هاتفكم."}
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400">
        Generated by gencode
      </footer>
    </div>
  );
}
