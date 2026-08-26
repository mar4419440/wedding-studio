"use client";

import { useState } from "react";
import { CheckCircle2, Undo2 } from "lucide-react";

export function CheckinConfirm({
  familyId,
  initialCheckedIn,
  guestCount,
}: {
  familyId: string;
  initialCheckedIn: boolean;
  guestCount: number;
}) {
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyId, undo: checkedIn }),
      });
      if (!res.ok) throw new Error();
      setCheckedIn(!checkedIn);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      {checkedIn ? (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="size-4" />
          Checked in — welcome, party of {guestCount}!
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
      ) : null}

      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-60 ${
          checkedIn
            ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        {checkedIn ? (
          <>
            <Undo2 className="size-4" /> Undo check-in
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4" /> Mark as checked in
          </>
        )}
      </button>
    </div>
  );
}
