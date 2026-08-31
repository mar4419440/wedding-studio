import type { Metadata } from "next";
import { InviteTestClient } from "@/components/demo/invite-test-client";

export const metadata: Metadata = {
  title: "Wedding Studio — Invitation Test",
  description: "Preview the envelope reveal and invitation flow for each theme.",
};

export default function InviteTestPage() {
  return <InviteTestClient />;
}
