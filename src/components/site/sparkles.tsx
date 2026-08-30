"use client";

import { useMemo } from "react";

/** Pure index-based hash → deterministic pseudo-random [0,1). */
function hash(n: number): number {
  let t = (n + 0x9e3779b9) | 0;
  t = Math.imul(t ^ (t >>> 16), 0x21f0aaad);
  t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
  return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
}

/** Deterministic sparkle field (visible only in luxury-dark/nocturne theme). */
export function Sparkles({ count = 28 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(hash(i * 3 + 1) * 100).toFixed(2)}%`,
        top: `${(hash(i * 3 + 2) * 100).toFixed(2)}%`,
        delay: `${(hash(i * 3 + 3) * 3.2).toFixed(2)}s`,
        duration: `${(2.2 + hash(i * 7 + 5) * 2.5).toFixed(2)}s`,
      })),
    [count]
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: dot.left,
            top: dot.top,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  );
}
