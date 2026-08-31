"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUi } from "@/store/ui";
import { THEMES, getTheme, DEFAULT_THEME, type ThemeMeta } from "@/lib/themes";
import type { SettingsMap } from "@/lib/settings";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Users, CalendarIcon, Clock, RotateCcw, ChevronDown } from "lucide-react";

interface InviteTestClientProps {
  settings: SettingsMap;
}

/**
 * A self-contained test page that previews the full invitation flow
 * (envelope reveal → QR overlay → curtain loop hero) for any theme,
 * using mock guest data so no real DB records are needed.
 * The theme is read from admin settings (active_theme).
 */
export function InviteTestClient({ settings }: InviteTestClientProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";

  const previewTheme = useUi((s) => s.previewTheme);
  const setPreviewTheme = useUi((s) => s.setPreviewTheme);
  const routeTheme = useUi((s) => s.routeTheme);

  // Video themes are themes that have envelopeSrc defined
  const videoThemes = THEMES.filter((t) => t.envelopeSrc);

  // Use admin active_theme as the default, same as the real invitation page
  const activeThemeId = routeTheme ?? previewTheme ?? settings.active_theme ?? DEFAULT_THEME;
  const theme = getTheme(activeThemeId);
  const hasEnvelope = !!theme?.envelopeSrc;

  // --- Envelope intro state ---
  const envelopeRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"envelope" | "hero">(hasEnvelope ? "envelope" : "hero");
  const [selectorOpen, setSelectorOpen] = useState(false);

  const envelopeSrc = theme?.envelopeSrc || "/envelope-open.mp4";
  const revealTime = theme?.envelopeRevealTimestamp ?? 3.5;

  const handleEnvelopeTimeUpdate = () => {
    if (envelopeRef.current && envelopeRef.current.currentTime >= revealTime) {
      setPhase("hero");
    }
  };

  const handleReplay = () => {
    setPhase("envelope");
    // Small delay to let state settle before replaying
    setTimeout(() => {
      if (envelopeRef.current) {
        envelopeRef.current.currentTime = 0;
        envelopeRef.current.play().catch(console.error);
      }
    }, 100);
  };

  // When the theme changes, restart the sequence
  useEffect(() => {
    if (hasEnvelope) {
      setPhase("envelope");
      setTimeout(() => {
        if (envelopeRef.current) {
          envelopeRef.current.currentTime = 0;
          envelopeRef.current.play().catch(console.error);
        }
      }, 150);
    } else {
      setPhase("hero");
    }
  }, [activeThemeId, hasEnvelope]);

  // Mock data
  const mockFamily = {
    nameEn: "The Al-Rashid Family",
    nameAr: "عائلة الراشد",
    guestCount: 4,
  };
  const mockCouple = {
    en: "Amira & Khalid",
    ar: "أميرة & خالد",
  };
  const mockVenue = {
    en: "The Grand Palace, Amman",
    ar: "القصر الكبير، عمّان",
  };
  const mockDate = {
    en: "October 14, 2026",
    ar: "١٤ أكتوبر ٢٠٢٦",
  };
  const mockTime = {
    en: "7:00 PM",
    ar: "٧:٠٠ مساءً",
  };

  const familyName = isAr ? mockFamily.nameAr : mockFamily.nameEn;
  const coupleName = isAr ? mockCouple.ar : mockCouple.en;

  return (
    <div className="relative w-full min-h-screen bg-black text-white" dir={isAr ? "rtl" : "ltr"}>

      {/* ── Theme Selector (floating top-right) ── */}
      <div className="fixed top-4 right-4 z-[60]">
        <button
          onClick={() => setSelectorOpen(!selectorOpen)}
          className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-black/80 transition-colors shadow-lg"
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme?.swatch.primary }} />
          {theme?.nameEn || "Select Theme"}
          <ChevronDown className={`w-4 h-4 transition-transform ${selectorOpen ? "rotate-180" : ""}`} />
        </button>

        {selectorOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-2">
            <p className="text-xs text-white/50 px-3 py-2 uppercase tracking-wider font-medium">
              {isAr ? "ثيمات الصور" : "Image Themes"}
            </p>
            {THEMES.filter((t) => !t.envelopeSrc).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setPreviewTheme(t.id);
                  setSelectorOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  t.id === activeThemeId
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10 text-white/70"
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: t.swatch.primary }} />
                <div>
                  <span className="text-sm font-medium block">{isAr ? t.nameAr : t.nameEn}</span>
                  <span className="text-xs text-white/50">{isAr ? t.taglineAr : t.taglineEn}</span>
                </div>
              </button>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <p className="text-xs text-white/50 px-3 py-2 uppercase tracking-wider font-medium">
              {isAr ? "ثيمات الفيديو" : "Video Themes"}
            </p>
            {videoThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setPreviewTheme(t.id);
                  setSelectorOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  t.id === activeThemeId
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10 text-white/70"
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: t.swatch.primary }} />
                <div>
                  <span className="text-sm font-medium block">{isAr ? t.nameAr : t.nameEn}</span>
                  <span className="text-xs text-white/50">{isAr ? t.taglineAr : t.taglineEn}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Replay Button (floating top-left, only for video themes) ── */}
      {hasEnvelope && (
        <button
          onClick={handleReplay}
          className="fixed top-4 left-4 z-[60] flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-black/80 transition-colors shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          {isAr ? "إعادة التشغيل" : "Replay"}
        </button>
      )}

      {/* ── Phase 1: Envelope Intro (only for video themes) ── */}
      {hasEnvelope && (
      <div
        className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-700 ${
          phase === "envelope" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <video
          ref={envelopeRef}
          src={envelopeSrc}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleEnvelopeTimeUpdate}
        />
      </div>
      )}

      {/* ── Phase 2: Hero with Curtain Loop ── */}
      <div
        className={`relative w-full min-h-screen transition-opacity duration-700 ease-in-out ${
          phase === "hero" ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Curtain video background */}
        <HeroBackground activeThemeId={activeThemeId} />

        {/* Invitation Content Overlay */}
        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start p-4 py-12 md:py-20">
          
          {/* Main Stack Container */}
          <div className="w-full max-w-md flex flex-col items-center gap-6 md:gap-8 mt-4 md:mt-12">
            
            {/* Main Invitation Card */}
            <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col items-center text-center">
              
              {/* Header */}
              <div className="space-y-3 mb-6">
                <h1 className={`text-5xl md:text-6xl font-serif text-white tracking-wide drop-shadow-lg ${isAr ? "font-arabic" : ""}`}>
                  {coupleName}
                </h1>
                <p className="text-white/80 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                  {isAr ? "يدعوانكم لحضور حفل زفافهما" : "Invite you to celebrate their wedding"}
                </p>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6" />

              {/* Guest Info */}
              <div className="space-y-4 w-full">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/60 font-medium mb-1">
                    {isAr ? "مرحباً" : "Welcome"}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif font-medium text-white drop-shadow-md">{familyName}</h2>
                </div>
                
                <div className="flex items-center justify-center gap-3 text-sm font-medium">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white shadow-inner">
                    <Users className="w-4 h-4" />
                    <span>{isAr ? `دعوة لـ ${mockFamily.guestCount} أشخاص` : `Reserved for ${mockFamily.guestCount} guests`}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-5 h-5 text-white/80" />
                <span className="font-medium text-lg text-white">{isAr ? mockDate.ar : mockDate.en}</span>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 opacity-80" />
                  {isAr ? mockTime.ar : mockTime.en}
                </p>
                <p className="opacity-90">{isAr ? mockVenue.ar : mockVenue.en}</p>
              </div>
            </div>

            {/* Entrance Pass Card */}
            <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 mb-4 w-full">
                <div className="h-px bg-white/20 w-12" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">
                  {isAr ? "بطاقة الدخول" : "Entrance Pass"}
                </span>
                <div className="h-px bg-white/20 w-12" />
              </div>

              {/* Mock QR Code */}
              <div className="bg-white p-4 rounded-xl shadow-inner mb-3">
                <div className="w-[160px] h-[160px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="5" y="5" width="25" height="25" fill="black" />
                    <rect x="70" y="5" width="25" height="25" fill="black" />
                    <rect x="5" y="70" width="25" height="25" fill="black" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="black" />
                    <rect x="78" y="13" width="9" height="9" fill="black" />
                    <rect x="13" y="78" width="9" height="9" fill="black" />
                    <rect x="35" y="5" width="5" height="5" fill="black" />
                    <rect x="45" y="5" width="5" height="5" fill="black" />
                    <rect x="55" y="5" width="5" height="5" fill="black" />
                    <rect x="35" y="15" width="5" height="5" fill="black" />
                    <rect x="50" y="15" width="5" height="5" fill="black" />
                    <rect x="35" y="35" width="5" height="5" fill="black" />
                    <rect x="45" y="45" width="10" height="10" fill="black" />
                    <rect x="60" y="35" width="5" height="5" fill="black" />
                    <rect x="70" y="45" width="5" height="5" fill="black" />
                    <rect x="35" y="60" width="5" height="5" fill="black" />
                    <rect x="45" y="70" width="5" height="5" fill="black" />
                    <rect x="60" y="60" width="5" height="5" fill="black" />
                    <rect x="70" y="70" width="25" height="25" fill="black" />
                    <rect x="75" y="75" width="15" height="15" fill="white" />
                    <rect x="78" y="78" width="9" height="9" fill="black" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-white/80 text-center max-w-[250px] font-medium drop-shadow">
                {isAr ? "يرجى إبراز هذا الرمز عند بوابة الدخول" : "Present this QR code at the entrance for check-in"}
              </p>
            </div>

            {/* Test Label */}
            <div className="w-full text-center mt-4">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                {isAr ? "معاينة تجريبية" : "Test Preview"}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
