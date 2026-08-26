"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, X } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { useUi } from "@/store/ui";

/**
 * Floating "Switch Style" control for the public demo preview.
 * Switching only swaps CSS variables on <html> — instant, no reload,
 * no scroll loss. Language selection is untouched.
 */
export function ThemeSwitcherFab({ baseTheme }: { baseTheme: string }) {
  const language = useUi((s) => s.language);
  const previewTheme = useUi((s) => s.previewTheme);
  const setPreviewTheme = useUi((s) => s.setPreviewTheme);
  const routeTheme = useUi((s) => s.routeTheme);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTheme = routeTheme ?? previewTheme ?? baseTheme;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const title = language === "en" ? "Switch Style" : "تغيير التصميم";

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 end-5 z-[90] flex flex-col items-end gap-3"
    >
      {open ? (
        <div className="w-72 overflow-hidden rounded-xl border border-stone-200 bg-white p-2 shadow-2xl">
          <div className="flex items-center justify-between px-3 pb-2 pt-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {title}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close theme menu"
              className="cursor-pointer rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="size-4" />
            </button>
          </div>
          <ul>
            {THEMES.map((theme) => {
              const active = theme.id === activeTheme;
              return (
                <li key={theme.id}>
                  <button
                    type="button"
                    onClick={() => setPreviewTheme(theme.id)}
                    aria-pressed={active}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start transition-colors ${
                      active ? "bg-stone-100" : "hover:bg-stone-50"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex size-7 shrink-0 overflow-hidden rounded-full border border-stone-300">
                        <span className="h-full w-1/3" style={{ background: theme.swatch.surface }} />
                        <span className="h-full w-1/3" style={{ background: theme.swatch.primary }} />
                        <span className="h-full w-1/3" style={{ background: theme.swatch.secondary }} />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block truncate text-sm ${
                            active ? "font-semibold text-stone-900" : "text-stone-700"
                          }`}
                        >
                          {language === "en" ? theme.nameEn : theme.nameAr}
                        </span>
                        <span className="block truncate text-xs text-stone-400">
                          {language === "en" ? theme.taglineEn : theme.taglineAr}
                        </span>
                      </span>
                    </span>
                    {active ? (
                      <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={title}
        title={title}
        className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-neutral-50 shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        <Palette className="size-5" />
      </button>
    </div>
  );
}
