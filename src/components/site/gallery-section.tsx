"use client";

import { useMemo, useState } from "react";
import { useUi } from "@/store/ui";
import { t } from "@/lib/i18n";
import { isDriveVideo, imageUrl, videoEmbedUrl } from "@/lib/drive";
import { Divider } from "@/components/divider";
import { Lightbox, type GalleryImage } from "@/components/site/lightbox";

export type { GalleryImage };

const TAGS = ["all", "engagement", "henna", "wedding", "other"] as const;
type Tag = (typeof TAGS)[number];

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const language = useUi((s) => s.language);
  const [filter, setFilter] = useState<Tag>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? images : images.filter((img) => (img.eventTag ?? "other") === filter)),
    [images, filter]
  );

  return (
    <section id="memories" className="section-gap bg-surface-container-low">
      <div className="container-wedding">
        <div className="mb-10">
          <div className="section-head mb-8">
            <h2 className="text-display text-primary">{t("momentsTitle", language)}</h2>
          </div>
          <div className="mx-auto max-w-xs">
            <Divider />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              className={`text-label-caps cursor-pointer rounded-full border px-4 py-1.5 transition-colors ${
                filter === tag ? "" : "hover:text-primary"
              }`}
              style={
                filter === tag
                  ? { background: "var(--t-primary)", borderColor: "var(--t-primary)", color: "var(--t-on-primary)" }
                  : { borderColor: "var(--t-outline-variant)", color: "var(--t-on-surface-variant)" }
              }
            >
              {t(tag, language)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-body text-center text-on-surface-variant">{t("noPhotos", language)}</p>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {filtered.map((image, index) => {
              const caption =
                language === "ar"
                  ? image.captionAr || image.captionEn
                  : image.captionEn || image.captionAr;
              return (
                <figure
                  key={image.id}
                  className="group break-inside-avoid cursor-zoom-in"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="polaroid">
                    <div className="image-frame relative aspect-[4/5] overflow-hidden">
                      {image.mediaType === "video" ? (
                        isDriveVideo(image.url) ? (
                          <iframe
                            src={videoEmbedUrl(image.url) ?? ""}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title={caption ?? "Video"}
                            loading="lazy"
                            className="h-full w-full"
                          />
                        ) : (
                          <video
                            src={image.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={imageUrl(image.url)}
                          alt={caption ?? ""}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      {image.mediaType === "video" ? (
                        <span
                          className="pointer-events-none absolute bottom-2 end-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm"
                        >
                          ▶ Video
                        </span>
                      ) : null}
                    </div>
                    {caption ? (
                      <figcaption className="text-body mt-3 text-center text-xs text-on-surface-variant">
                        {caption}
                      </figcaption>
                    ) : null}
                  </div>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </section>
  );
}
