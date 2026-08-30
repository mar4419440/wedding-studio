"use client";

import { useUi } from "@/store/ui";
import { MediaGrid } from "./MediaGrid";
import type { GalleryMedia } from "./types";

interface MomentGroupProps {
  eventTag: string;
  dateLabel: string | null;
  items: GalleryMedia[];
  onMediaClick: (item: GalleryMedia) => void;
}

export function MomentGroup({ eventTag, dateLabel, items, onMediaClick }: MomentGroupProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";
  
  // Format the event tag (capitalize first letter if English)
  const formattedTag = isAr 
    ? eventTag // Ideally this would be translated, but we use what we have in DB
    : eventTag.charAt(0).toUpperCase() + eventTag.slice(1);
    
  const label = dateLabel ? `${formattedTag} · ${dateLabel}` : formattedTag;

  return (
    <div className="mb-16">
      {/* Group Label */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#C9A66B]/30 bg-white/60 shadow-sm backdrop-blur-sm">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#2d2d2d]">
            {label}
          </span>
        </div>
      </div>
      
      {/* Media Grid */}
      <MediaGrid 
        items={items} 
        onMediaClick={(idx) => onMediaClick(items[idx])} 
      />
    </div>
  );
}
