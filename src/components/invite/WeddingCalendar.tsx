"use client";

import { useUi } from "@/store/ui";
import { CalendarIcon, Clock } from "lucide-react";

interface WeddingCalendarProps {
  weddingDateStr: string;
  timeEn: string;
  timeAr: string;
  venueEn: string;
  venueAr: string;
}

export function WeddingCalendar({ weddingDateStr, timeEn, timeAr, venueEn, venueAr }: WeddingCalendarProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";

  const weddingDate = new Date(weddingDateStr || "October 14, 2026");
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(weddingDate.getFullYear(), weddingDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), 1).getDay();
  
  const calendarDays = Array.from({ length: daysInMonth + firstDay }, (_, i) => 
    i < firstDay ? null : i - firstDay + 1
  );

  return (
    <div className="w-full bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-white/80" />
          <span className="font-medium text-lg tracking-wide">{monthNames[weddingDate.getMonth()]} {weddingDate.getFullYear()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs text-white/70 font-medium">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
        {calendarDays.map((day, idx) => {
          const isWeddingDay = day === weddingDate.getDate();
          return (
            <div 
              key={idx} 
              className={`aspect-square flex items-center justify-center rounded-full transition-all ${
                isWeddingDay 
                  ? "bg-white text-black font-bold ring-4 ring-white/30 shadow-md transform scale-110" 
                  : day ? "text-white hover:bg-white/10" : ""
              }`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
      
      <div className="mt-5 text-center text-sm text-white space-y-1.5 drop-shadow-md">
        <p className="flex justify-center items-center gap-1 font-medium">
          <Clock className="w-4 h-4 opacity-80" /> 
          {isAr ? timeAr : timeEn}
        </p>
        <p className="opacity-90">{isAr ? venueAr : venueEn}</p>
      </div>
    </div>
  );
}
