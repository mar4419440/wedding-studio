"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Film,
  Image as ImageIcon,
  Link2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { imageUrl, isDriveVideo, videoEmbedUrl } from "@/lib/drive";

interface MediaRow {
  id: string;
  kind: "gallery" | "story";
  url: string;
  mediaType: "image" | "video";
  captionAr: string | null;
  captionEn: string | null;
  titleAr: string | null;
  titleEn: string | null;
  bodyAr: string | null;
  bodyEn: string | null;
  dateLabel: string | null;
  eventTag: string | null;
  order: number;
}

const TAGS = ["engagement", "henna", "wedding", "other"];

export function MediaManager() {
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [filterKind, setFilterKind] = useState<"all" | "gallery" | "story">("all");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form state
  const [link, setLink] = useState("");
  const [addType, setAddType] = useState<"image" | "video">("image");
  const [addKind, setAddKind] = useState<"gallery" | "story">("gallery");
  const [addTag, setAddTag] = useState("wedding");
  const [addCaptionEn, setAddCaptionEn] = useState("");
  const [addCaptionAr, setAddCaptionAr] = useState("");
  const [addTitleEn, setAddTitleEn] = useState("");
  const [addTitleAr, setAddTitleAr] = useState("");
  const [addBodyEn, setAddBodyEn] = useState("");
  const [addBodyAr, setAddBodyAr] = useState("");
  const [addDateLabel, setAddDateLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media as MediaRow[]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addMedia(event: React.FormEvent) {
    event.preventDefault();
    if (!link.trim()) return;
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: link,
          mediaType: addType,
          kind: addKind,
          eventTag: addTag,
          captionEn: addCaptionEn || undefined,
          captionAr: addCaptionAr || undefined,
          titleEn: addTitleEn || undefined,
          titleAr: addTitleAr || undefined,
          bodyEn: addBodyEn || undefined,
          bodyAr: addBodyAr || undefined,
          dateLabel: addDateLabel || undefined,
          order: Math.floor(Date.now() / 1000),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAddError(data.error ?? "Failed to add media.");
        return;
      }
      setLink("");
      setAddCaptionEn("");
      setAddCaptionAr("");
      setAddTitleEn("");
      setAddTitleAr("");
      setAddBodyEn("");
      setAddBodyAr("");
      setAddDateLabel("");
      load();
    } finally {
      setAdding(false);
    }
  }

  async function patchMedia(id: string, data: Partial<MediaRow>) {
    await fetch(`/api/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function deleteMedia(id: string) {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    load();
  }

  const filtered =
    filterKind === "all" ? media : media.filter((m) => m.kind === filterKind);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Media</h1>
        <p className="mt-1 text-sm text-stone-500">
          Photos &amp; videos are embedded from links — nothing is stored on the
          server. For Google Drive, paste a share link and make sure access is{" "}
          <strong>“Anyone with the link”</strong>.
        </p>
      </header>

      {/* Add by link */}
      <form
        onSubmit={addMedia}
        className="rounded-2xl border border-stone-200 bg-white p-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-bold text-stone-700">
            <Link2 className="size-4" />
            Add media
          </span>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
            image or video · Drive / any direct link
          </span>
        </div>

        <input
          dir="ltr"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
          required
          className="mt-3 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-stone-500"
        />

        <div className="mt-3 flex flex-wrap gap-3">
          <SegmentedControl
            options={[
              { value: "image", label: "Image", icon: ImageIcon },
              { value: "video", label: "Video", icon: Film },
            ]}
            value={addType}
            onChange={(v) => setAddType(v as "image" | "video")}
          />
          <select
            value={addKind}
            onChange={(e) => setAddKind(e.target.value as "gallery" | "story")}
            className="cursor-pointer rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
          >
            <option value="gallery">→ Memories gallery</option>
            <option value="story">→ Our Story timeline</option>
          </select>
          <select
            value={addTag}
            onChange={(e) => setAddTag(e.target.value)}
            className="cursor-pointer rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
          >
            {TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding}
            className="ms-auto flex cursor-pointer items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
          >
            <Plus className="size-4" />
            {adding ? "Adding…" : "Add"}
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {addKind === "gallery" ? (
            <>
              <input
                dir="ltr"
                value={addCaptionEn}
                onChange={(e) => setAddCaptionEn(e.target.value)}
                placeholder="Caption (English)"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
              />
              <input
                dir="rtl"
                lang="ar"
                value={addCaptionAr}
                onChange={(e) => setAddCaptionAr(e.target.value)}
                placeholder="التسمية (بالعربي)"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
              />
            </>
          ) : (
            <>
              <input
                dir="ltr"
                value={addTitleEn}
                onChange={(e) => setAddTitleEn(e.target.value)}
                placeholder="Title (English)"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
              />
              <input
                dir="rtl"
                lang="ar"
                value={addTitleAr}
                onChange={(e) => setAddTitleAr(e.target.value)}
                placeholder="العنوان (بالعربي)"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
              />
              <textarea
                dir="ltr"
                rows={2}
                value={addBodyEn}
                onChange={(e) => setAddBodyEn(e.target.value)}
                placeholder="Story text (English)"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 sm:col-span-2"
              />
              <textarea
                dir="rtl"
                lang="ar"
                rows={2}
                value={addBodyAr}
                onChange={(e) => setAddBodyAr(e.target.value)}
                placeholder="نص القصة (بالعربي)"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500 sm:col-span-2"
              />
              <input
                dir="ltr"
                value={addDateLabel}
                onChange={(e) => setAddDateLabel(e.target.value)}
                placeholder="Date label (e.g. June 2021)"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
              />
            </>
          )}
        </div>

        {addError ? <p className="mt-3 text-sm text-rose-600">{addError}</p> : null}
      </form>

      {/* Filter */}
      <div className="mt-6 mb-4 flex gap-2">
        {(["all", "gallery", "story"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setFilterKind(kind)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filterKind === kind
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
            }`}
          >
            {kind === "all" ? "All media" : kind === "gallery" ? "Memories gallery" : "Story timeline"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading && media.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-400">
          No media yet — paste your first Drive link above.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) =>
            editingId === item.id ? (
              <EditCard
                key={item.id}
                item={item}
                onCancel={() => setEditingId(null)}
                onSave={async (data) => {
                  await patchMedia(item.id, data);
                  setEditingId(null);
                }}
              />
            ) : (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <div className="relative aspect-video bg-stone-100">
                  {item.mediaType === "video" ? (
                    isDriveVideo(item.url) ? (
                      <iframe
                        src={videoEmbedUrl(item.url) ?? ""}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={item.captionEn ?? "Video"}
                        className="h-full w-full"
                      />
                    ) : (
                      <video
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imageUrl(item.url)}
                      alt={item.captionEn ?? ""}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute start-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                    {item.kind} · {item.mediaType}
                  </span>
                </div>

                <div className="p-3.5">
                  <p className="truncate text-sm font-medium">
                    {item.captionEn || item.captionAr || item.titleEn || item.titleAr || item.url}
                  </p>
                  <p className="truncate text-xs text-stone-400" dir="rtl" lang="ar">
                    {item.captionAr || item.titleAr || "—"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.eventTag ? (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-stone-500">
                        {item.eventTag}
                      </span>
                    ) : null}
                    {item.dateLabel ? (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
                        {item.dateLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-stone-300 py-2 text-xs font-semibold hover:bg-stone-50"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMedia(item.id)}
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ edit card ---------------------------------- */

function EditCard({
  item,
  onSave,
  onCancel,
}: {
  item: MediaRow;
  onSave: (data: Partial<MediaRow>) => Promise<void>;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState(item.kind);
  const [mediaType, setMediaType] = useState(item.mediaType);
  const [eventTag, setEventTag] = useState(item.eventTag ?? "other");
  const [captionEn, setCaptionEn] = useState(item.captionEn ?? "");
  const [captionAr, setCaptionAr] = useState(item.captionAr ?? "");
  const [titleEn, setTitleEn] = useState(item.titleEn ?? "");
  const [titleAr, setTitleAr] = useState(item.titleAr ?? "");
  const [bodyEn, setBodyEn] = useState(item.bodyEn ?? "");
  const [bodyAr, setBodyAr] = useState(item.bodyAr ?? "");
  const [dateLabel, setDateLabel] = useState(item.dateLabel ?? "");

  return (
    <article className="rounded-2xl border-2 border-stone-900 bg-white p-4 sm:col-span-2 lg:col-span-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-xs font-semibold text-stone-500">
          Section
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as "gallery" | "story")}
            className="mt-1 w-full cursor-pointer rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
          >
            <option value="gallery">Memories gallery</option>
            <option value="story">Our Story timeline</option>
          </select>
        </label>

        <label className="block text-xs font-semibold text-stone-500">
          Type
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as "image" | "video")}
            className="mt-1 w-full cursor-pointer rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>

        {kind === "gallery" ? (
          <>
            <label className="block text-xs font-semibold text-stone-500">
              Caption (EN)
              <input
                value={captionEn}
                onChange={(e) => setCaptionEn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-500">
              التسمية (AR)
              <input
                dir="rtl"
                lang="ar"
                value={captionAr}
                onChange={(e) => setCaptionAr(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-500">
              Event tag
              <select
                value={eventTag}
                onChange={(e) => setEventTag(e.target.value)}
                className="mt-1 w-full cursor-pointer rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              >
                {["engagement", "henna", "wedding", "other"].map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            <label className="block text-xs font-semibold text-stone-500">
              Title (EN)
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-500">
              العنوان (AR)
              <input
                dir="rtl"
                lang="ar"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-500 md:col-span-2">
              Text (EN)
              <textarea
                rows={2}
                value={bodyEn}
                onChange={(e) => setBodyEn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-500 md:col-span-2">
              النص (AR)
              <textarea
                dir="rtl"
                rows={2}
                lang="ar"
                value={bodyAr}
                onChange={(e) => setBodyAr(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-500">
              Date label
              <input
                value={dateLabel}
                onChange={(e) => setDateLabel(e.target.value)}
                placeholder="June 2021"
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-stone-500"
              />
            </label>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 cursor-pointer rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() =>
            void onSave({
              kind,
              mediaType,
              eventTag,
              captionEn,
              captionAr,
              titleEn,
              titleAr,
              bodyEn,
              bodyAr,
              dateLabel,
            })
          }
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-700"
        >
          <Check className="size-4" /> Save
        </button>
      </div>
    </article>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-stone-300 p-0.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <option.icon className="size-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
