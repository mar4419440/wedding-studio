"use client";

import { useState } from "react";
import { useUi } from "@/store/ui";
import { Users, CheckCircle } from "lucide-react";
import type { SettingsMap } from "@/lib/settings";
import { GuestQrCard } from "./GuestQrCard";
import { WeddingCalendar } from "./WeddingCalendar";

interface CurtainHeroProps {
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

export function CurtainHero({ family, settings, qrCodeDataUrl }: CurtainHeroProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";
  
  const introFinished = useUi((s) => s.introFinished);
  
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

  return (
    <div className={`relative w-full min-h-screen bg-black overflow-hidden transition-opacity duration-700 ease-in-out ${introFinished ? "opacity-100" : "opacity-0"}`} dir={isAr ? "rtl" : "ltr"}>
      {/* Background Looping Curtain Video */}
      <video
        src="/curtain-loop.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        playsInline
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (video.duration && video.currentTime >= video.duration - 0.5) {
            video.currentTime = 0;
            video.play();
          }
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 py-12">
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center gap-6">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-2">
            <h1 className={`text-4xl md:text-5xl font-serif text-white tracking-wide drop-shadow-md ${isAr ? 'font-arabic' : ''}`}>
              {coupleName}
            </h1>
            <p className="text-white/90 text-sm tracking-wider uppercase font-medium">
              {isAr ? "يدعوانكم لحضور حفل زفافهما" : "Invite you to celebrate their wedding"}
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Guest Info */}
          <div className="text-center space-y-2 w-full">
            <p className="text-xs uppercase tracking-widest text-white/70 font-medium">
              {isAr ? "مرحباً" : "Welcome"}
            </p>
            <h2 className="text-2xl font-serif font-medium text-white drop-shadow">{familyName}</h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-white">
                <Users className="w-4 h-4" />
                <span>{isAr ? `دعوة لـ ${family.guestCount} أشخاص` : `Reserved for ${family.guestCount} guests`}</span>
              </div>
              
              <div className={`px-3 py-1.5 rounded-full border ${statusColor}`}>
                {rsvpStatus}
              </div>
            </div>

            {rsvpStatus !== "CONFIRMED" && (
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#C9A66B] hover:bg-[#b59560] text-white font-medium py-2.5 px-4 rounded-xl shadow-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                {isSubmitting ? (isAr ? "جاري التأكيد..." : "Confirming...") : (isAr ? "سأحضر بالتأكيد" : "I will come")}
              </button>
            )}
          </div>

          <div className="w-full mt-2">
            <GuestQrCard qrCodeDataUrl={qrCodeDataUrl} />
          </div>

          <div className="w-full mt-2">
            <WeddingCalendar 
              weddingDateStr={settings.wedding_date_en} 
              timeEn={settings.wedding_time_en}
              timeAr={settings.wedding_time_ar}
              venueEn={settings.venue_en}
              venueAr={settings.venue_ar}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
