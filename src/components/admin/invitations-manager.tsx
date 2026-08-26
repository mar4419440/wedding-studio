"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Copy,
  Download,
  Link2,
  Pencil,
  Plus,
  QrCode,
  Search,
  Trash2,
  X,
} from "lucide-react";

interface FamilyRow {
  id: string;
  nameAr: string;
  nameEn: string;
  phone: string | null;
  guestCount: number;
  rsvpStatus: "PENDING" | "CONFIRMED" | "DECLINED";
  checkedIn: boolean;
  inviteUrl: string;
  fullInviteUrl: string;
  qrUrl: string;
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "DECLINED"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

const statusTone: Record<StatusOption, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  DECLINED: "bg-rose-50 text-rose-500 border-rose-200",
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
};

export function InvitationsManager() {
  const [families, setFamilies] = useState<FamilyRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusOption | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [created, setCreated] = useState<FamilyRow | null>(null);
  const [editing, setEditing] = useState<FamilyRow | null>(null);
  const [deleting, setDeleting] = useState<FamilyRow | null>(null);
  const [qrPreview, setQrPreview] = useState<FamilyRow | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/families?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFamilies(data.families as FamilyRow[]);
      }
    } finally {
      setLoading(false);
    }
  }, [query, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, query]);

  async function updateStatus(family: FamilyRow, rsvpStatus: StatusOption) {
    setFamilies((rows) =>
      rows.map((row) => (row.id === family.id ? { ...row, rsvpStatus } : row))
    );
    await fetch(`/api/families/${family.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rsvpStatus }),
    });
  }

  async function removeFamily() {
    if (!deleting) return;
    await fetch(`/api/families/${deleting.id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  }

  async function copyInviteLink(family: FamilyRow) {
    await navigator.clipboard.writeText(
      `${window.location.origin}${family.inviteUrl}`
    );
    setCopiedId(family.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function downloadZip() {
    const res = await fetch("/api/families/bulk-qr");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-qr-codes.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = useMemo(() => families.reduce((acc, f) => { acc[f.rsvpStatus]++; return acc; }, { PENDING: 0, CONFIRMED: 0, DECLINED: 0 }), [families]);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Invitations</h1>
          <p className="mt-1 text-sm text-stone-500">
            {families.length} families · {stats.CONFIRMED} confirmed ·{" "}
            {stats.DECLINED} declined
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadZip}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400"
          >
            <Download className="size-4" />
            Export all QRs
          </button>
          <button
            type="button"
            onClick={() => {
              setCreated(null);
              setAddOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            <Plus className="size-4" />
            Add new invitation
          </button>
        </div>
      </header>

      {/* Search & filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or phone…"
            className="w-64 rounded-xl border border-stone-300 bg-white py-2.5 pe-3 ps-9 text-sm outline-none transition-colors focus:border-stone-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusOption | "ALL")}
          className="cursor-pointer rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-stone-500"
        >
          <option value="ALL">All RSVP statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-start text-xs uppercase tracking-wide text-stone-400">
              <th className="px-4 py-3 text-start font-semibold">QR</th>
              <th className="px-4 py-3 text-start font-semibold">Family</th>
              <th className="px-4 py-3 text-start font-semibold">Phone</th>
              <th className="px-4 py-3 text-start font-semibold">Guests</th>
              <th className="px-4 py-3 text-start font-semibold">RSVP</th>
              <th className="px-4 py-3 text-start font-semibold">Check-in</th>
              <th className="px-4 py-3 text-end font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && families.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-stone-400">
                  Loading…
                </td>
              </tr>
            ) : families.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-stone-400">
                  No families match. Add your first invitation.
                </td>
              </tr>
            ) : (
              families.map((family) => (
                <tr key={family.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setQrPreview(family)}
                      title="View QR code"
                      className="cursor-pointer overflow-hidden rounded-lg border border-stone-200 bg-white transition-transform hover:scale-105"
                    >
                      <Image
                        src={`/api/families/${family.id}/qr`}
                        alt={`QR ${family.nameEn}`}
                        unoptimized
                        width={40}
                        height={40}
                        className="size-10"
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{family.nameEn}</p>
                    <p className="text-xs text-stone-400" dir="rtl" lang="ar">
                      {family.nameAr}
                    </p>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-stone-500" dir="ltr">
                    {family.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{family.guestCount}</td>
                  <td className="px-4 py-3">
                    <select
                      value={family.rsvpStatus}
                      onChange={(e) =>
                        updateStatus(family, e.target.value as StatusOption)
                      }
                      className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold outline-none ${statusTone[family.rsvpStatus]}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {family.checkedIn ? (
                      <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                        Arrived ✓
                      </span>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => copyInviteLink(family)}
                        title={copiedId === family.id ? "Copied!" : "Copy invite link"}
                        className={`cursor-pointer rounded-lg p-2 transition-colors ${
                          copiedId === family.id
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                        }`}
                      >
                        {copiedId === family.id ? (
                          <Link2 className="size-4" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(family)}
                        title="Edit"
                        className="cursor-pointer rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(family)}
                        title="Delete"
                        className="cursor-pointer rounded-lg p-2 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / created-success dialog */}
      {(addOpen || created) && (
        <Modal onClose={() => { setAddOpen(false); setCreated(null); }} wide={!!created}>
          {created ? (
            <SuccessPanel
              family={created}
              onDone={() => {
                setCreated(null);
                load();
              }}
            />
          ) : (
            <FamilyForm
              onCancel={() => setAddOpen(false)}
              onSaved={(family) => {
                setAddOpen(false);
                setCreated(family);
                load();
              }}
            />
          )}
        </Modal>
      )}

      {/* Edit dialog */}
      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <FamilyForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              load();
            }}
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {deleting && (
        <Modal onClose={() => setDeleting(null)}>
          <div className="text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50">
              <Trash2 className="size-5 text-rose-500" />
            </span>
            <h3 className="mt-4 text-lg font-bold">
              Delete “{deleting.nameEn}”?
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Their invitation link and QR code will stop working. This cannot be
              undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="flex-1 cursor-pointer rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={removeFamily}
                className="flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* QR preview */}
      {qrPreview && (
        <Modal onClose={() => setQrPreview(null)}>
          <div className="text-center">
            <h3 className="text-lg font-bold">{qrPreview.nameEn}</h3>
            <p className="text-sm text-stone-400" dir="rtl" lang="ar">
              {qrPreview.nameAr}
            </p>
            <Image
              src={`/api/families/${qrPreview.id}/qr`}
              alt={`QR ${qrPreview.nameEn}`}
              unoptimized
              width={220}
              height={220}
              className="mx-auto mt-4 rounded-xl border border-stone-200 p-2"
            />
            <p className="mt-2 break-all text-xs text-stone-400" dir="ltr">
              {qrPreview.qrUrl}
            </p>
            <a
              href={`/api/families/${qrPreview.id}/qr?download=1`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-50"
            >
              <Download className="size-4" /> Download PNG
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------ sub-components ----------------------------- */

function Modal({
  children,
  onClose,
  wide,
}: {
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ${
          wide ? "max-w-md" : "max-w-sm"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute end-4 top-4 cursor-pointer rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function FamilyForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: FamilyRow;
  onSaved: (family: FamilyRow) => void;
  onCancel: () => void;
}) {
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [guestCount, setGuestCount] = useState(initial?.guestCount ?? 2);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        initial ? `/api/families/${initial.id}` : "/api/families",
        {
          method: initial ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nameEn, nameAr, phone, guestCount }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save.");
        return;
      }
      onSaved(data.family as FamilyRow);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <h3 className="text-lg font-bold">
        {initial ? "Edit invitation" : "New invitation"}
      </h3>

      <label className="mt-4 block text-sm font-medium text-stone-600">
        Family name (English) *
        <input
          required
          dir="ltr"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
          placeholder="The Al Suwaidi Family"
        />
      </label>

      <label className="mt-3 block text-sm font-medium text-stone-600">
        اسم العائلة (بالعربي) *
        <input
          required
          dir="rtl"
          lang="ar"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
          placeholder="آل السويدي"
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium text-stone-600">
          Phone
          <input
            dir="ltr"
            value={phone ?? ""}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
            placeholder="+9715…"
          />
        </label>
        <label className="block text-sm font-medium text-stone-600">
          Guests
          <input
            type="number"
            min={1}
            max={50}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-500"
          />
        </label>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 cursor-pointer rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex-1 cursor-pointer rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {busy ? "Saving…" : initial ? "Save changes" : "Create invitation"}
        </button>
      </div>
    </form>
  );
}

function SuccessPanel({ family, onDone }: { family: FamilyRow; onDone: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}${family.inviteUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50">
        <QrCode className="size-6 text-emerald-600" />
      </span>
      <h3 className="mt-3 text-lg font-bold">Invitation ready!</h3>
      <p className="mt-1 text-sm text-stone-500">
        Share the private link below — it opens a personalized invitation for{" "}
        <strong>{family.nameEn}</strong> ({family.guestCount} guests).
      </p>

      <Image
        src={`/api/families/${family.id}/qr`}
        alt={`QR ${family.nameEn}`}
        unoptimized
        width={160}
        height={160}
        className="mx-auto mt-4 rounded-xl border border-stone-200 p-2"
      />

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2.5">
        <code className="min-w-0 flex-1 truncate text-start text-xs text-stone-500" dir="ltr">
          {family.fullInviteUrl || family.inviteUrl}
        </code>
        <button
          type="button"
          onClick={copyLink}
          className={`shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold ${
            copied ? "bg-emerald-100 text-emerald-700" : "bg-stone-900 text-white hover:bg-stone-700"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={`/api/families/${family.id}/qr?download=1`}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50"
        >
          <Download className="size-4" /> QR
        </a>
        <a
          href={family.inviteUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold hover:bg-stone-50"
        >
          Open preview
        </a>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-4 w-full cursor-pointer rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-700"
      >
        Done
      </button>
    </div>
  );
}
