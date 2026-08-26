"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useUi } from "@/store/ui";
import { isDriveVideo, imageUrl, videoEmbedUrl } from "@/lib/drive";

export interface GalleryImage {
  id: string;
  url: string;
  mediaType: "image" | "video";
  captionEn: string | null;
  captionAr: string | null;
  eventTag: string | null;
}

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const language = useUi((s) => s.language);
  const image = images[index];

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  if (!image) return null;

  const caption =
    language === "ar" ? image.captionAr || image.captionEn : image.captionEn || image.captionAr;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute end-5 top-5 cursor-pointer rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        onClick={onClose}
      >
        <X className="size-6" />
      </button>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous"
            className="absolute start-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
          >
            <ChevronLeft className="size-7 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute end-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
          >
            <ChevronRight className="size-7 rtl:rotate-180" />
          </button>
        </>
      ) : null}

      <figure
        className="flex max-h-full max-w-4xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {image.mediaType === "video" ? (
          isDriveVideo(image.url) ? (
            <iframe
              key={image.id}
              src={videoEmbedUrl(image.url) ?? ""}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={caption ?? "Video"}
              className="aspect-video w-[min(90vw,64rem)] rounded-sm border-0"
            />
          ) : (
            <video
              key={image.id}
              src={image.url}
              controls
              autoPlay
              playsInline
              className="max-h-[78vh] w-auto max-w-full rounded-sm"
            />
          )
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl(image.url)}
            alt={caption ?? ""}
            className="max-h-[78vh] w-auto max-w-full rounded-sm object-contain"
          />
        )}
        {caption ? (
          <figcaption className="text-center text-sm text-white/75">{caption}</figcaption>
        ) : null}
      </figure>
    </div>
  );
}
