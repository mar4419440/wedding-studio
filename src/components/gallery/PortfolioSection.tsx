"use client";

import { useState } from "react";
import { useUi } from "@/store/ui";
import { MomentGroup } from "./MomentGroup";
import { Lightbox } from "./Lightbox";
import type { GalleryMedia } from "./types";

interface PortfolioSectionProps {
  media: GalleryMedia[];
}

export function PortfolioSection({ media }: PortfolioSectionProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";
  
  const [activeMedia, setActiveMedia] = useState<GalleryMedia | null>(null);

  // Group media by eventTag
  const groups = media.reduce((acc, item) => {
    const tag = item.eventTag || "other";
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(item);
    return acc;
  }, {} as Record<string, GalleryMedia[]>);

  // Determine the index for the lightbox across the entire flat array
  const activeIndex = activeMedia ? media.findIndex(m => m.id === activeMedia.id) : -1;

  if (media.length === 0) return null;

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-[#FAF6F0] text-[#2d2d2d]" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl text-[#2d2d2d] mb-4 ${isAr ? 'font-arabic' : 'font-serif'} drop-shadow-sm`}>
            {isAr ? "لحظاتنا" : "Our Moments"}
          </h2>
          <p className="text-[#2d2d2d]/70 text-sm tracking-widest uppercase font-medium mb-6">
            {isAr ? "نشارككم أجمل ذكرياتنا" : "Sharing our beautiful memories"}
          </p>
          
          {/* Gold Ornamental Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C9A66B]" />
            <div className="w-2 h-2 rotate-45 bg-[#C9A66B]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C9A66B]" />
          </div>
        </div>

        {/* Moments Groups */}
        {Object.entries(groups).map(([tag, items]) => (
          <MomentGroup 
            key={tag}
            eventTag={tag}
            dateLabel={items[0]?.dateLabel || null}
            items={items}
            onMediaClick={setActiveMedia}
          />
        ))}
      </div>

      {/* Lightbox Portal */}
      {activeMedia && activeIndex !== -1 && (
        <Lightbox 
          items={media} 
          initialIndex={activeIndex} 
          onClose={() => setActiveMedia(null)} 
        />
      )}
    </section>
  );
}
