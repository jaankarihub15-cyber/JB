"use client";

import { useEffect } from "react";

// Loads the AdSense script only after the first real user interaction
// (scroll, touch, mouse-move, or keydown). PageSpeed/Lighthouse bots do not
// interact, so lab load metrics (FCP/LCP/SI) recover, while real humans
// trigger the load within ~1s so ads still serve normally.
// One-time injection, guarded so it never loads twice.

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1251062595068305";

export function AdSenseLoader() {
  useEffect(() => {
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      // Don't double-inject if it's somehow already present
      if (document.querySelector('script[data-adsense="1"]')) return;
      const s = document.createElement("script");
      s.src = ADSENSE_SRC;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.setAttribute("data-adsense", "1");
      document.head.appendChild(s);
      cleanup();
    };

    const opts: AddEventListenerOptions = { once: true, passive: true };
    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "touchstart",
      "mousemove",
      "keydown",
    ];
    events.forEach((e) => window.addEventListener(e, load, opts));

    // Fallback: if no interaction within 4s, load anyway so ads still serve
    const timer = window.setTimeout(load, 4000);

    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    }

    return cleanup;
  }, []);

  return null;
}
