import type { Family } from "@prisma/client";

export function getOrigin(request: Request): string {
  const h = request.headers;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

/** Public shape sent to guests / admin table rows. */
export function serializeFamily(family: Family, origin: string) {
  return {
    id: family.id,
    nameAr: family.nameAr,
    nameEn: family.nameEn,
    phone: family.phone,
    guestCount: family.guestCount,
    rsvpStatus: family.rsvpStatus,
    checkedIn: family.checkedIn,
    checkedInAt: family.checkedInAt,
    createdAt: family.createdAt,
    inviteUrl: `/checkin/${family.id}`,
    fullInviteUrl: `${origin}/checkin/${family.id}`,
    qrUrl: `${origin}/checkin/${family.id}`,
  };
}

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Short human-readable code used inside QR payloads for quick manual entry. */
export function shortCode(): string {
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}
