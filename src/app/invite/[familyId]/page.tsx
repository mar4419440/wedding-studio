import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getOrigin } from "@/lib/families";
import { headers } from "next/headers";
import { InviteClient, type InviteData } from "@/components/invite/invite-client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ familyId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { familyId } = await params;
  const family = await prisma.family
    .findUnique({ where: { id: familyId } })
    .catch(() => null);
  return {
    title: family ? `Invitation — ${family.nameEn}` : "Invitation",
    description: "Personalized wedding invitation.",
  };
}

export default async function InvitePage({ params }: Props) {
  const { familyId } = await params;
  const [family, settings] = await Promise.all([
    prisma.family.findUnique({ where: { id: familyId } }).catch(() => null),
    getSettings(),
  ]);

  if (!family) notFound();

  const origin = getOrigin(new Request("http://x", { headers: await headers() }));

  const data: Omit<InviteData, never> = {
    family: {
      id: family.id,
      nameAr: family.nameAr,
      nameEn: family.nameEn,
      guestCount: family.guestCount,
      rsvpStatus: family.rsvpStatus,
    },
    settings,
    qrSrc: `/api/families/${family.id}/qr`,
    fullInviteUrl: `${origin}/invite/${family.id}`,
  };

  return <InviteClient {...data} />;
}
