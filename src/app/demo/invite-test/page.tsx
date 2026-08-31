import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { InviteTestClient } from "@/components/demo/invite-test-client";

export const metadata: Metadata = {
  title: "Wedding Studio — Invitation Test",
  description: "Preview the envelope reveal and invitation flow for the active theme.",
};

export default async function InviteTestPage() {
  const settings = await getSettings();
  return <InviteTestClient settings={settings} />;
}
