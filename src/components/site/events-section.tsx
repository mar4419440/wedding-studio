"use client";

import { CalendarPlus, MapPin } from "lucide-react";
import { useUi } from "@/store/ui";
import { t } from "@/lib/i18n";
import { downloadIcs, parseDateTime } from "@/lib/ics";
import type { SettingsMap } from "@/lib/settings";
import { Divider } from "@/components/divider";

export function EventsSection({ settings }: { settings: SettingsMap }) {
  const language = useUi((s) => s.language);

  const date = settings[`wedding_date_${language}`];
  const time = settings[`wedding_time_${language}`];
  const venue = settings[`venue_${language}`];
  const address = settings[`venue_address_${language}`];

  function handleAddToCalendar() {
    const start =
      parseDateTime(settings.wedding_date_en, settings.wedding_time_en) ??
      new Date("2026-10-14T16:00:00");
    const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
    downloadIcs("wedding-invitation.ics", {
      title: `${settings.couple_name_en} — Wedding`,
      description: settings.rsvp_deadline_en,
      location: settings.venue_address_en || settings.venue_en,
      start,
      end,
    });
  }

  return (
    <section id="details" className="section-gap relative">
      <div className="theme-pattern-layer" aria-hidden />
      <div className="container-wedding">
        <div className="mb-12">
          <div className="section-head mb-8">
            <h2 className="text-display text-primary">{t("whenWhere", language)}</h2>
          </div>
          <div className="mx-auto max-w-xs">
            <Divider />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Details card */}
          <div className="card floral-corner double-frame flex flex-col justify-between p-8 text-center md:p-12">
            <div>
              <h3 className="text-headline mt-6 text-primary">{venue}</h3>
              <p className="text-body-lg mt-4 text-on-surface-variant">{date}</p>
              {time ? (
                <p className="text-label-caps mt-2 tracking-[0.25em] text-secondary">{time}</p>
              ) : null}
              <p className="text-body mt-4 text-on-surface-variant">{address}</p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <button type="button" onClick={handleAddToCalendar} className="btn-primary w-full sm:w-auto">
                <CalendarPlus className="size-4" />
                {t("addToCalendar", language)}
              </button>
              <a
                className="btn-ghost"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || venue)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin className="size-4" />
                {t("openMap", language)}
              </a>
            </div>
          </div>

          {/* Map */}
          <div
            className="image-frame min-h-[320px] overflow-hidden bg-surface-container"
            style={{ minHeight: "380px" }}
          >
            <iframe
              title="Venue map"
              src={settings.map_embed_url}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[380px] w-full border-0"
            />
          </div>
        </div>

        {/* Personalized invitation note */}
        <div id="invitation-note" className="card-tonal mx-auto mt-10 max-w-2xl p-8 text-center scroll-mt-28 md:p-10">
          <h3 className="text-headline text-primary">{t("invitations", language)}</h3>
          <p className="text-body-lg mt-4 text-on-surface-variant">
            {language === "en"
              ? "Invitations are personalized for each family and delivered by a private link with its own QR code. Please use the link you received, or contact the couple to get yours."
              : "الدعوات مُخصصة لكل عائلة وتُسلَّم عبر رابط خاص مع رمز استجابة سريعة خاص بها. يرجى استخدام الرابط الذي وصلكم، أو التواصل مع العروسين للحصول على دعوتكم."}
          </p>
          <p className="text-label-caps mt-4 text-secondary">{t("personalLink", language)}</p>
        </div>
      </div>
    </section>
  );
}
