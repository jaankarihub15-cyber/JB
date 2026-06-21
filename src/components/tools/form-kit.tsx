"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ---------------------------------------------------------------------------
   Sarkari Form Kit - client-side only.
   All personal data lives in the user's browser (localStorage). Nothing is
   ever sent to a server. We deliberately do NOT collect Aadhaar number, bank
   details or passwords.
--------------------------------------------------------------------------- */

type FieldDef = { key: string; label: string; hint?: string; star?: boolean; type?: string; options?: string[] };
type Group = { title: string; fields: FieldDef[] };

const GROUPS: Group[] = [
  {
    title: "Identity",
    fields: [
      { key: "full_name", label: "Full name", hint: "exactly as printed on your 10th certificate", star: true },
      { key: "father_name", label: "Father's name" },
      { key: "mother_name", label: "Mother's name" },
      { key: "dob", label: "Date of birth", type: "date" },
      { key: "gender", label: "Gender", type: "select", options: ["", "Male", "Female", "Transgender"] },
    ],
  },
  {
    title: "Academics",
    fields: [
      { key: "tenth_board", label: "10th board & passing year", hint: "e.g. CBSE, 2014" },
      { key: "tenth_roll", label: "10th roll number" },
      { key: "tenth_marks", label: "10th marks / %" },
      { key: "twelfth_board", label: "12th board & passing year", hint: "e.g. CBSE, 2016" },
      { key: "grad_degree", label: "Graduation degree & year", hint: "e.g. B.Com, 2020" },
      { key: "grad_marks", label: "Graduation marks / CGPA" },
    ],
  },
  {
    title: "Category",
    fields: [
      { key: "category", label: "Category", type: "select", options: ["", "General", "OBC", "SC", "ST", "EWS"] },
      { key: "cat_cert_no", label: "Category certificate number" },
      { key: "cat_cert_date", label: "Certificate issue date", type: "date" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "mobile", label: "Mobile number" },
      { key: "email", label: "Email ID" },
    ],
  },
];

const ALL_KEYS = GROUPS.flatMap((g) => g.fields.map((f) => f.key));

type CheckItem = { id: string; title: string; sub: string; specs?: string[] };
type ExamConfig = { id: string; name: string; checklist: CheckItem[]; reject: string[] };

const SSC: ExamConfig = {
  id: "ssc-cgl",
  name: "SSC CGL",
  checklist: [
    {
      id: "sign",
      title: "Signature scan",
      sub: "Sign in running hand on white paper with a black pen, then scan it. Capital-letter signatures are rejected.",
      specs: ["JPEG / JPG", "10–20 KB", "~4 cm wide"],
    },
    {
      id: "photo",
      title: "Be ready for the live photo",
      sub: "SSC now captures a live photo inside the form. No upload. Plain light background, no cap or spectacles, both ears visible, face filling the frame.",
      specs: ["Captured in-form", "Plain background", "Recent"],
    },
    {
      id: "tenth",
      title: "10th certificate",
      sub: "Your name and date of birth on the form must match this exactly. Mismatches are the top reason forms get rejected.",
    },
    {
      id: "grad",
      title: "Graduation details",
      sub: "SSC CGL is a graduate-level exam. Keep your degree and final marksheet handy for the qualification details.",
    },
    {
      id: "cat",
      title: "Category certificate (if applicable)",
      sub: "SC, ST, OBC or EWS certificate in the central-government format, recently issued. Confirm the exact format in the notice.",
    },
    {
      id: "id",
      title: "Photo ID proof",
      sub: "A valid government ID such as Aadhaar, PAN, Voter ID, Passport or Driving Licence.",
    },
    {
      id: "fee",
      title: "Application fee ready",
      sub: "Fee is online via UPI, net banking or card. Free for SC, ST, PwD, ex-servicemen and all women candidates.",
      specs: ["₹100 (Gen / OBC)"],
    },
    {
      id: "contact",
      title: "Active email & mobile",
      sub: "Needed for the One-Time Registration (OTR) and for every admit-card and exam alert.",
    },
  ],
  reject: [
    "Name or date of birth not matching the 10th certificate",
    "Live photo with a cap, spectacles or a busy background",
    "Signature in block capitals, blurred, or too small",
    "Category certificate in the wrong format or expired",
  ],
};

