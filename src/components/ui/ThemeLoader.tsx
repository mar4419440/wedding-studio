"use client";

import { useEffect, useState } from "react";
import { getTheme, DEFAULT_THEME } from "@/lib/themes";
import { useUi } from "@/store/ui";

interface ThemeLoaderProps {
  activeThemeId: string;
  coupleName: string;
  isReady: boolean;
}

export function ThemeLoader({ activeThemeId, coupleName, isReady }: ThemeLoaderProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";
  
  const theme = getTheme(activeThemeId) || getTheme(DEFAULT_THEME)!;
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Guarantee at least 1.5 seconds of loading screen for an elegant entrance
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimePassed(true);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && minimumTimePassed) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 800); // Wait for 800ms fade out transition
      return () => clearTimeout(timer);
    }
  }, [isReady, minimumTimePassed]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${isFadingOut ? "opacity-0" : "opacity-100"}`}
      style={{ backgroundColor: theme.swatch.surface }}
    >
      <div className="flex flex-col items-center gap-8 text-center px-6">
        {/* Pulsing Couple Name */}
        <h1 
          className={`text-4xl md:text-5xl font-serif tracking-wide animate-pulse ${isAr ? 'font-arabic' : ''}`}
          style={{ 
            color: theme.swatch.primary,
            fontFamily: isAr ? theme.typography.headingFontFamilyAr : theme.typography.headingFontFamily 
          }}
        >
          {coupleName}
        </h1>
        
        {/* Minimalist Spinner matched to accent color */}
        <div className="relative flex items-center justify-center w-12 h-12">
          <div 
            className="absolute inset-0 rounded-full border-t-2 border-r-2 animate-spin"
            style={{ borderColor: theme.swatch.primary, animationDuration: '1.5s' }}
          />
          <div 
            className="absolute inset-2 rounded-full border-b-2 border-l-2 animate-spin-reverse opacity-60"
            style={{ borderColor: theme.swatch.secondary, animationDuration: '2s', animationDirection: 'reverse' }}
          />
        </div>
        
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: theme.swatch.primary, opacity: 0.7 }}>
          {isAr ? "جاري تحضير الدعوة" : "Preparing Invitation"}
        </p>
      </div>
    </div>
  );
}
