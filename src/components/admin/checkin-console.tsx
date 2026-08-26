"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, CameraOff, CheckCircle2, Search } from "lucide-react";

interface FamilyLite {
  id: string;
  nameEn: string;
  nameAr: string;
  guestCount: number;
  phone: string | null;
  rsvpStatus: string;
  checkedIn: boolean;
}

interface Stats {
  guests: { total: number; confirmed: number; checkedIn: number };
  families: { total: number; confirmed: number; checkedIn: number };
}

type ScanSupported = boolean | "unknown";

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
};

function getBarcodeDetector():
  | (new (options?: { formats?: string[] }) => BarcodeDetectorLike)
  | null {
  const w = window as unknown as {
    BarcodeDetector?: new (options?: { formats?: string[] }) => BarcodeDetectorLike;
  };
  return w.BarcodeDetector ?? null;
}

export function CheckinConsole() {
  const [code, setCode] = useState("");
  const [family, setFamily] = useState<FamilyLite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<FamilyLite[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanSupported, setScanSupported] = useState<ScanSupported>("unknown");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    const [statsRes, recentRes] = await Promise.all([
      fetch("/api/stats"),
      fetch("/api/families?checkedIn=1&limit=8"),
    ]);
    if (statsRes.ok) setStats(await statsRes.json());
    if (recentRes.ok) {
      const data = await recentRes.json();
      setRecent(data.families as FamilyLite[]);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 6000); // live counter
    return () => clearInterval(timer);
  }, [refresh]);

  async function lookup(raw?: string) {
    const value = (raw ?? code).trim();
    if (!value) return;
    setBusy(true);
    setError(null);
    setFamily(null);
    try {
      const res = await fetch(`/api/checkin?code=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "Not found" ? "No family matches that code." : "Lookup failed.");
        return;
      }
      setFamily(data.family as FamilyLite);
    } finally {
      setBusy(false);
    }
  }

  async function toggleCheckin(familyId: string, undo: boolean) {
    setBusy(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyId, undo }),
      });
      if (res.ok) {
        const data = await res.json();
        setFamily(data.family as FamilyLite);
        refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  /* ---------------- BarcodeDetector camera scanning ---------------- */
  const stopScan = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  const startScan = useCallback(async () => {
    setError(null);
    const Detector = getBarcodeDetector();
    if (!Detector) {
      setScanSupported(false);
      setError("Camera QR scanning is not supported on this browser — enter the code manually.");
      return;
    }
    setScanSupported(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const detector = new Detector({ formats: ["qr_code"] });
      let stopped = false;

      const tick = async () => {
        if (stopped || !videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) {
            const payload = codes[0].rawValue;
            stopScan();
            setCode(payload.slice(-36));
            await lookup(payload);
            return;
          }
        } catch {
          /* keep scanning */
        }
        rafRef.current = requestAnimationFrame(() => void tick());
      };
      void tick();
    } catch {
      setError("Unable to access the camera.");
      stopScan();
    }
  }, [lookup, stopScan]);

  useEffect(() => () => stopScan(), [stopScan]);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Check-in</h1>
        <p className="mt-1 text-sm text-stone-500">
          Scan a guest&apos;s QR code or look up their family ID at the entrance.
        </p>
      </header>

      {/* Live counters */}
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold tabular-nums text-violet-600">
            {stats?.families.checkedIn ?? "—"}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Families arrived
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold tabular-nums">{stats?.guests.checkedIn ?? "—"}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Guests inside
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold tabular-nums">{stats?.guests.confirmed ?? "—"}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Confirmed guests
          </p>
        </div>
      </section>

      {/* Lookup */}
      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup();
          }}
          className="flex flex-wrap gap-3"
        >
          <input
            dir="ltr"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste scanned URL, family ID or code…"
            className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-stone-500"
          />
          <button
            type="submit"
            disabled={busy}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
          >
            <Search className="size-4" />
            Look up
          </button>
          {scanning ? (
            <button
              type="button"
              onClick={stopScan}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600"
            >
              <CameraOff className="size-4" />
              Stop camera
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void startScan()}
              title={scanSupported === false ? "Not supported in this browser" : "Scan QR"}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50"
            >
              <Camera className="size-4" />
              Scan QR
            </button>
          )}
        </form>

        {scanning ? (
          <video
            ref={videoRef}
            muted
            playsInline
            className="mt-4 aspect-video w-full rounded-xl object-cover"
          />
        ) : null}

        {error ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
        ) : null}

        {/* Result card */}
        {family ? (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">{family.nameEn}</p>
                <p className="text-sm text-stone-500" dir="rtl" lang="ar">
                  {family.nameAr}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">
                  Party of {family.guestCount} · RSVP {family.rsvpStatus}
                  {family.phone ? ` · ${family.phone}` : ""}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => toggleCheckin(family.id, family.checkedIn)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-60 ${
                  family.checkedIn
                    ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <CheckCircle2 className="size-4" />
                {family.checkedIn ? "Undo" : "Check in"}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Recent arrivals */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-stone-400">
          Recent arrivals
        </h2>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {recent.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-stone-400">
              No check-ins yet.
            </p>
          ) : (
            <ul>
              {recent.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 border-b border-stone-100 px-4 py-3 last:border-0"
                >
                  <Image
                    src={`/api/families/${entry.id}/qr`}
                    alt=""
                    unoptimized
                    width={32}
                    height={32}
                    className="size-8 rounded-md border border-stone-100"
                  />
                  <span className="flex-1 truncate text-sm font-medium">{entry.nameEn}</span>
                  <span className="text-xs tabular-nums text-stone-400">
                    {entry.guestCount} guests
                  </span>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
