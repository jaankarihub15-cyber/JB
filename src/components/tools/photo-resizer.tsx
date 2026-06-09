"use client";

import { useState, useRef, useCallback } from "react";

type Mode = "photo" | "signature";

const PRESETS: Record<Mode, { label: string; w: number; h: number; kb: number; note: string }[]> = {
  photo: [
    { label: "Standard photo (50KB)", w: 200, h: 230, kb: 50, note: "Most common exam form photo size" },
    { label: "Passport photo (100KB)", w: 350, h: 350, kb: 100, note: "Larger passport-style photo" },
    { label: "Small photo (20KB)", w: 160, h: 200, kb: 20, note: "Tight size limit forms" },
  ],
  signature: [
    { label: "Standard signature (20KB)", w: 140, h: 60, kb: 20, note: "Most common signature box size" },
    { label: "Small signature (10KB)", w: 120, h: 50, kb: 10, note: "Tight signature limit" },
    { label: "Wide signature (30KB)", w: 200, h: 80, kb: 30, note: "Larger signature box" },
  ],
};

function bytesToKb(b: number) {
  return Math.round((b / 1024) * 10) / 10;
}

export function PhotoResizer() {
  const [mode, setMode] = useState<Mode>("photo");
  const [srcUrl, setSrcUrl] = useState<string>("");
  const [srcName, setSrcName] = useState<string>("");
  const [srcKb, setSrcKb] = useState<number>(0);
  const [targetW, setTargetW] = useState(200);
  const [targetH, setTargetH] = useState(230);
  const [targetKb, setTargetKb] = useState(50);
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [outUrl, setOutUrl] = useState<string>("");
  const [outKb, setOutKb] = useState<number>(0);
  const [outW, setOutW] = useState<number>(0);
  const [outH, setOutH] = useState<number>(0);
  const [working, setWorking] = useState(false);
  const [warn, setWarn] = useState<string>("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const switchMode = (m: Mode) => {
    setMode(m);
    const p = PRESETS[m][0];
    setTargetW(p.w);
    setTargetH(p.h);
    setTargetKb(p.kb);
    setOutUrl("");
  };

  const applyPreset = (p: { w: number; h: number; kb: number }) => {
    setTargetW(p.w);
    setTargetH(p.h);
    setTargetKb(p.kb);
    setOutUrl("");
  };

  const onFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setWarn("Please choose an image file (JPG or PNG).");
      return;
    }
    setWarn("");
    setOutUrl("");
    setSrcName(f.name);
    setSrcKb(bytesToKb(f.size));
    const url = URL.createObjectURL(f);
    setSrcUrl(url);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
    };
    img.src = url;
  };

  const resize = useCallback(async () => {
    const img = imgRef.current;
    if (!img) {
      setWarn("Choose an image first.");
      return;
    }
    setWorking(true);
    setWarn("");

    await new Promise((r) => setTimeout(r, 30));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setWarn("Your browser could not process the image.");
      setWorking(false);
      return;
    }
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetW, targetH);
    }

    const scale = Math.max(targetW / img.width, targetH / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (targetW - dw) / 2;
    const dy = (targetH - dh) / 2;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dw, dh);

    const targetBytes = targetKb * 1024;
    const mime = format === "jpeg" ? "image/jpeg" : "image/png";

    const blobAt = (q: number): Promise<Blob | null> =>
      new Promise((res) => canvas.toBlob((b) => res(b), mime, q));

    let finalBlob: Blob | null = null;

    if (format === "png") {
      finalBlob = await blobAt(1);
    } else {
      let lo = 0.1;
      let hi = 0.95;
      let best: Blob | null = await blobAt(hi);
      if (best && best.size <= targetBytes) {
        finalBlob = best;
      } else {
        for (let i = 0; i < 8; i++) {
          const mid = (lo + hi) / 2;
          const b = await blobAt(mid);
          if (!b) break;
          if (b.size <= targetBytes) {
            best = b;
            lo = mid;
          } else {
            hi = mid;
          }
        }
        const lowest = await blobAt(0.1);
        finalBlob = best && best.size <= targetBytes ? best : lowest;
      }
    }

    if (!finalBlob) {
      setWarn("Could not generate the image. Try a different file.");
      setWorking(false);
      return;
    }

    const finalKb = bytesToKb(finalBlob.size);
    if (format === "jpeg" && finalBlob.size > targetBytes) {
      setWarn(
        "Could not get below " +
          targetKb +
          "KB at these dimensions without heavy quality loss. The smallest version is shown. Try smaller dimensions for a smaller file."
      );
    }
    setOutUrl(URL.createObjectURL(finalBlob));
    setOutKb(finalKb);
    setOutW(targetW);
    setOutH(targetH);
    setWorking(false);
  }, [targetW, targetH, targetKb, format]);

  const download = () => {
    if (!outUrl) return;
    const a = document.createElement("a");
    a.href = outUrl;
    const base = (srcName || "image").replace(/\.[^.]+$/, "");
    a.download = `${base}-${targetW}x${targetH}-${outKb}kb.${format === "jpeg" ? "jpg" : "png"}`;
    a.click();
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 md:p-6">
      <div className="flex gap-2 mb-5">
        {(["photo", "signature"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors border-[1.5px] ${
              mode === m
                ? "bg-accent text-white border-accent"
                : "bg-card border-border text-text-secondary hover:border-accent/40"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <label
        className="block border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-accent/40 transition-colors mb-4"
        htmlFor="resizer-file"
      >
        <input
          id="resizer-file"
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
        {srcUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img src={srcUrl} alt="Selected" className="max-h-32 rounded-lg border border-border" />
            <div className="text-sm text-text-secondary">
              {srcName} · {srcKb}KB · tap to change
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="text-3xl">📷</span>
            <span className="text-base font-semibold text-text">Tap to choose or take a photo</span>
            <span className="text-xs text-text-muted">JPG or PNG · stays on your device</span>
          </div>
        )}
      </label>

      <div className="mb-4">
        <div className="text-xs font-semibold text-text-secondary mb-2">Quick presets</div>
        <div className="flex flex-col gap-1.5">
          {PRESETS[mode].map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={`text-left px-3.5 py-2.5 rounded-xl border-[1.5px] transition-colors ${
                targetW === p.w && targetH === p.h && targetKb === p.kb
                  ? "bg-accent-light border-accent"
                  : "bg-card border-border hover:border-accent/40"
              }`}
            >
              <div className="text-sm font-semibold text-text">{p.label}</div>
              <div className="text-xs text-text-muted">
                {p.w}×{p.h}px · {p.note}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div>
          <label className="text-xs text-text-muted block mb-1">Width (px)</label>
          <input
            type="number"
            value={targetW}
            onChange={(e) => setTargetW(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted block mb-1">Height (px)</label>
          <input
            type="number"
            value={targetH}
            onChange={(e) => setTargetH(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted block mb-1">Max size (KB)</label>
          <input
            type="number"
            value={targetKb}
            onChange={(e) => setTargetKb(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(["jpeg", "png"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium uppercase transition-colors border-[1.5px] ${
              format === f
                ? "bg-accent-light border-accent text-accent"
                : "bg-card border-border text-text-secondary hover:border-accent/40"
            }`}
          >
            {f === "jpeg" ? "JPG" : "PNG"}
          </button>
        ))}
        <span className="text-xs text-text-muted self-center ml-1">
          {format === "jpeg" ? "Best for photos, smaller files" : "Best for signatures, no compression"}
        </span>
      </div>

      <button
        onClick={resize}
        disabled={working || !srcUrl}
        className="w-full py-3 rounded-xl bg-accent text-white font-bold text-base disabled:opacity-50 transition-opacity"
      >
        {working ? "Resizing…" : "Resize image"}
      </button>

      {warn && (
        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
          {warn}
        </div>
      )}

      {outUrl && (
        <div className="mt-5 pt-5 border-t border-border">
          <div className="flex items-center gap-4">
            <img
              src={outUrl}
              alt="Resized result"
              className="max-h-32 rounded-lg border border-border"
            />
            <div className="flex-1">
              <div className="text-sm text-text-secondary mb-0.5">Done</div>
              <div className="text-lg font-bold text-text">
                {outW}×{outH}px · {outKb}KB
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {srcKb}KB → {outKb}KB
              </div>
            </div>
          </div>
          <button
            onClick={download}
            className="w-full mt-4 py-3 rounded-xl bg-accent text-white font-bold text-base"
          >
            Download
          </button>
        </div>
      )}

      <p className="mt-5 text-xs text-text-muted leading-relaxed text-center">
        Your image is processed entirely on your device. It is never uploaded to any server.
      </p>
    </div>
  );
}
