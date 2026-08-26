import { NextResponse } from "next/server";
import JSZip from "jszip";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getOrigin } from "@/lib/families";

/** Admin: bulk-export every family's QR code as a ZIP of PNGs. */
export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const families = await prisma.family.findMany({
    orderBy: { createdAt: "asc" },
  });
  if (families.length === 0) {
    return NextResponse.json({ error: "No families yet." }, { status: 400 });
  }

  const origin = getOrigin(request);
  const zip = new JSZip();

  for (const [index, family] of families.entries()) {
    const payload = family.qrCodeData ?? `${origin}/checkin/${family.id}`;
    const png = await QRCode.toBuffer(payload, {
      type: "png",
      width: 512,
      margin: 2,
    });
    const safeName = `${String(index + 1).padStart(3, "0")}-${family.nameEn.replace(/[^\w.-]+/g, "_")}`;
    zip.file(`${safeName}.png`, png);
  }

  // Human-readable index sheet
  const csv = ["name_en,name_ar,guests,rsvp,invite_url"]
    .concat(
      families.map((f) =>
        [
          f.nameEn,
          f.nameAr,
          f.guestCount,
          f.rsvpStatus,
          `${origin}/invite/${f.id}`,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    )
    .join("\n");
  zip.file("families.csv", csv);

  const content = await zip.generateAsync({ type: "nodebuffer" });
  return new NextResponse(new Uint8Array(content), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="wedding-qr-codes.zip"',
    },
  });
}
