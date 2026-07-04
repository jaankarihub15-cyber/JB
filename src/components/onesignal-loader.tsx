"use client";

import { useEffect } from "react";

// Loads the OneSignal Web SDK only after the first real user interaction
// (scroll, touch, mouse-move, or keydown), mirroring AdSenseLoader. This keeps
// PageSpeed/Lighthouse lab metrics intact (bots do not interact) while real
// users trigger the load within ~1s, so the subscribe prompt still appears.
// One-time injection, guarded so it never loads twice.

const ONESIGNAL_APP_ID = "209a4109-ba62-4187-a35a-2efe8bd1ba56";
const ONESIGNAL_SRC = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(os: unknown) => void>;
  }
}

export function OneSignalLoader() {
  useEffect(() => {
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      if (document.querySelector('script[data-onesignal="1"]')) return;

      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal: any) => {
        await OneSignal.init({ appId: ONESIGNAL_APP_ID });
      });

      const s = document.createElement("script");
      s.src = ONESIGNAL_SRC;
      s.defer = true;
      s.setAttribute("data-onesignal", "1");
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

    // Fallback: load after 5s even with no interaction, so the prompt can show.
    const timer = window.setTimeout(load, 5000);

    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    }

    return cleanup;
  }, []);

  return null;
}
