"use client";

import { useEffect, useState } from "react";
import { useUi } from "@/store/ui";
import type { SettingsMap } from "@/lib/settings";
import { EnvelopeIntro } from "./EnvelopeIntro";
import { CurtainHero } from "./CurtainHero";

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
}

export function HeroSection({ family, settings, qrCodeDataUrl }: HeroSectionProps) {
  const introFinished = useUi((s) => s.introFinished);
  const setIntroFinished = useUi((s) => s.setIntroFinished);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the intro this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenEnvelopeIntro");
    if (hasSeenIntro === "true") {
      setIntroFinished(true);
    }
    setMounted(true);
  }, [setIntroFinished]);

  // Don't render until mounted to avoid hydration mismatch with sessionStorage
  if (!mounted) return null;

  return (
    <>
      {!introFinished && <EnvelopeIntro />}
      
      {/* 
        We always render CurtainHero but it controls its own opacity based on introFinished.
        This ensures the video can start preloading/playing in the background 
        while the envelope intro is finishing.
      */}
      <CurtainHero 
        family={family} 
        settings={settings} 
        qrCodeDataUrl={qrCodeDataUrl} 
      />
    </>
  );
}
