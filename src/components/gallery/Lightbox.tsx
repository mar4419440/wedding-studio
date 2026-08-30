"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryMedia } from "./types";
import { useUi } from "@/store/ui";

interface LightboxProps {
  items: GalleryMedia[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ items, initialIndex, onClose }: LightboxProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const activeItem = items[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") isAr ? handlePrev() : handleNext();
      if (e.key === "ArrowLeft") isAr ? handleNext() : handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent scrolling behind lightbox
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, handleNext, handlePrev, isAr]);

  if (!activeItem) return null;

  const caption = isAr ? activeItem.captionAr : activeItem.captionEn;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]/95 backdrop-blur-md"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
          <span className="text-[#C9A66B] font-medium tracking-widest text-sm drop-shadow-md">
            {currentIndex + 1} / {items.length}
          </span>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#C9A66B] transition-colors p-2 bg-black/20 rounded-full backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Areas (Clickable sides) */}
        <div className="absolute inset-y-0 left-0 w-1/6 sm:w-1/4 z-[5] cursor-w-resize" onClick={isAr ? handleNext : handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/6 sm:w-1/4 z-[5] cursor-e-resize" onClick={isAr ? handlePrev : handleNext} />

        {/* Nav Buttons (Visible on sm+) */}
        <button 
          onClick={isAr ? handleNext : handlePrev}
          className="hidden sm:flex absolute left-4 z-10 p-3 rounded-full bg-black/30 hover:bg-[#C9A66B]/20 text-white hover:text-[#C9A66B] backdrop-blur-sm transition-all border border-transparent hover:border-[#C9A66B]/30"
        >
          {isAr ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
        </button>
        
        <button 
          onClick={isAr ? handlePrev : handleNext}
          className="hidden sm:flex absolute right-4 z-10 p-3 rounded-full bg-black/30 hover:bg-[#C9A66B]/20 text-white hover:text-[#C9A66B] backdrop-blur-sm transition-all border border-transparent hover:border-[#C9A66B]/30"
        >
          {isAr ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
        </button>

        {/* Main Content Area */}
        <div className="relative w-full h-full max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {activeItem.mediaType === "video" ? (
                <video 
                  src={activeItem.url}
                  className="max-w-full max-h-full object-contain rounded-sm shadow-2xl shadow-black/50"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <Image 
                  src={activeItem.url} 
                  alt={caption || "Gallery image"} 
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="100vw"
                  priority
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Caption removed as requested */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
