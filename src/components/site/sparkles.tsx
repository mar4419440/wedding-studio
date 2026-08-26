"use client";

import { useMemo } from "react";

/** Deterministic pseudo-random sparkle field (visible only in luxury-dark). */
export function Sparkles({ count = 28 }: { count?: number }) {
  const dots = useMemo(() => {
    let seed = 20261014;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return Array.from({ length: count }, () => ({
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(rand() * 100).toFixed(2)}%`,
      delay: `${(rand() * 3.2).toFixed(2)}s`,
      duration: `${(2.2 + rand() * 2.5).toFixed(2)}s`,
    }));
  }, [count]);

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
