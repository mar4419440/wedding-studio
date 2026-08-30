"use client";

import Image from "next/image";
import { useUi } from "@/store/ui";

interface GuestQrCardProps {
  qrCodeDataUrl: string;
}

export function GuestQrCard({ qrCodeDataUrl }: GuestQrCardProps) {
  const language = useUi((s) => s.language);
  const isAr = language === "ar";

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-xl shadow-inner my-2 border border-black/10">
        <Image 
          src={qrCodeDataUrl} 
          alt="Check-in QR Code" 
          width={180} 
          height={180}
          className="rounded-lg"
          priority
        />
      </div>
      <p className="text-xs text-white/90 text-center max-w-[250px] mt-2 drop-shadow-md font-medium">
        {isAr 
          ? "يرجى إبراز هذا الرمز عند بوابة الدخول" 
          : "Please present this QR code at the entrance for check-in."}
      </p>
    </div>
  );
}
