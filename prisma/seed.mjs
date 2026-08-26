import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMG = {
  heroDesert:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBSGRJRF_VPGrSz00GszZaWW_c2_rY4Ics308E2HDy8qRC6Xwu3cKoIuAgWo_DKNLWoCrrIt7iSbpnSro1tbUaCoX5cC2S1sm5h9DUl270KE_uM7Zr41_12_cDvuZF4ZQ32fJ0sMomPtlimIFMJCO74XwsO4mSp0n0pmOCdl1DvhOkhV4AJgZPoIDHhlmnbvF92r1iw7OcYfimhpUA2kIjQrZK57CJvscNQNZImr0PWESewzD0-tLA",
  firstCoffee:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAw4eWy9ZCtRbPWU_Ogvwwm-C6XptyyYAOKM7Kt7W0XVg8m2LUA4vT4N2qxdWDDyTrlPssJRtrqnmlvyQHENNFiHZYq96LiVbq7hNT2kZw6f329PSYv0oCZjApJ_YIQYcCSq7QC26ka9zC0YdA4VOnkOERXE-bv4kD9P-C4ToP9a6Opd6pnCUKCJ_pe_Chq3rBLmuDyhH1RDdM4M9bu1air8OjRFlk1gVYwP7zCxM5iTlcY7Ua1Lu8",
  gardenHands:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBTt78VGCUR3qkteR0OQZojwmJ6WclSQ2KCv3LaCmjiIlh59bl4qPIzTAuV9JNqBeypQpn5ORilbGCkOJ-vJs2NOppeVKcUkIZYXXK5dnPfuimUmF69X1G0SLaGiwMy-x85rbbQMPg8rqNVSEu14PhvebWt57FHwkSTO5swtBYBK6TyG3BEY7ySvoFnq3BpWMZ8Mgoe8ccwduSktY1pr2P6YnEiHryKrMKhqaPm69One0l-KRu6zKw",
  dogWalk:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXXCJ2bSjs69sTG-mN9tXehlD8KUcB2LYghV3gMT7qXqhnf4EL9vhWgonVkntpxIVD_ggsQ6bRXQNf4apj205mQcUMc4E0lwUcnsJM4XlsAxSmiRSDQV6bj3hdY6-b0_DU_Q8Tw6XEiDjs8f4ibG5nzPwRdyWihNcuCOT0uO7rSNotsZ1oEogvRQsr6CnRjXLrGAI_6dF5Hzki1PiAVfbT1hau0MRWV3yuOnuhGvW6x-c2gzwHyIA",
  ballroomDance:
    "https://lh3.googleusercontent.com/aida/AEtjO1UQen-wlSPrgegxxQaGADEIwEU37CeiaawbuocG4lVshRfk_2AHjH7OD9amB8q-XCZh7UZLK_PSNzyxjXvuVMASYUXTXr4h_tJ3Cruq-V-uyPepGGWsEq8jxsIjRVkDiGotUT_KEUK6lcrSZErS8yzS4jFHUJ4L7zMa37OqjJxBVlIB8L9jn2uNb0RWiaQ2dTPH4mdLGbRTLZpbRzGVHUAiMN1nmQS0LF-4z3ul82voBckyKGgR6e7rYw",
  champagne:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhDdsSDob-M15KXFEVBnC7HfguCwn80ns7BT5mNAxlQjXos3Kh2POVgIdN-x8otpnxL_bo57meqMKUs8YhkHF0cs3WsyCmYloL1E538Na7p5yn-L2CYB6SJmmd_KTW4l_C9kInrvn0-l_YoqovbKao_yQldp0m_-I0g8xpUcCXbbLwsTit54AOn1Y3vriKEQH-kCOZjsr9T_Q1ZuUcZfLGEenlWnIwZatBlLgGP_QbKMWTtIv9rec",
  silkDetail:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDroaWhxS4WyWHZwjX22f_4zeELVc3Ms3SClSBtw7A82VyCem9ebJov8D0HlIzZm2FU3OQjwbfFzOTfbBPwA3bBevyeH2DOpb_hocdepb6mtRYdm3rH5XaoyOr26PVHMTLnT-v97Bbj2UugEnKI1s8O9YynrPNedweIDmKU7HS3N4drDTGg7bhfFCB1tDJ-x_uTellNx0cIBFS2scRybd-HS8c1RMxQt044MN_oIeAOoEZc58AQBH0",
  archwayWalk:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDJh2vm4P2PgdcJPS8B0QSt9A1G_plS_AYKjgF-ia-3rZAsrMVD8uzypCM80ppHssdiYEVIVvZhzbMrK-C7sFU_Y_rdNtZ5MWCPcZ7cKK-yIZR2XN4JgYpmL4j7sxEGfPI00uOQtdk8WHssSvbGd6LVJmxsg-eZPUUYKPkEgAi4KqMmsdRwVWa_8JNDsOZrbPpsVErAAETcU-VFiUjbKYMMf6FnioqMvUKnaeLcGI5IQ-Ps53nCj6Q",
  rosePathway:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAgy7K_NlaHUG_7rhNIfu1ByAyj6BFkbaHwpXPy-7ewHLOSKyQ0VSVGrWO7gr9jaFg0Ry3NDOEBwuKdI63TaWkiPzUS1daZdoYWv38vWYadypmujANmBaiweGO9LkvU6zHnRzzxCpbuMCCavpl0bdgG7LfdyU5UmtfkX5E2YnBkTM5bDGAqiPPJOgCoqCAAQcJjN2mnRwRS77l9oPfeX5NMYBw5RabQ9lmaTdwaO8pcui6-3xaDKXw",
};

