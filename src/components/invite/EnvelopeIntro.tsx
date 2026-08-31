"use client";

import { useEffect, useRef } from "react";
import { useUi } from "@/store/ui";
import { getTheme, DEFAULT_THEME } from "@/lib/themes";

export function EnvelopeIntro({ activeThemeId }: { activeThemeId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setIntroFinished = useUi((s) => s.setIntroFinished);
  
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
        className="w-full h-full object-fill"
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}
