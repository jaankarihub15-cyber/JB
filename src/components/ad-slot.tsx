"use client";

import { useEffect, useRef } from "react";

// In-article AdSense unit, CLS-safe.
// Pattern: queue the ad request immediately on mount by pushing to
// window.adsbygoogle (creating the array if needed). AdSense's script,
// whenever it loads (here: injected on first user interaction by
// AdSenseLoader), drains this queue and fills the <ins> slot.
// Pushing BEFORE the script loads is the supported, reliable pattern.
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
    pushed.current = true;
    try {
      // Create the queue if it doesn't exist yet, and queue this slot.
      // The AdSense script drains this queue when it loads.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocked or errored; fail silently.
    }
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
