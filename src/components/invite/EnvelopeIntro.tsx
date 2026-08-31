"use client";

import { useEffect, useRef } from "react";
import { useUi } from "@/store/ui";
import { getTheme, DEFAULT_THEME } from "@/lib/themes";

export function EnvelopeIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setIntroFinished = useUi((s) => s.setIntroFinished);
  const previewTheme = useUi((s) => s.previewTheme);
  const routeTheme = useUi((s) => s.routeTheme);
  
  const activeThemeId = routeTheme ?? previewTheme ?? DEFAULT_THEME;
  const theme = getTheme(activeThemeId);
  
  const envelopeSrc = theme?.envelopeSrc || "/envelope-open.mp4";
  const revealTime = theme?.envelopeRevealTimestamp ?? 3.5;

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= revealTime) {
      setIntroFinished(true);
      sessionStorage.setItem("hasSeenEnvelopeIntro", "true");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={envelopeSrc}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}
