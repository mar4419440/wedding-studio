"use client";

import { useUi } from "@/store/ui";
import { bi, t } from "@/lib/i18n";
import type { SettingsMap } from "@/lib/settings";
import { Divider } from "@/components/divider";
import { Sparkles } from "@/components/site/sparkles";

export function HeroSection({ settings }: { settings: SettingsMap }) {
  const language = useUi((s) => s.language);
  const otherLang = language === "en" ? "ar" : "en";

  const names =
    language === "en" ? settings.couple_name_en : settings.couple_name_ar;
  const secondaryNames = settings[`couple_name_${otherLang}`];
  const date = settings[`wedding_date_${language}`];
  const time = settings[`wedding_time_${language}`];
  const venue = settings[`venue_${language}`];

  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pt-24"
      style={{
        backgroundImage: `linear-gradient(to bottom, var(--hero-overlay-a), var(--hero-overlay-b)), url(${settings.hero_image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Sparkles />
      <div className="theme-pattern-layer" aria-hidden />

      <div className="container-wedding relative z-10 flex flex-col items-center pb-16 text-center">
        <p className="text-label-caps mb-6 text-secondary">{settings[`kicker_${language}`]}</p>

        <h1 className="text-display text-primary">{names}</h1>
        <p
          className="font-display mt-3 text-xl opacity-70 md:text-2xl"
          dir={otherLang === "ar" ? "rtl" : "ltr"}
          lang={otherLang}
        >
          {secondaryNames}
        </p>

        <div className="my-8 w-full max-w-xs">
          <Divider />
        </div>

        <p className="text-headline text-on-surface-variant">{date}</p>
        {time ? (
          <p className="text-label-caps mt-2 tracking-[0.25em] text-secondary">{time}</p>
        ) : null}

        <p className="text-body-lg mt-4 text-secondary">{venue}</p>

        <a href="#details" className="btn-primary mt-10">
          {t("eventDetails", language)}
        </a>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 opacity-70">
        <span className="text-label-caps text-on-surface-variant">
          {t("scrollExplore", language)}
        </span>
        <span
          className="h-10 w-px"
          style={{ background: "var(--t-outline-variant)" }}
          aria-hidden
        />
      </div>
    </section>
  );
}

/** Small helper so `bi` import is used symmetrically across sections. */
export function KickerText({ en, ar }: { en?: string; ar?: string }) {
  const language = useUi((s) => s.language);
  return <>{bi({ en, ar }, language)}</>;
}
