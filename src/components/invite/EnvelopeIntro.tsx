"use client";

import { useEffect, useRef, useState } from "react";
import { useUi } from "@/store/ui";
import { getTheme, DEFAULT_THEME } from "@/lib/themes";

interface EnvelopeIntroProps {
  activeThemeId: string;
  onReady?: () => void;
}

export function EnvelopeIntro({ activeThemeId, onReady }: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<"envelope" | "finished">("envelope");
  const setIntroFinished = useUi((s) => s.setIntroFinished);
  const videoRef = useRef<HTMLVideoElement>(null);

  const theme = getTheme(activeThemeId) || getTheme(DEFAULT_THEME)!;
  const envelopeSrc = theme.envelopeSrc;
  const revealTime = theme.envelopeRevealTimestamp || 6.5;

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= revealTime) {
      if (phase === "envelope") {
        setPhase("finished");
        sessionStorage.setItem("hasSeenEnvelopeIntro", "true");
        setIntroFinished(true);
      }
    }
  };

  if (!envelopeSrc) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-700 ease-in-out ${phase === "envelope" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <video
        ref={videoRef}
        src={envelopeSrc}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onCanPlayThrough={onReady}
      />
    </div>
  );
}
