import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getOrigin } from "@/lib/families";

/** Public: renders a family's personal check-in QR as PNG. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const family = await prisma.family.findUnique({ where: { id } });
  if (!family) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const payload =
    family.qrCodeData ?? `${getOrigin(request)}/checkin/${family.id}`;

  const buffer = await QRCode.toBuffer(payload, {
    type: "png",
    width: 512,
    margin: 2,
    color: { dark: "#1b1b1b", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  const download = new URL(request.url).searchParams.get("download");
  const filename = `qr-${family.nameEn.replace(/[^\w.-]+/g, "_")}.png`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
      ...(download
        ? { "Content-Disposition": `attachment; filename="${filename}"` }
        : {}),
    },
  });
}
