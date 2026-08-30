"use client";

import { useEffect, useRef } from "react";
import { useUi } from "@/store/ui";

export function EnvelopeIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setIntroFinished = useUi((s) => s.setIntroFinished);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 3.5) {
      setIntroFinished(true);
      sessionStorage.setItem("hasSeenEnvelopeIntro", "true");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src="/envelope-open.mp4"
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}
