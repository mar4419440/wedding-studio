"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { THEMES, ThemeMeta } from "@/lib/themes";

interface HeroBackgroundProps {
  activeThemeId: string;
  onReady?: () => void;
}

export function HeroBackground({ activeThemeId, onReady }: HeroBackgroundProps) {
  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden bg-black z-0 pointer-events-none">
      {THEMES.map((theme) => {
        const isActive = theme.id === activeThemeId;
        return (
          <ThemeMediaLayer 
            key={theme.id} 
            theme={theme} 
            isActive={isActive} 
            onReady={isActive ? onReady : undefined}
          />
        );
      })}
    </div>
  );
}

function ThemeMediaLayer({ theme, isActive, onReady }: { theme: ThemeMeta; isActive: boolean; onReady?: () => void }) {
  const overlay = theme.heroMedia.overlay;
  const src = theme.curtainSrc || theme.heroMedia.src;
  const poster = theme.curtainPoster || theme.heroMedia.poster;
  const type = theme.curtainSrc ? "video" : theme.heroMedia.type;
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (type === "video" && videoRef.current) {
      if (isActive) {
        // Attempt to play if active
        videoRef.current.play().catch(console.error);
      } else {
        // Pause if inactive to save resources
        videoRef.current.pause();
      }
    }
  }, [isActive, type]);

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      {type === "image" ? (
        <Image
          src={src}
          alt={`${theme.nameEn} background`}
          fill
          priority={isActive}
          className="object-cover object-center"
          sizes="100vw"
          onLoad={isActive ? onReady : undefined}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="absolute inset-0 w-full h-full object-fill"
          autoPlay={isActive}
          muted
          loop
          playsInline
          preload={isActive ? "auto" : "none"}
          onCanPlayThrough={isActive ? onReady : undefined}
        />
      )}
      
      {/* Overlay to ensure text legibility */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ backgroundColor: overlay }} 
        aria-hidden
      />
    </div>
  );
}
