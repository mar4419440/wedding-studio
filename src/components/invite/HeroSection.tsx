"use client";

import { useEffect, useState } from "react";
import { useUi } from "@/store/ui";
import type { SettingsMap } from "@/lib/settings";
import { getTheme, DEFAULT_THEME } from "@/lib/themes";
import { EnvelopeIntro } from "./EnvelopeIntro";
import { DynamicHero } from "./DynamicHero";
import { PortfolioSection } from "../gallery/PortfolioSection";
import type { GalleryMedia } from "../gallery/types";

interface HeroSectionProps {
  family: {
    id: string;
    nameEn: string;
    nameAr: string;
    guestCount: number;
    rsvpStatus: string;
  };
  settings: SettingsMap;
  qrCodeDataUrl: string;
  media: GalleryMedia[];
}

export function HeroSection({ family, settings, qrCodeDataUrl, media }: HeroSectionProps) {
  const introFinished = useUi((s) => s.introFinished);
  const setIntroFinished = useUi((s) => s.setIntroFinished);
  const previewTheme = useUi((s) => s.previewTheme);
  const routeTheme = useUi((s) => s.routeTheme);
  const [mounted, setMounted] = useState(false);

  const activeThemeId = routeTheme ?? previewTheme ?? settings.active_theme ?? DEFAULT_THEME;
  const theme = getTheme(activeThemeId);
  const hasEnvelope = !!theme?.envelopeSrc;

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenEnvelopeIntro");
    if (hasSeenIntro === "true" || !hasEnvelope) {
      // Skip envelope for image-only themes or if already seen
      setIntroFinished(true);
    }
    setMounted(true);
  }, [setIntroFinished, hasEnvelope]);

  // Don't render until mounted to avoid hydration mismatch with sessionStorage
  if (!mounted) return null;

  return (
    <>
      {!introFinished && hasEnvelope && <EnvelopeIntro />}
      
      {/* 
        We always render DynamicHero but it controls its own opacity based on introFinished.
        This ensures the video can start preloading/playing in the background 
        while the envelope intro is finishing.
      */}
      <DynamicHero 
        family={family} 
        settings={settings} 
        qrCodeDataUrl={qrCodeDataUrl} 
      />
      
      {/* Portfolio Gallery Section appears below the hero */}
      {/* <PortfolioSection media={media} /> */}
    </>
  );
}

