"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarPlus, QrCode, Users } from "lucide-react";
import { useUi } from "@/store/ui";
import { t } from "@/lib/i18n";
import type { SettingsMap } from "@/lib/settings";
import { downloadIcs, parseDateTime } from "@/lib/ics";
import { Divider } from "@/components/divider";
import { Sparkles } from "@/components/site/sparkles";
import { imageUrl } from "@/lib/drive";

export interface InviteData {
  family: {
    id: string;
    nameAr: string;
    nameEn: string;
    guestCount: number;
    rsvpStatus: string;
  };
  settings: SettingsMap;
  qrSrc: string;
  fullInviteUrl: string;
}

export function InviteClient({ family, settings, qrSrc }: InviteData) {
  const language = useUi((s) => s.language);
  const otherLang = language === "en" ? "ar" : "en";
  const [status, setStatus] = useState<string>(family.rsvpStatus);
  const [sending, setSending] = useState(false);
  const [showQr, setShowQr] = useState(true);

  const date = settings[`wedding_date_${language}`];
  const time = settings[`wedding_time_${language}`];
  const venue = settings[`venue_${language}`];
  const deadline = settings[`rsvp_deadline_${language}`];
  const familyName = language === "en" ? family.nameEn : family.nameAr;

  async function respond(next: "CONFIRMED" | "DECLINED") {
    setSending(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyId: family.id, status: next }),
      });
      if (res.ok) setStatus(next);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* soft backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: settings.hero_image_url
            ? `linear-gradient(to bottom, var(--hero-overlay-a), var(--hero-overlay-b)), url(${imageUrl(settings.hero_image_url)})`
            : undefined,
          backgroundSize: "cover",

          backgroundPosition: "center",
        }}
      />
      <div className="theme-pattern-layer" aria-hidden />
      <Sparkles count={16} />

      <header className="relative z-10 pt-6 text-center">
        <Link href="/demo" className="font-display text-xl text-primary md:text-2xl">
          {settings.couple_monogram}
        </Link>
      </header>

      <div className="container-wedding relative z-10 my-auto flex max-w-xl flex-col items-center py-12 text-center">
        <p className="script-accent mb-6 text-3xl text-secondary">{t("youAreInvited", language)}</p>

        <h1 className="text-display text-primary">{familyName}</h1>
        <p
          className="font-display mt-2 text-lg opacity-70"
          dir={otherLang === "ar" ? "rtl" : "ltr"}
          lang={otherLang}
        >
          {otherLang === "en" ? family.nameEn : family.nameAr}
        </p>

        <div className="my-7 w-full max-w-[240px]">
          <Divider />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="chip">
            <Users className="size-3.5" />
            {family.guestCount} {t("seats", language)}
          </span>
          <span className="chip">{date}</span>
          {time ? <span className="chip">{time}</span> : null}
        </div>
        <p className="text-body-lg mt-4 text-secondary">{venue}</p>

        {/* QR code */}
        <div className="card qr-card double-frame mt-9 flex w-full flex-col items-center p-6">
          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            className="flex cursor-pointer items-center gap-2 text-label-caps text-secondary"
            aria-expanded={showQr}
          >
            <QrCode className="size-4" />
            {t("scanAtEntrance", language)}
          </button>
          {showQr ? (
            <Image
              src={qrSrc}
              alt={`QR — ${familyName}`}
              unoptimized
              width={180}
              height={180}
              className="mt-4 size-44 rounded-lg border border-neutral-200 bg-white p-2"
            />
          ) : null}
        </div>

        {/* RSVP */}
        <div className="card-tonal mt-8 w-full p-6 md:p-8">
          {status === "CONFIRMED" ? (
            <p className="text-body-lg text-on-surface-variant">{t("thanksConfirmed", language)}</p>
          ) : status === "DECLINED" ? (
            <p className="text-body-lg text-on-surface-variant">{t("thanksDeclined", language)}</p>
          ) : (
            <>
              <p className="text-body mb-5 text-on-surface-variant">{deadline}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => respond("CONFIRMED")}
                  className="btn-primary w-full disabled:opacity-60 sm:w-auto"
                >
                  {t("willAttend", language)}
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => respond("DECLINED")}
                  className="btn-ghost w-full disabled:opacity-60 sm:w-auto"
                >
                  {t("cantAttend", language)}
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              downloadIcs("wedding-invitation.ics", {
                title: `${settings.couple_name_en} — Wedding`,
                description: `${familyName} — ${family.guestCount} seats`,
                location: settings.venue_address_en || settings.venue_en,
                start:
                  parseDateTime(settings.wedding_date_en, settings.wedding_time_en) ??
                  new Date("2026-10-14T16:00:00"),
                end:
                  new Date(
                    (parseDateTime(settings.wedding_date_en, settings.wedding_time_en) ??
                      new Date("2026-10-14T16:00:00")).getTime() +
                      5 * 60 * 60 * 1000
                  ),
              })
            }
            className="btn-ghost mx-auto mt-5 w-full sm:w-auto"
          >
            <CalendarPlus className="size-4" />
            {t("addToCalendar", language)}
          </button>
        </div>
      </div>

      <footer className="relative z-10 pb-8 text-center">
        <p className="text-label-caps opacity-50">Generated by gencode</p>
      </footer>
    </main>
  );
}
