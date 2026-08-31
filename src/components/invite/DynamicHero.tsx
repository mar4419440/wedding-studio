"use client";

import { useState } from "react";
import { useUi } from "@/store/ui";
import { Users, CheckCircle } from "lucide-react";
import type { SettingsMap } from "@/lib/settings";
import { GuestQrCard } from "./GuestQrCard";
import { WeddingCalendar } from "./WeddingCalendar";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { DEFAULT_THEME, getTheme } from "@/lib/themes";

interface DynamicHeroProps {
  family: {
    id: string;
    nameEn: string;
    nameAr: string;
    guestCount: number;
    rsvpStatus: string;
  };
  settings: SettingsMap;
  qrCodeDataUrl: string;
  hasEnvelope?: boolean;
  onReady?: () => void;
}

export function DynamicHero({ family, settings, qrCodeDataUrl, hasEnvelope = true, onReady }: DynamicHeroProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";
  
  const introFinished = useUi((s) => s.introFinished);
  const previewTheme = useUi((s) => s.previewTheme);
  const routeTheme = useUi((s) => s.routeTheme);
  const activeTheme = previewTheme || routeTheme || settings.active_theme || DEFAULT_THEME;
  const theme = getTheme(activeTheme) || getTheme(DEFAULT_THEME)!;

  const [rsvpStatus, setRsvpStatus] = useState(family.rsvpStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const familyName = isAr ? family.nameAr : family.nameEn;
  const coupleName = isAr ? settings.couple_name_ar : settings.couple_name_en;
  
  const statusColors = {
    PENDING: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    CONFIRMED: "bg-green-500/20 text-green-200 border-green-500/30",
    DECLINED: "bg-red-500/20 text-red-200 border-red-500/30",
  };

  const statusColor = statusColors[rsvpStatus as keyof typeof statusColors] || statusColors.PENDING;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyId: family.id, status: "CONFIRMED" }),
      });
      if (res.ok) {
        setRsvpStatus("CONFIRMED");
      }
    } catch (error) {
      console.error("Failed to confirm RSVP", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there is no envelope, we are already "finished" and should be visible immediately without a fade delay
  const isVisible = !hasEnvelope || introFinished;

  return (
    <div className={`relative w-full min-h-screen bg-black overflow-hidden transition-opacity duration-700 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`} dir={isAr ? "rtl" : "ltr"}>
      {/* Dynamic Background (Image or Video per theme) */}
      <HeroBackground activeThemeId={activeTheme} onReady={onReady} />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start p-4 py-12 md:py-20">
        
        {/* Main Stack Container */}
        <div className="w-full max-w-md flex flex-col items-center gap-6 md:gap-8 mt-4 md:mt-12">
          
          {/* Main Invitation Card */}
          <div className="w-full bg-black/20 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col items-center text-center">
            
            {/* Header */}
            <div className="space-y-3 mb-6">
              <h1 
                className={`text-5xl md:text-6xl font-serif tracking-wide drop-shadow-lg ${isAr ? 'font-arabic' : ''}`}
                style={{ color: theme.swatch.primary }}
              >
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
                <h2 
                  className="text-2xl md:text-3xl font-serif font-medium drop-shadow-md"
                  style={{ color: theme.swatch.primary }}
                >
                  {familyName}
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white shadow-inner">
                  <Users className="w-4 h-4" />
                  <span>{isAr ? `دعوة لـ ${family.guestCount} أشخاص` : `Reserved for ${family.guestCount} guests`}</span>
                </div>
                
                <div className={`px-4 py-2 rounded-full border shadow-inner ${statusColor}`}>
                  {rsvpStatus}
                </div>
              </div>

              {rsvpStatus !== "CONFIRMED" && (
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#AA8034] hover:from-[#e3be47] hover:to-[#b88c3a] text-white font-medium py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isSubmitting ? (isAr ? "جاري التأكيد..." : "Confirming...") : (isAr ? "سأحضر بالتأكيد" : "I will come")}
                </button>
              )}
            </div>
          </div>

          {/* Calendar & Venue Card */}
          <div className="w-full opacity-90 hover:opacity-100 transition-opacity">
            <WeddingCalendar 
              weddingDateStr={settings.wedding_date_en} 
              timeEn={settings.wedding_time_en}
              timeAr={settings.wedding_time_ar}
              venueEn={settings.venue_en}
              venueAr={settings.venue_ar}
            />
          </div>

          {/* Entrance Pass Card */}
          <div className="w-full bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px bg-white/20 w-12" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">
                {isAr ? "بطاقة الدخول" : "Entrance Pass"}
              </span>
              <div className="h-px bg-white/20 w-12" />
            </div>
            <GuestQrCard qrCodeDataUrl={qrCodeDataUrl} />
          </div>

        </div>
      </div>
    </div>
  );
}
