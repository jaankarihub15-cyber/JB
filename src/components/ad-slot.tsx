"use client";

import { useEffect, useRef } from "react";

// In-article AdSense unit, CLS-safe.
// The loader script (adsbygoogle.js) is already in <head> via layout.tsx,
// so this component only renders the <ins> unit and triggers the push.
// A fixed min-height reserves space so the ad never shifts layout while loading.

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
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not ready or blocked; fail silently
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
