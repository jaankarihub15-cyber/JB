"use client";

export function Infographic({
  src,
  alt,
  pageUrl,
  pageTitle,
  width,
  height,
}: {
  src: string;
  alt: string;
  pageUrl: string;
  pageTitle: string;
  width?: number;
  height?: number;
}) {
  const fullUrl = `https://knowledgekendra.com${pageUrl}`;
  const imgUrl = `https://knowledgekendra.com${src}`;

  const shareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${pageTitle}\n\n${fullUrl}`)}`,
      "_blank"
    );
  };

  const sharePinterest = () => {
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullUrl)}&media=${encodeURIComponent(imgUrl)}&description=${encodeURIComponent(pageTitle)}`,
      "_blank"
    );
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `${alt.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
    a.click();
  };

  return (
    <div className="my-8">
      <div className="border border-border rounded-2xl overflow-hidden bg-card">
        <img
          src={src}
          alt={alt}
          width={width || 3240}
          height={height || 4860}
          className="w-full h-auto"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button
          onClick={sharePinterest}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E60023] text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
        >
          📌 Pin It
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
        >
          📲 WhatsApp
        </button>
        <button
          onClick={download}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-text-secondary text-sm font-medium cursor-pointer hover:border-accent/40 transition-colors"
        >
          ⬇️ Download
        </button>
        <span className="text-xs text-text-muted ml-auto">Share this infographic</span>
      </div>
    </div>
  );
}
