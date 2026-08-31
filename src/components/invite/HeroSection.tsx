"use client";

import { useEffect, useState } from "react";
import { useUi } from "@/store/ui";
import type { SettingsMap } from "@/lib/settings";
import { getTheme, DEFAULT_THEME } from "@/lib/themes";
import { EnvelopeIntro } from "./EnvelopeIntro";
import { DynamicHero } from "./DynamicHero";
import { ThemeLoader } from "../ui/ThemeLoader";
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
  const [isReady, setIsReady] = useState(false);

  const activeThemeId = routeTheme ?? previewTheme ?? settings.active_theme ?? DEFAULT_THEME;
  const theme = getTheme(activeThemeId);
  const hasEnvelope = !!theme?.envelopeSrc;
  
  const coupleName = useUi((s) => s.language) === "ar" ? settings.couple_name_ar : settings.couple_name_en;

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenEnvelopeIntro");
    if (hasSeenIntro === "true" || !hasEnvelope) {
      // Skip envelope for image-only themes or if already seen
      setIntroFinished(true);
    }
    setMounted(true);
    
    // Simulate loading for heavy assets, but fallback after 2s if onReady isn't fired
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setIntroFinished, hasEnvelope]);

  // Only block render for hydration if we actually have an envelope
  if (!mounted && hasEnvelope) return null;

  return (
    <>
      <ThemeLoader activeThemeId={activeThemeId} coupleName={coupleName} isReady={isReady} />
      
      {!introFinished && hasEnvelope && (
        <EnvelopeIntro 
          activeThemeId={activeThemeId} 
          onReady={() => setIsReady(true)} 
        />
      )}
      
      <DynamicHero 
        family={family} 
        settings={settings} 
        qrCodeDataUrl={qrCodeDataUrl} 
        hasEnvelope={hasEnvelope}
        onReady={!hasEnvelope ? () => setIsReady(true) : undefined}
      />
    </>
  );
}

