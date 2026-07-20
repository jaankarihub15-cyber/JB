"use client";

import { useState } from "react";

function track(method: string) {
  try {
    // @ts-expect-error gtag injected by layout
    if (typeof window !== "undefined" && window.gtag) {
      // @ts-expect-error gtag injected by layout
      window.gtag("event", "share", { method, content_type: "page", item_id: window.location.pathname });
    }
  } catch {}
}

export function ShareRail({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => (typeof window !== "undefined" ? window.location.href.split("#")[0] : "");
  const waHref = () =>
    `https://wa.me/?text=${encodeURIComponent(`${title}\n${url()}`)}`;
  const tgHref = () =>
    `https://t.me/share/url?url=${encodeURIComponent(url())}&text=${encodeURIComponent(title)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      track("copy_link");
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="hidden lg:flex fixed left-3 top-[38%] z-30 flex-col items-center gap-2">
      <span className="text-[9px] font-bold tracking-widest text-text-muted select-none">SHARE</span>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); track("whatsapp"); window.open(waHref(), "_blank", "noopener"); }}
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
        className="w-10 h-10 rounded-full bg-accent-light text-accent-dark border border-accent/25 shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3.2-.5v-.4c0-.1-.5-1.4-.7-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z"/>
        </svg>
      </a>
      <button
        onClick={copy}
        aria-label="Copy link"
        title={copied ? "Copied" : "Copy link"}
        className="w-10 h-10 rounded-full bg-card border border-border text-text-secondary shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
      >
        {copied ? (
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-accent" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-.7.7" strokeLinecap="round" />
            <path d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.7-.7" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); track("telegram"); window.open(tgHref(), "_blank", "noopener"); }}
        aria-label="Share on Telegram"
        title="Share on Telegram"
        className="w-10 h-10 rounded-full bg-card border border-border text-text-secondary shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 5L2.5 12.3l6.7 1.2M21 5l-2.6 14.5L10 13.7M21 5L9.2 13.5v5l2.8-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
