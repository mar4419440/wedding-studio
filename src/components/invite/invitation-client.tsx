"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUi } from "@/store/ui";
import type { SettingsMap } from "@/lib/settings";
import { CalendarIcon, Clock, Users } from "lucide-react";

interface InvitationClientProps {
  family: {
    id: string;
    nameEn: string;
    nameAr: string;
    guestCount: number;
    rsvpStatus: string;
    checkedIn: boolean;
  };
  settings: SettingsMap;
  qrCodeDataUrl: string;
}

export function InvitationClient({ family, settings, qrCodeDataUrl }: InvitationClientProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const weddingDateStr = settings.wedding_date_en || "October 14, 2026";
  const weddingDate = new Date(weddingDateStr);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDateStr]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 3.5 && !showContent) {
      setShowContent(true);
    }
  };

  const familyName = isAr ? family.nameAr : family.nameEn;
  const coupleName = isAr ? settings.couple_name_ar : settings.couple_name_en;
  const venue = isAr ? settings.venue_ar : settings.venue_en;
  const dateDisplay = isAr ? settings.wedding_date_ar : settings.wedding_date_en;

  // Calendar logic
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(weddingDate.getFullYear(), weddingDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth + firstDay }, (_, i) => 
    i < firstDay ? null : i - firstDay + 1
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/intro-video.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Overlay Content */}
      <div 
        className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-1000 ease-in-out ${
          showContent ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center gap-6 overflow-y-auto max-h-[90vh] custom-scrollbar">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-white tracking-wide">{coupleName}</h1>
            <p className="text-white/80">{isAr ? "يدعوانكم لحضور حفل زفافهما" : "Invite you to celebrate their wedding"}</p>
          </div>

          <div className="w-full h-px bg-white/20" />

          {/* Guest Info */}
          <div className="text-center space-y-1">
            <p className="text-sm uppercase tracking-widest text-white/60">{isAr ? "مرحباً" : "Welcome"}</p>
            <h2 className="text-2xl font-medium">{familyName}</h2>
            <div className="flex items-center justify-center gap-2 text-white/80 mt-2">
              <Users className="w-4 h-4" />
              <span>{isAr ? `عدد الضيوف: ${family.guestCount}` : `${family.guestCount} Guests`}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl shadow-inner my-2">
            <Image 
              src={qrCodeDataUrl} 
              alt="Check-in QR Code" 
              width={200} 
              height={200}
              className="rounded-lg"
            />
          </div>
          <p className="text-xs text-white/60 text-center max-w-[250px]">
            {isAr ? "يرجى إبراز هذا الرمز عند بوابة الدخول" : "Please present this QR code at the entrance for check-in."}
          </p>

          <div className="w-full h-px bg-white/20" />

          {/* Countdown */}
          <div className="w-full text-center">
            <h3 className="text-sm uppercase tracking-widest text-white/60 mb-3">
              {isAr ? "العد التنازلي" : "Countdown"}
            </h3>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-semibold w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg">{timeLeft.days}</span>
                <span className="text-xs mt-1 text-white/60">{isAr ? "يوم" : "Days"}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-semibold w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg">{timeLeft.hours}</span>
                <span className="text-xs mt-1 text-white/60">{isAr ? "ساعة" : "Hours"}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-semibold w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg">{timeLeft.minutes}</span>
                <span className="text-xs mt-1 text-white/60">{isAr ? "دقيقة" : "Mins"}</span>
              </div>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-white/80" />
                <span className="font-medium text-lg">{monthNames[weddingDate.getMonth()]} {weddingDate.getFullYear()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs text-white/60">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {calendarDays.map((day, idx) => {
                const isWeddingDay = day === weddingDate.getDate();
                return (
                  <div 
                    key={idx} 
                    className={`aspect-square flex items-center justify-center rounded-full ${
                      isWeddingDay 
                        ? "bg-white text-black font-bold ring-4 ring-white/30" 
                        : day ? "hover:bg-white/10 text-white/90" : ""
                    }`}
                  >
                    {day || ""}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 text-center text-sm text-white/80 space-y-1">
              <p className="font-medium">{dateDisplay}</p>
              <p className="text-xs opacity-75 flex justify-center items-center gap-1">
                <Clock className="w-3 h-3" /> 
                {isAr ? settings.wedding_time_ar : settings.wedding_time_en}
              </p>
              <p className="text-xs opacity-75">{venue}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
