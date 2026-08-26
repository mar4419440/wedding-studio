"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { useUi } from "@/store/ui";

interface SettingsManagerProps {
  initialSettings: Record<string, string>;
}

const TEXT_FIELDS = [
  { key: "couple_name_en", label: "Couple names (EN)", dir: "ltr" },
  { key: "couple_name_ar", label: "أسماء العروسين (AR)", dir: "rtl" },
  { key: "wedding_date_en", label: "Wedding date (EN)", dir: "ltr" },
  { key: "wedding_date_ar", label: "تاريخ الزفاف (AR)", dir: "rtl" },
  { key: "wedding_time_en", label: "Time (EN)", dir: "ltr" },
  { key: "wedding_time_ar", label: "الوقت (AR)", dir: "rtl" },
  { key: "venue_en", label: "Venue (EN)", dir: "ltr" },
  { key: "venue_ar", label: "المكان (AR)", dir: "rtl" },
  { key: "venue_address_en", label: "Address (EN)", dir: "ltr" },
  { key: "venue_address_ar", label: "العنوان (AR)", dir: "rtl" },
] as const;

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const language = useUi((s) => s.language);
  const [activeTheme, setActiveTheme] = useState(initialSettings.active_theme ?? "");
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const f of TEXT_FIELDS) out[f.key] = initialSettings[f.key] ?? "";
    for (const key of [
      "map_embed_url",
      "hero_image_url",
      "rsvp_deadline_en",
      "rsvp_deadline_ar",
    ]) {
      out[key] = initialSettings[key] ?? "";
    }
    return out;
  });
  const [saved, setSaved] = useState<null | "theme" | "details">(null);
  const [busy, setBusy] = useState(false);

  async function patch(payload: Record<string, string>, kind: "theme" | "details") {
    setBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(kind);
        setTimeout(() => setSaved(null), 2000);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-stone-500">
          The chosen theme applies to the public site and every guest invitation.
        </p>
      </header>

      {/* Theme picker */}
      <section className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <Palette className="size-4 text-stone-500" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Active design theme
          </h2>
          {saved === "theme" ? (
            <span className="ms-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              Theme saved ✓
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme) => {
            const active = theme.id === activeTheme;
            return (
              <button
                key={theme.id}
                type="button"
                disabled={busy}
                onClick={() => {
                  setActiveTheme(theme.id);
                  patch({ active_theme: theme.id }, "theme");
                }}
                aria-pressed={active}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 text-start transition-all disabled:opacity-60 ${
                  active
                    ? "border-stone-900 shadow-md"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <span
                  className="flex h-16 items-end p-3"
                  style={{
                    background: `linear-gradient(120deg, ${theme.swatch.surface} 0%, ${theme.swatch.secondary} 55%, ${theme.swatch.primary} 100%)`,
                  }}
                >
                  <span
                    className={`font-display text-lg ${
                      ["luxury-dark", "traditional-arabic"].includes(theme.id)
                        ? "text-white/90"
                        : "text-stone-800/80"
                    }`}
                  >
                    A&amp;K
                  </span>
                </span>
                <span className="block p-3">
                  <span className="block text-sm font-semibold">
                    {language === "en" ? theme.nameEn : theme.nameAr}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-stone-400">
                    {language === "en" ? theme.taglineEn : theme.taglineAr}
                  </span>
                </span>
                {active ? (
                  <span className="absolute end-2.5 top-2.5 flex size-6 items-center justify-center rounded-full bg-stone-900 text-white">
                    <Check className="size-3.5" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {/* Wedding details */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Wedding details
          </h2>
          {saved === "details" ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              Details saved ✓
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <label key={field.key} className="block text-xs font-semibold text-stone-500">
              {field.label}
              <input
                dir={field.dir}
                lang={field.dir === "rtl" ? "ar" : "en"}
                value={fields[field.key] ?? ""}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className={`mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 ${
                  field.dir === "rtl" ? "text-right" : ""
                }`}
              />
            </label>
          ))}

          <label className="block text-xs font-semibold text-stone-500 sm:col-span-2">
            Hero image link (Drive or any public URL)
            <input
              dir="ltr"
              value={fields.hero_image_url}
              onChange={(e) => setFields((p) => ({ ...p, hero_image_url: e.target.value }))}
              placeholder="https://drive.google.com/file/d/…/view"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </label>

          <label className="block text-xs font-semibold text-stone-500 sm:col-span-2">
            Map embed URL (OpenStreetMap embed)
            <input
              dir="ltr"
              value={fields.map_embed_url}
              onChange={(e) => setFields((p) => ({ ...p, map_embed_url: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </label>

          <label className="block text-xs font-semibold text-stone-500">
            RSVP deadline (EN)
            <input
              dir="ltr"
              value={fields.rsvp_deadline_en}
              onChange={(e) => setFields((p) => ({ ...p, rsvp_deadline_en: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </label>
          <label className="block text-xs font-semibold text-stone-500">
            موعد الرد (AR)
            <input
              dir="rtl"
              lang="ar"
              value={fields.rsvp_deadline_ar}
              onChange={(e) => setFields((p) => ({ ...p, rsvp_deadline_ar: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => patch(fields, "details")}
          className="mt-5 w-full cursor-pointer rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-stone-700 disabled:opacity-60 sm:w-auto sm:min-w-56"
        >
          {busy ? "Saving…" : "Save details"}
        </button>
      </section>

      {/* Security note */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-relaxed text-stone-500">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-stone-500">
          Admin access
        </h2>
        The admin password is configured via the <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code>{" "}
        environment variable in <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">.env</code>.
        Change it before sharing the dashboard with the couple.
      </section>
    </div>
  );
}