const GENERAL: ExamConfig = {
  id: "general",
  name: "your exam",
  checklist: [
    { id: "photo", title: "Passport / live photo", sub: "A recent colour photo on a plain light background. Check your exam's notice for the exact size, KB and whether it is a live capture.", specs: ["Check the notice"] },
    { id: "sign", title: "Signature scan", sub: "Sign in running hand on white paper with a black pen. Check the notice for the size and format.", specs: ["Check the notice"] },
    { id: "tenth", title: "10th & 12th certificates", sub: "For your name, date of birth and qualification proof. The form name must match these exactly." },
    { id: "grad", title: "Graduation / latest qualification", sub: "Degree or marksheet, if the post you want needs it." },
    { id: "cat", title: "Category certificate (if applicable)", sub: "In the format your exam asks for, recently issued." },
    { id: "id", title: "Photo ID & fee", sub: "A valid government ID and the application fee ready before you start." },
    { id: "contact", title: "Active email & mobile", sub: "For registration and all exam alerts." },
  ],
  reject: [
    "Name or date of birth not matching your 10th certificate",
    "Photo or signature in the wrong size or format",
    "Category certificate expired or in the wrong format",
  ],
};

const EXAMS: Record<string, ExamConfig> = { "ssc-cgl": SSC, general: GENERAL };
const DATA_KEY = "kk_formkit_data_v1";
const CHECK_KEY = "kk_formkit_checks_v1";

