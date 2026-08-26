"use client";

import { useUi } from "@/store/ui";
import { bi, t } from "@/lib/i18n";
import { imageUrl, videoEmbedUrl } from "@/lib/drive";
import { Divider } from "@/components/divider";

export interface StoryEntry {
  id: string;
  url: string;
  mediaType: "image" | "video";
  titleEn: string | null;
  titleAr: string | null;
  bodyEn: string | null;
  bodyAr: string | null;
  dateLabel: string | null;
}

export function StoryTimeline({ entries }: { entries: StoryEntry[] }) {
  const language = useUi((s) => s.language);

  if (entries.length === 0) return null;

  return (
    <section id="story" className="section-gap relative">
      <div className="theme-pattern-layer" aria-hidden />
      <div className="container-wedding">
        <div className="mb-14 md:mb-20">
          <div className="section-head mb-8">
            <h2 className="text-display text-primary">{t("ourStory", language)}</h2>
          </div>
          <div className="mx-auto max-w-xs">
            <Divider />
          </div>
        </div>

        <ol className="relative mx-auto max-w-4xl">
          <span
            className="absolute start-4 top-0 h-full w-px md:start-1/2"
            style={{ background: "color-mix(in srgb, var(--t-outline-variant) 70%, transparent)" }}
            aria-hidden
          />
          {entries.map((entry, index) => {
            const isStart = index % 2 === 0;
            return (
              <li
                key={entry.id}
                className={`relative mb-12 ps-12 last:mb-0 md:mb-16 md:w-1/2 md:ps-0 ${
                  isStart ? "" : "md:ms-auto"
                }`}
              >
                {/* dot on the line */}
                <span
                  className={`absolute top-6 z-10 size-3 rounded-full border ${
                    isStart
                      ? "max-md:start-4 max-md:-translate-x-1/2 md:end-0 md:translate-x-1/2"
                      : "start-4 -translate-x-1/2 rtl:translate-x-1/2 md:start-0"
                  }`}
                  style={{
                    borderColor: "var(--t-primary)",
                    background: "var(--t-background)",
                  }}
                  aria-hidden
                />

                <div className={isStart ? "md:pe-12 md:text-end" : "md:ps-12"}>
                  {entry.dateLabel ? (
                    <p className="text-label-caps mb-2 text-secondary">{entry.dateLabel}</p>
                  ) : null}
                  <h3 className="text-headline text-on-surface">
                    {bi({ en: entry.titleEn, ar: entry.titleAr }, language)}
                  </h3>
                  {entry.bodyEn || entry.bodyAr ? (
                    <p className="text-body-lg mt-3 text-on-surface-variant">
                      {bi({ en: entry.bodyEn, ar: entry.bodyAr }, language)}
                    </p>
                  ) : null}
                  <div className="polaroid mt-5 inline-block">
                    <div className="image-frame aspect-[4/3] w-full max-w-sm overflow-hidden">
                      {entry.mediaType === "video" ? (
                        <iframe
                          src={videoEmbedUrl(entry.url) ?? entry.url}
                          allow="encrypted-media"
                          allowFullScreen
                          title={entry.titleEn ?? entry.titleAr ?? "Video"}
                          loading="lazy"
                          className="h-full w-full"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={imageUrl(entry.url)}
                          alt={entry.titleEn ?? entry.titleAr ?? ""}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
