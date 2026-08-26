/**
 * Media links support any public image/video URL — including Google Drive
 * share links ("Anyone with the link"). Drive links are converted to
 * renderable equivalents so nothing is ever stored on our server.
 */

const DRIVE_FILE = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?[^ ]*id=)([\w-]{20,})/;

export function extractDriveId(url: string): string | null {
  const match = url.match(DRIVE_FILE);
  return match ? match[1] : null;
}

export function isVideoUrl(url: string): boolean {
  if (/\.(mp4|webm|mov|m4v|ogg|ogv)(\?|$)/i.test(url)) return true;
  const driveId = extractDriveId(url);
  if (driveId) {
    // Heuristic: Drive preview links pasted by users are usually videos.
    // Type can always be overridden manually in the media manager.
    return false;
  }
  return false;
}

/** Normalize a pasted link into a storable URL. */
export function normalizeMediaUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  const driveId = extractDriveId(trimmed);
  if (!driveId) return trimmed;

  // Canonicalize the various Drive shapes to /file/d/<id>/view
  if (!trimmed.includes("/file/d/")) {
    return `https://drive.google.com/file/d/${driveId}/view`;
  }
  return trimmed.split("?")[0];
}

/** Best-effort directly-renderable image URL. */
export function imageUrl(url: string): string {
  const driveId = extractDriveId(url);
  if (driveId) {
    // lh3 serves full-size images for public files without download headers
    return `https://lh3.googleusercontent.com/d/${driveId}=w1600`;
  }
  return url;
}

/** True when a video should be embedded via Google's player iframe. */
export function isDriveVideo(url: string): boolean {
  return extractDriveId(url) !== null && url.includes("drive.google.com");
}

/** Embed/player URL for drive-hosted videos. */
export function videoEmbedUrl(url: string): string | null {
  const driveId = extractDriveId(url);
  return driveId ? `https://drive.google.com/file/d/${driveId}/preview` : null;
}