export function FormKit() {
  const [mounted, setMounted] = useState(false);
  const [exam, setExam] = useState<string>("ssc-cgl");
  const [data, setData] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setMounted(true);
    try {
      const d = localStorage.getItem(DATA_KEY);
      if (d) setData(JSON.parse(d));
      const c = localStorage.getItem(CHECK_KEY);
      if (c) setChecks(JSON.parse(c));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persistData = useCallback((next: Record<string, string>) => {
    setData(next);
    try { localStorage.setItem(DATA_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const persistChecks = useCallback((next: Record<string, Record<string, boolean>>) => {
    setChecks(next);
    try { localStorage.setItem(CHECK_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const showToast = useCallback((m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1600);
  }, []);

  const setField = (k: string, v: string) => persistData({ ...data, [k]: v });

  const copy = (k: string) => {
    const v = (data[k] || "").trim();
    if (!v) return;
    navigator.clipboard?.writeText(v).then(() => showToast("Copied")).catch(() => showToast("Copy failed"));
  };

  const cfg = EXAMS[exam];
  const examChecks = checks[exam] || {};
  const toggleCheck = (id: string) => {
    const next = { ...checks, [exam]: { ...examChecks, [id]: !examChecks[id] } };
    persistChecks(next);
  };

  const filledCount = ALL_KEYS.filter((k) => (data[k] || "").trim() !== "").length;
  const readyCount = cfg.checklist.filter((c) => examChecks[c.id]).length;

  const clearAll = () => {
    if (!confirm("Clear all the details you saved on this device? This cannot be undone.")) return;
    persistData({});
    persistChecks({});
    showToast("All data cleared");
  };

  const exportBackup = () => {
    try {
      const blob = new Blob([JSON.stringify({ data, checks, savedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-form-kit-backup.json";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Backup downloaded");
    } catch { showToast("Could not create backup"); }
  };

  const importBackup = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result));
        if (parsed.data) persistData(parsed.data);
        if (parsed.checks) persistChecks(parsed.checks);
        showToast("Backup restored");
      } catch { showToast("That file could not be read"); }
    };
    r.readAsText(file);
  };

  if (!mounted) {
    return <div className="card p-6 text-sm text-text-muted">Loading your form kit…</div>;
  }

  return (
    <div className="print:hidden">
      {/* exam picker */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setExam("general")}
          className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${exam === "general" ? "bg-accent text-white border-accent" : "bg-white text-text-muted border-border hover:border-accent/40"}`}
        >
          General details
        </button>
        <button
          onClick={() => setExam("ssc-cgl")}
          className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${exam === "ssc-cgl" ? "bg-accent text-white border-accent" : "bg-white text-text-muted border-border hover:border-accent/40"}`}
        >
          SSC CGL
        </button>
        {["RRB NTPC", "IBPS", "RPSC RAS"].map((e) => (
          <span key={e} className="text-sm font-bold px-4 py-2 rounded-full border border-border bg-white text-text-muted/60 cursor-not-allowed select-none">
            {e} · soon
          </span>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* LOCKER */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-extrabold flex items-center gap-2">🗄️ Your details</h2>
            <span className="text-xs font-bold text-accent-dark bg-accent-light px-2.5 py-1 rounded-full whitespace-nowrap">{filledCount} of {ALL_KEYS.length} saved</span>
          </div>
          <div className="p-5 space-y-5">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <div className="text-[11px] font-extrabold tracking-wider uppercase text-text-muted mb-2.5">{g.title}</div>
                <div className="space-y-3">
                  {g.fields.map((f) => {
                    const v = data[f.key] || "";
                    const wrap = f.star ? "border-[1.5px] border-accent bg-accent-light rounded-xl p-2.5" : "";
                    return (
                      <div key={f.key} className={wrap}>
                        <label className={`block text-[13px] font-semibold mb-1.5 ${f.star ? "text-accent-dark" : "text-text"}`}>
                          {f.label}
                          {f.hint && <span className="font-medium text-text-muted text-[11.5px]"> ({f.hint})</span>}
                        </label>
                        <div className="flex gap-2">
                          {f.type === "select" ? (
                            <select
                              value={v}
                              onChange={(e) => setField(f.key, e.target.value)}
                              className="flex-1 min-w-0 text-sm bg-card-alt border border-border rounded-xl px-3 py-2.5 outline-none focus:border-accent"
                            >
                              {(f.options || []).map((o) => <option key={o} value={o}>{o || "Select"}</option>)}
                            </select>
                          ) : (
                            <input
                              value={v}
                              type={f.type || "text"}
                              onChange={(e) => setField(f.key, e.target.value)}
                              placeholder={f.hint ? "" : f.label}
                              className="flex-1 min-w-0 text-sm bg-card-alt border border-border rounded-xl px-3 py-2.5 outline-none focus:border-accent"
                            />
                          )}
                          <button
                            onClick={() => copy(f.key)}
                            disabled={!v.trim()}
                            className="shrink-0 text-xs font-bold px-3.5 rounded-xl border border-border bg-white text-accent-dark hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="text-xs text-text-muted bg-card-alt border border-dashed border-border rounded-xl p-3">
              For your safety, this tool never asks for your Aadhaar number, bank details or passwords. Keep those only on the official form.
            </div>
          </div>
        </div>

        {/* CHECKLIST */}
        <div className="card overflow-hidden self-start">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-extrabold flex items-center gap-2">
              {exam === "ssc-cgl" ? "✅ SSC CGL: what to keep ready" : "📋 Documents most forms need"}
            </h2>
            <span className="text-xs font-bold text-accent-dark bg-accent-light px-2.5 py-1 rounded-full whitespace-nowrap">{readyCount} of {cfg.checklist.length} ready</span>
          </div>
          <div className="px-5 py-2">
            {cfg.checklist.map((c) => {
              const done = !!examChecks[c.id];
              return (
                <button key={c.id} onClick={() => toggleCheck(c.id)} className="w-full flex gap-3 py-3 border-b border-border last:border-0 text-left items-start">
                  <span className={`shrink-0 w-[22px] h-[22px] rounded-[7px] border-2 grid place-items-center mt-0.5 text-white text-[13px] font-extrabold ${done ? "bg-accent border-accent" : "border-border"}`}>{done ? "✓" : ""}</span>
                  <span>
                    <span className={`block text-[13.5px] font-bold ${done ? "text-text-muted line-through" : "text-text"}`}>{c.title}</span>
                    <span className="block text-[12.5px] text-text-muted font-medium mt-0.5">
                      {c.specs?.map((s) => (
                        <span key={s} className="inline-block text-[11.5px] font-bold text-accent-dark bg-accent-light px-2 py-0.5 rounded-md mr-1.5 mt-1">{s}</span>
                      ))}
                      {c.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* photo tool tie-in */}
          <div className="p-5 border-t border-border">
            <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(180deg,#1B6B4A,#0F3D2A)" }}>
              <h3 className="text-base font-extrabold mb-1">📷 Make your photo &amp; signature the right size</h3>
              <p className="text-[12.5px] opacity-85 mb-3">Hit the exact KB your form needs. The signature for SSC is 10–20 KB.</p>
              <a href="/tools/photo-resizer" className="inline-flex items-center gap-2 bg-white text-accent-dark font-bold text-[13px] px-4 py-2 rounded-full">Open the resizer tool →</a>
            </div>

            <div className="mt-4 rounded-2xl p-4 bg-orange-light border border-orange/20">
              <h3 className="text-[13px] font-extrabold text-orange flex items-center gap-2 mb-2">⚠️ Common reasons forms get rejected</h3>
              <ul className="list-disc ml-5 space-y-1">
                {cfg.reject.map((r) => <li key={r} className="text-[12.5px] text-orange/90">{r}</li>)}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => window.print()} className="font-bold text-[13px] rounded-xl px-4 py-2.5 bg-accent text-white border border-accent">🖨️ Print my data sheet</button>
              <button onClick={exportBackup} className="font-bold text-[13px] rounded-xl px-4 py-2.5 bg-white border border-border text-text">⬇️ Save a backup file</button>
              <button onClick={() => fileRef.current?.click()} className="font-bold text-[13px] rounded-xl px-4 py-2.5 bg-white border border-border text-text">⬆️ Restore</button>
              <button onClick={clearAll} className="font-bold text-[13px] rounded-xl px-4 py-2.5 bg-white border border-border text-text-muted">Clear all</button>
              <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importBackup(f); e.target.value = ""; }} />
            </div>
            <p className="text-[11.5px] text-text-muted mt-2.5 leading-relaxed">
              Your details are saved only in this browser. If you clear your browser or switch phones, they are gone. Download a backup file once, and you can restore everything anytime by importing it. Keep that file private, it is plain text.
            </p>
          </div>
        </div>
      </div>

      {/* safety strip */}
      <div className="mt-4 rounded-2xl p-4 bg-orange-light border border-orange/20 flex gap-3 items-start">
        <span className="text-xl leading-none">🛟</span>
        <p className="text-[13px] text-orange/90">
          <b className="text-orange">Filling at a cyber café or shared computer?</b> Don&apos;t save your details there. Use Print or Save a backup instead, and tap <b className="text-orange">Clear all</b> before you leave.
        </p>
      </div>

      {/* printable sheet (only on print) */}
      <PrintSheet data={data} />

      {toast && (
        <div className="fixed left-1/2 bottom-7 -translate-x-1/2 bg-text text-white text-sm font-semibold px-5 py-2.5 rounded-full z-50 shadow-lg">{toast}</div>
      )}
    </div>
  );
}

function PrintSheet({ data }: { data: Record<string, string> }) {
  return (
    <div className="hidden print:block">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>My Exam Form Details</h1>
      <p style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Keep this beside you while filling the official form. KnowledgeKendra Form Kit.</p>
      {GROUPS.map((g) => (
        <div key={g.title} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#1B6B4A", marginBottom: 6 }}>{g.title}</div>
          {g.fields.map((f) => (
            <div key={f.key} style={{ display: "flex", borderBottom: "1px solid #eee", padding: "5px 0", fontSize: 13 }}>
              <span style={{ width: 200, color: "#555" }}>{f.label}</span>
              <span style={{ fontWeight: 700 }}>{data[f.key] || "-"}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
