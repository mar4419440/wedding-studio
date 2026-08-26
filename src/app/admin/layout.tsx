export const dynamic = "force-dynamic";

// Auth is enforced by src/middleware.ts; this layout stays passive so the
// login page renders without dashboard chrome.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