const SETTINGS = {
  active_theme: "elegant-minimalist",
  couple_monogram: "A & K",
  couple_name_en: "Amira & Khalid",
  couple_name_ar: "أميرة و خالد",
  bride_en: "Amira",
  bride_ar: "أميرة",
  groom_en: "Khalid",
  groom_ar: "خالد",
  kicker_en: "We are getting married",
  kicker_ar: "نحن نحتفل بزواجنا",
  wedding_date_en: "Wednesday, October 14, 2026",
  wedding_date_ar: "الأربعاء، ١٤ أكتوبر ٢٠٢٦",
  wedding_time_en: "4:00 PM",
  wedding_time_ar: "٤:٠٠ مساءً",
  venue_en: "The Desert Oasis, Dubai",
  venue_ar: "واحة الصحراء، دبي",
  venue_address_en: "Al Qudra Road, Desert Oasis Resort, Dubai, UAE",
  venue_address_ar: "طريق القدرة، منتجع واحة الصحراء، دبي، الإمارات",
  map_embed_url:
    "https://www.openstreetmap.org/export/embed.html?bbox=55.1550%2C24.6500%2C55.7500%2C25.1000&layer=mapnik&marker=24.8750%2C55.4500",
  hero_image_url: IMG.heroDesert,
  rsvp_deadline_en: "Please kindly respond by September 1st, 2026.",
  rsvp_deadline_ar: "نرجو التكرم بالرد قبل الأول من سبتمبر ٢٠٢٦.",
};

async function main() {
  console.log("Seeding settings…");
  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  const familyCount = await prisma.family.count();
  if (familyCount === 0) {
    console.log("Seeding sample families…");
    await prisma.family.createMany({
      data: [
        { nameAr: "آل السويدي", nameEn: "The Al Suwaidi Family", phone: "+971501234567", guestCount: 6 },
        { nameAr: "عائلة الحمداني", nameEn: "The Al Hamdani Family", phone: "+971502345678", guestCount: 4, rsvpStatus: "CONFIRMED" },
        { nameAr: "آل الماجد", nameEn: "The Al Majeed Family", phone: "+971503456789", guestCount: 2, rsvpStatus: "DECLINED" },
        { nameAr: "عائلة القاسمي", nameEn: "The Al Qasimi Family", phone: "+971504567890", guestCount: 5 },
      ],
    });
  }

  const mediaCount = await prisma.media.count();
  if (mediaCount === 0) {
    console.log("Seeding story + gallery media…");
    await prisma.media.createMany({
      data: [
        // ---- Story timeline ----
        {
          kind: "story", order: 1, image: undefined,
          url: IMG.firstCoffee,
          titleEn: "The First Coffee", titleAr: "القهوة الأولى",
          bodyEn: "A serendipitous meeting over coffee in the city — laughter that lasted well past sunset.",
          bodyAr: "لقاء صدفة على فنجان قهوة في المدينة — ضحك استمر حتى ما بعد الغروب.",
          dateLabel: "June 2021",
        },
        {
          kind: "story", order: 2,
          url: IMG.gardenHands,
          titleEn: "Saying Yes", titleAr: "القول بنعم",
          bodyEn: "Under the stars on the Amalfi Coast, a question was asked and joyfully answered.",
          bodyAr: "تحت النجوم على ساحل أمالفي، طُرح سؤال وأُجيب عنه بكل فرح.",
          dateLabel: "December 2023",
        },
        {
          kind: "story", order: 3,
          url: IMG.dogWalk,
          titleEn: "Building a Home", titleAr: "بناء البيت",
          bodyEn: "We found a place where our story could grow roots — and adopted a very energetic dog.",
          bodyAr: "وجدنا مكانًا تنمو فيه قصتنا جذورًا — وتبنّينا كلبًا مليئًا بالطاقة.",
          dateLabel: "March 2024",
        },
        {
          kind: "story", order: 4,
          url: IMG.archwayWalk,
          titleEn: "The Journey Begins", titleAr: "بداية الرحلة",
          bodyEn: "Through seasons of change and across continents, our bond forged in quiet understanding.",
          bodyAr: "عبر فصول التغيير وعبر القارات، تعززت روابطنا في تفاهم هادئ.",
          dateLabel: "2025",
        },
        // ---- Memories gallery ----
        { kind: "gallery", order: 1, url: IMG.ballroomDance, captionEn: "First dance rehearsal", captionAr: "بروفة الرقصة الأولى", eventTag: "engagement" },
        { kind: "gallery", order: 2, url: IMG.champagne, captionEn: "Engagement toast", captionAr: "احتفال الخطوبة", eventTag: "engagement" },
        { kind: "gallery", order: 3, url: IMG.silkDetail, captionEn: "The dress, up close", captionAr: "الفستان عن قرب", eventTag: "wedding" },
        { kind: "gallery", order: 4, url: IMG.rosePathway, captionEn: "Henna night aisle", captionAr: "ممر ليلة الحنة", eventTag: "henna" },
        { kind: "gallery", order: 5, url: IMG.gardenHands, captionEn: "Hands intertwined", captionAr: "أيدٍ متشابكة", eventTag: "engagement" },
        { kind: "gallery", order: 6, url: IMG.archwayWalk, captionEn: "An evening stroll", captionAr: "نزهة مسائية", eventTag: "other" },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
