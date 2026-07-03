"use client";

import { useEffect, useRef } from "react";

// In-article AdSense unit, CLS-safe.
// The AdSense loader script is injected on first user interaction
// (see AdSenseLoader in layout). Because the script may not be present
// when this component mounts, we wait until adsbygoogle is available
// before pushing, so the ad reliably fills.
// A fixed min-height reserves space so the ad never shifts layout.

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slot = "2574732999" }: { slot?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;

    const tryPush = () => {
      if (pushed.current) return true;
      if (typeof window !== "undefined" && Array.isArray(window.adsbygoogle)) {
        try {
          window.adsbygoogle.push({});
          pushed.current = true;
          return true;
        } catch {
          // fall through to retry
        }
      }
      return false;
    };

    if (tryPush()) return;

    const interval = window.setInterval(() => {
      if (tryPush()) window.clearInterval(interval);
    }, 500);
    const stop = window.setTimeout(() => window.clearInterval(interval), 15000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, []);

  return (
    <div
      className="my-8"
      style={{ minHeight: 280, display: "block", textAlign: "center" }}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-1251062595068305"
        data-ad-slot={slot}
      />
    </div>
  );
}
