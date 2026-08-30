"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import type { GalleryMedia } from "./types";

interface MediaGridProps {
  items: GalleryMedia[];
  onMediaClick: (index: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  }
};

export function MediaGrid({ items, onMediaClick }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full py-12 text-center text-[#2d2d2d]/60 font-medium italic">
        No moments captured yet.
      </div>
    );
  }

  return (
    <motion.div 
      className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {items.map((item, idx) => (
        <motion.div 
          key={item.id}
          variants={itemVariants}
          className="relative break-inside-avoid group cursor-pointer overflow-hidden rounded-sm transition-all duration-500 hover:shadow-[0_10px_30px_rgba(201,166,107,0.15)] bg-white/50 border border-transparent hover:border-[#C9A66B]/20"
          onClick={() => onMediaClick(idx)}
        >
          {/* Subtle overlay that fades on hover */}
          <div className="absolute inset-0 bg-[#2d2d2d]/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
          
          <div className="relative w-full overflow-hidden">
            {item.mediaType === "video" ? (
              <>
                <video 
                  src={item.url} 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.03]"
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 group-hover:scale-110 group-hover:bg-[#C9A66B]/80 group-hover:text-white transition-all duration-300 shadow-lg">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </>
            ) : (
              // Using a standard img tag with aspect-auto to support masonry variable heights properly
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={item.url} 
                alt={item.captionEn || "Gallery image"}
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
