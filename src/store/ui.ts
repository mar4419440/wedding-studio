"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/i18n";

interface UiState {
  language: Lang;
  /** Visitor-side theme override for live previews (persisted). */
  previewTheme: string | null;
  /** Theme pinned by the current route (e.g. /demo?theme=…); not persisted. */
  routeTheme: string | null;
  /** Whether visitor theme previews are allowed on the current page (public demo only). */
  previewAllowed: boolean;
  setLanguage: (lang: Lang) => void;
  toggleLanguage: () => void;
  setPreviewTheme: (theme: string | null) => void;
  setRouteTheme: (theme: string | null) => void;
  setPreviewAllowed: (allowed: boolean) => void;
  /** Whether the envelope intro has finished playing. */
  introFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
}

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      language: "en",
      previewTheme: null,
      routeTheme: null,
      previewAllowed: false,
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set((s) => ({ language: s.language === "en" ? "ar" : "en" })),
      setPreviewTheme: (theme) => set({ previewTheme: theme }),
      setRouteTheme: (theme) => set({ routeTheme: theme }),
      setPreviewAllowed: (allowed) => set({ previewAllowed: allowed }),
      introFinished: false,
      setIntroFinished: (finished) => set({ introFinished: finished }),
    }),
    {
      name: "wedding-ui",
      partialize: (s) => ({ language: s.language, previewTheme: s.previewTheme }),
    }
  )
);
