"use client";

import { useEffect } from "react";
import { useUi } from "@/store/ui";
import type { SettingsMap } from "@/lib/settings";
import { isThemeId } from "@/lib/themes";
import { SiteHeader, SiteFooter } from "@/components/site/site-chrome";
import { HeroSection } from "@/components/site/hero-section";
import { StoryTimeline, type StoryEntry } from "@/components/site/story-timeline";
import { GallerySection, type GalleryImage } from "@/components/site/gallery-section";
import { EventsSection } from "@/components/site/events-section";
import { ThemeSwitcherFab } from "@/components/site/theme-switcher-fab";

export interface PreviewData {
  settings: SettingsMap;
  story: StoryEntry[];
  gallery: GalleryImage[];
  initialTheme: string | null;
}

/**
 * The live public site. All theme switching happens client-side by swapping
 * CSS variables on <html>, so switching styles never reloads the page,
 * never loses scroll position and never resets the language toggle.
 */
export function PreviewClient({ settings, story, gallery, initialTheme }: PreviewData) {
  const language = useUi((s) => s.language);
  const setPreviewTheme = useUi((s) => s.setPreviewTheme);
  const setPreviewAllowed = useUi((s) => s.setPreviewAllowed);

  // Deep link ?theme=… selects that style immediately.
  useEffect(() => {
    if (initialTheme && isThemeId(initialTheme)) {
      setPreviewTheme(initialTheme);
    }
  }, [initialTheme, setPreviewTheme]);

  // Allow visitor theme previews only while this page is mounted.
  useEffect(() => {
    setPreviewAllowed(true);
    return () => setPreviewAllowed(false);
  }, [setPreviewAllowed]);

  const secondaryNames =
    language === "en" ? settings.couple_name_ar : settings.couple_name_en;

  return (
    <>
      <SiteHeader monogram={settings.couple_monogram} />
      <main className="flex flex-1 flex-col">
        <HeroSection settings={settings} />
        <StoryTimeline entries={story} />
        <GallerySection images={gallery} />
        <EventsSection settings={settings} />
      </main>
      <SiteFooter names={secondaryNames} />
      <ThemeSwitcherFab baseTheme={settings.active_theme} />
    </>
  );
}
