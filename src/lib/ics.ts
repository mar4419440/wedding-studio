export interface IcsEvent {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}

function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/** Build a downloadable .ics calendar invite (RFC 5545). */
export function buildIcs(event: IcsEvent): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Platform//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(event.end)}`,
    `SUMMARY:${event.title.replace(/\n/g, "\\n")}`,
    `DESCRIPTION:${(event.description ?? "").replace(/\n/g, "\\n")}`,
    `LOCATION:${(event.location ?? "").replace(/[,;]/g, "\\$&")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(filename: string, event: IcsEvent): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Parse an English date string + time string ("October 14, 2026", "4:00 PM"). */
export function parseDateTime(dateStr: string, timeStr: string): Date | null {
  const parsed = new Date(`${dateStr} ${timeStr}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
