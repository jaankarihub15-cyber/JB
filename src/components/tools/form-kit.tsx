"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SectionHeading, FAQ, Card } from "@/components/ui";
import { JsonLd, faqSchema } from "@/components/json-ld";

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
    { id: "sign", title: "Signature scan", sub: "Sign in running hand on white paper with a black pen, then scan it. Capital-letter signatures are rejected.", specs: ["JPEG / JPG", "10–20 KB", "~4 cm wide"] },
    { id: "photo", title: "Be ready for the live photo", sub: "SSC now captures a live photo inside the form. No upload. Plain light background, no cap or spectacles, both ears visible, face filling the frame.", specs: ["Captured in-form", "Plain background", "Recent"] },
    { id: "tenth", title: "10th certificate", sub: "Your name and date of birth on the form must match this exactly. Mismatches are the top reason forms get rejected." },
    { id: "grad", title: "Graduation details", sub: "SSC CGL is a graduate-level exam. Keep your degree and final marksheet handy for the qualification details." },
    { id: "cat", title: "Category certificate (if applicable)", sub: "SC, ST, OBC or EWS certificate in the central-government format, recently issued. Confirm the exact format in the notice." },
    { id: "id", title: "Photo ID proof", sub: "A valid government ID such as Aadhaar, PAN, Voter ID, Passport or Driving Licence." },
    { id: "fee", title: "Application fee ready", sub: "Fee is online via UPI, net banking or card. Free for SC, ST, PwD, ex-servicemen and all women candidates.", specs: ["₹100 (Gen / OBC)"] },
    { id: "contact", title: "Active email & mobile", sub: "Needed for the One-Time Registration (OTR) and for every admit-card and exam alert." },
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

const APPSC: ExamConfig = {
  id: "appsc",
  name: "APPSC",
  checklist: [
    { id: "otpr", title: "Complete your OTPR first", sub: "APPSC needs a One Time Profile Registration on the AP PSC portal before you can apply. You get an OTPR ID you reuse for every APPSC notification.", specs: ["psc.ap.gov.in"] },
    { id: "photo", title: "Photo with your name and date printed on it", sub: "APPSC photos must have your name and the date the photo was taken printed on the image itself. No cap or goggles, spectacles allowed, no polaroid.", specs: ["50 KB", "3.5×4.5 cm", "JPG/JPEG"] },
    { id: "sign", title: "Signature scan", sub: "Sign with a black pen on white paper and scan it. It is uploaded separately from the photo.", specs: ["30 KB", "3.5×1.5 cm", "JPG/JPEG"] },
    { id: "ssc", title: "SSC / 10th certificate", sub: "Your name and date of birth on the form must match your SSC (10th) certificate or birth certificate exactly." },
    { id: "qual", title: "Qualification certificates", sub: "Degree and marksheets for the group you are applying to. Group 1 and 2 need a degree, Group 4 needs intermediate." },
    { id: "local", title: "Local status & white card (AP)", sub: "Your local or non-local AP status affects fee and reservation. A white ration card gives an exam-fee exemption for AP residents." },
    { id: "cat", title: "Category certificate (if applicable)", sub: "SC, ST, BC, PwD or Ex-Servicemen certificate to claim fee exemption and reservation." },
    { id: "fee", title: "Application fee ready", sub: "Processing fee for all candidates, plus an exam fee. SC, ST, BC, PwD and Ex-Servicemen, AP white-card holders and unemployed AP youth are exempt from the exam fee.", specs: ["₹250 + ~₹80"] },
  ],
  reject: [
    "Name or date of birth not matching the SSC (10th) certificate",
    "Photo without your name and the date printed on it",
    "Signature or photo in the wrong size or dimensions",
    "Wrong local or non-local status, or a fee exemption you cannot prove",
  ],
};

const EXAMS: Record<string, ExamConfig> = { "ssc-cgl": SSC, appsc: APPSC, general: GENERAL };

/* ---- exam-specific guide + FAQ content (switches with the selected exam) ---- */
type GuideSection = { icon: string; heading: string; paras: string[] };
type Faq = { question: string; answer: string };

const GUIDE: Record<string, GuideSection[]> = {
  "ssc-cgl": [
    {
      icon: "📄",
      heading: "Documents required for the SSC CGL form",
      paras: [
        "Most of the panic around the SSC CGL form comes from scrambling for the same details every time. Keep these ready before you open the form and the whole thing takes minutes.",
        "You need your 10th certificate for your name and date of birth, your graduation degree and marksheet, and a valid photo ID such as Aadhaar, PAN, Voter ID, Passport or Driving Licence. If you belong to SC, ST, OBC or EWS, keep that category certificate ready in the central-government format.",
        "During the form you upload a scanned signature and capture a live photo. You also confirm an active mobile number and email during the One-Time Registration, so the admit card and alerts reach you.",
      ],
    },
    {
      icon: "📷",
      heading: "SSC CGL photo and signature size",
      paras: [
        "In the current cycle SSC does not ask for a passport photo upload. The photo is captured live inside the application using your webcam or phone, so there is nothing to resize for the photo.",
        "For the live photo, use a plain light background, remove any cap or spectacles, keep both ears visible, and let your face fill the frame. Old or pre-existing photos are rejected on the spot.",
        "You do upload a scanned signature. It must be JPEG or JPG, between 10 KB and 20 KB, signed in running hand with a black pen on white paper. A signature in block capitals or one that is blurred will be rejected. Confirm every size against the official notification before you submit.",
      ],
    },
    {
      icon: "🧭",
      heading: "How the SSC CGL form works",
      paras: [
        "First you complete a One-Time Registration on the official SSC portal with your basic details. This gives you a registration number and password you reuse for every SSC exam.",
        "Then you log in, fill the application with your education and post preferences, capture the live photo, upload the signature, and pay the fee online if you are not exempt. The fee is around 100 rupees for General and OBC, and free for SC, ST, PwD, ex-servicemen and all women.",
        "Preview everything before final submission, because uploads usually cannot be changed afterwards. There is a short correction window, but it is safer to get it right the first time.",
      ],
    },
  ],
  appsc: [
    {
      icon: "📄",
      heading: "Documents required for the APPSC form",
      paras: [
        "APPSC works through a One Time Profile Registration, so most of the panic comes from getting your OTPR and uploads right. Keep these ready before you start.",
        "You need your SSC or 10th certificate for your name and date of birth, the qualification marksheets for your group, and a category certificate if you belong to SC, ST, BC, PwD or Ex-Servicemen. AP residents should keep their white ration card handy for the fee exemption.",
        "You confirm your mobile and email during OTPR through one-time codes, so the registration is accepted. Note your OTPR reference ID, since you reuse it for every APPSC notification.",
      ],
    },
    {
      icon: "📷",
      heading: "APPSC photo and signature size",
      paras: [
        "APPSC has one unusual rule that catches many applicants. Your photograph must have your name and the date the photo was taken printed on the image itself.",
        "The photo must be 50 KB and 3.5 by 4.5 cm, in JPG or JPEG, in colour or clear black and white. No cap or goggles, though spectacles are allowed, and polaroid photos are not accepted.",
        "The signature is uploaded separately at 30 KB and 3.5 by 1.5 cm, in JPG or JPEG, signed with a black pen on white paper. Use our resizer to hit the exact sizes, then add the name and date to the photo before uploading.",
      ],
    },
    {
      icon: "🧭",
      heading: "How the APPSC form works",
      paras: [
        "First you complete the One Time Profile Registration on the APPSC portal and confirm it with the codes sent to your mobile and email. This gives you an OTPR ID and password.",
        "Then for each notification you log in, fill the application with your qualification, local status and exam centre, and pay the fee online. The processing fee is 250 rupees for everyone, with an exam fee that many AP categories are exempt from.",
        "Check every detail before submitting, because corrections later cost 100 rupees each, and changes to name, fee and age relaxation are not allowed at all.",
      ],
    },
  ],
  general: [
    {
      icon: "📄",
      heading: "Documents most government forms need",
      paras: [
        "Almost every government exam form asks for the same core set of documents. Get them ready once and you can fill any form quickly instead of hunting for details each time.",
        "You need your 10th and 12th certificates for your name, date of birth and qualification, plus your graduation degree and marksheet if the post needs a degree. Keep a valid photo ID such as Aadhaar, PAN, Voter ID, Passport or Driving Licence.",
        "If you belong to SC, ST, OBC or EWS, keep that category certificate ready in the format the exam asks for. An expired or wrong-format certificate is a common reason forms get rejected.",
      ],
    },
    {
      icon: "📷",
      heading: "Photo and signature size for online forms",
      paras: [
        "Most forms ask for a recent passport-style photo and a scanned signature, each within a strict file size. Some newer forms capture the photo live instead of an upload, so check your notice.",
        "A common photo size is 20 KB to 50 KB and a signature 10 KB to 20 KB, usually in JPEG. The exact limits are printed in the notification, so always confirm there before you upload.",
        "Sign in running hand with a black pen on white paper, never in block capitals. Use our photo and signature resizer to hit the exact size without losing clarity.",
      ],
    },
    {
      icon: "🧭",
      heading: "How online exam forms work",
      paras: [
        "Most exam bodies now use a one-time registration. You register once with your basic details and reuse that login for every form from that body.",
        "Then you log in, fill your education and post preferences, upload or capture your photo and signature, and pay the fee online if you are not exempt.",
        "Preview everything before final submission, since uploads usually cannot be changed later. Many forms allow only a short correction window.",
      ],
    },
  ],
};

const FAQS: Record<string, Faq[]> = {
  "ssc-cgl": [
    { question: "What documents are required to fill the SSC CGL form?", answer: "Before you start, keep ready your 10th certificate (for name and date of birth), your graduation details, a valid photo ID such as Aadhaar or PAN, and your category certificate if you belong to SC, ST, OBC or EWS. During the form you upload a scanned signature, while the photo is captured live. You also need an active email and mobile number for the One-Time Registration." },
    { question: "What is the photo and signature size for SSC CGL?", answer: "In the current cycle SSC captures your photo live inside the form using your webcam or phone, so there is no passport photo to upload. You only upload a scanned signature in JPEG or JPG format, between 10 KB and 20 KB, signed in running hand with a black pen on white paper. Signatures in block capitals are rejected. Always confirm the exact sizes in the official notification." },
    { question: "What is the SSC CGL application fee?", answer: "The fee is around 100 rupees for General and OBC candidates, paid online through UPI, net banking or card. SC, ST, PwD, ex-servicemen and all women candidates are exempt from the fee. The exact amount is stated in the notification for that cycle." },
    { question: "Is there a passport photo to upload for SSC CGL?", answer: "No, not in the current cycle. SSC moved to a live photo that you capture during the application using a webcam or mobile camera. Use a plain light background, remove any cap or spectacles, keep both ears visible and your face filling the frame. Old or pre-existing photos are rejected." },
    { question: "Does this tool store my details anywhere?", answer: "No. Everything you type is saved only inside your own browser on your device. Nothing is uploaded to any server and we cannot see it. For your safety the tool also never asks for your Aadhaar number, bank details or passwords." },
    { question: "Can I use this for exams other than SSC CGL?", answer: "Yes. Your saved details work for any form. Tap the General details option to see a checklist of documents that most government forms ask for. We are adding exam-specific checklists for more exams over time." },
    { question: "What happens to my details if I clear my browser?", answer: "Because the data lives only in your browser, clearing your browser or switching phones will remove it. To stay safe, tap Save a backup file once. That downloads a small file you can later restore using the Restore button to bring all your details back." },
    { question: "Why must my name match my 10th certificate exactly?", answer: "A mismatch between the name or date of birth on your form and on your 10th certificate is the single most common reason applications and candidatures get rejected. Enter your name and date of birth exactly as printed on the 10th certificate, including spelling and order, everywhere on the form." },
  ],
  appsc: [
    { question: "What documents are required for the APPSC form?", answer: "Keep ready your SSC or 10th certificate (for name and date of birth), your qualification marksheets, and a category certificate if you belong to SC, ST, BC, PwD or Ex-Servicemen. AP residents should keep a white ration card for the fee exemption. You also need a photo and signature in the exact APPSC sizes and an active mobile and email for the OTPR." },
    { question: "What is the photo and signature size for APPSC?", answer: "The photo must be 50 KB and 3.5 by 4.5 cm, in JPG or JPEG, with your name and the date the photo was taken printed on it. The signature must be 30 KB and 3.5 by 1.5 cm, in JPG or JPEG, signed with a black pen on white paper. Confirm the exact rules in the notification." },
    { question: "What is the APPSC application fee?", answer: "There is a processing fee of 250 rupees for all candidates, plus an examination fee that is usually around 80 rupees but varies by post. SC, ST, BC, PwD and Ex-Servicemen candidates, AP white ration card holders and unemployed AP youth are exempt from the examination fee but still pay the 250 rupees processing fee." },
    { question: "What is OTPR in APPSC?", answer: "OTPR is the One Time Profile Registration on the APPSC portal. You register once with your basic details, confirm it through codes sent to your mobile and email, and get an OTPR ID. You reuse that ID to apply for every APPSC notification, so you do not enter your basic details again each time." },
    { question: "Does this tool store my details anywhere?", answer: "No. Everything you type is saved only inside your own browser on your device. Nothing is uploaded to any server and we cannot see it. The tool also never asks for your Aadhaar number, bank details or passwords." },
    { question: "Can I edit my APPSC application after submitting?", answer: "APPSC allows corrections after submission, but each correction costs 100 rupees. Changes to your name, fee and age relaxation are not allowed at all, so check those carefully before you submit." },
  ],
  general: [
    { question: "What documents do I need to fill a government exam form?", answer: "Keep your 10th and 12th certificates ready for your name, date of birth and qualification, plus your graduation degree if the post needs it. Have a valid photo ID such as Aadhaar, PAN, Voter ID, Passport or Driving Licence, and your category certificate if you belong to SC, ST, OBC or EWS. You also need a scanned signature, a photo, and an active email and mobile." },
    { question: "What is the usual photo and signature size for online forms?", answer: "A common requirement is a photo between 20 KB and 50 KB and a signature between 10 KB and 20 KB, usually in JPEG. Some newer forms capture the photo live instead of an upload. The exact limits differ by exam, so always confirm them in the official notification before uploading." },
    { question: "Does this tool store my details anywhere?", answer: "No. Everything you type is saved only inside your own browser on your device. Nothing is uploaded to any server and we cannot see it. For your safety the tool also never asks for your Aadhaar number, bank details or passwords." },
    { question: "Can I use my saved details for any exam?", answer: "Yes. Your details are saved once and work for any form you fill. Use the General details option for a checklist that fits most government forms, and switch to a specific exam when we have added it." },
    { question: "What happens to my details if I clear my browser?", answer: "Because the data lives only in your browser, clearing your browser or switching phones will remove it. Tap Save a backup file once to download a small file, then use Restore later to bring all your details back." },
    { question: "Why must my name match my 10th certificate exactly?", answer: "A mismatch between the name or date of birth on your form and on your 10th certificate is the single most common reason applications get rejected. Enter them exactly as printed on the 10th certificate, including spelling and order, on every form." },
  ],
};

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

  useEffect(() => {
    setMounted(true);
    try {
      const q = new URLSearchParams(window.location.search).get("exam");
      if (q === "general" || q === "ssc-cgl" || q === "appsc") setExam(q);
    } catch {
      /* ignore */
    }
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
  const toggleCheck = (id: string) => persistChecks({ ...checks, [exam]: { ...examChecks, [id]: !examChecks[id] } });

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
    <>
      <JsonLd data={faqSchema(FAQS[exam])} />

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
          <button
            onClick={() => setExam("appsc")}
            className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${exam === "appsc" ? "bg-accent text-white border-accent" : "bg-white text-text-muted border-border hover:border-accent/40"}`}
          >
            APPSC
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
                {exam === "general" ? "📋 Documents most forms need" : `✅ ${cfg.name}: what to keep ready`}
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
                <p className="text-[12.5px] opacity-85 mb-3">Hit the exact KB and dimensions your form needs, without losing clarity.</p>
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

        {/* exam-specific guide (switches with the selected exam) */}
        <div className="mt-6">
          {GUIDE[exam].map((s) => (
            <div key={s.heading}>
              <SectionHeading icon={s.icon}>{s.heading}</SectionHeading>
              <div className="card p-5 text-text-secondary text-sm leading-relaxed space-y-3">
                {s.paras.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          ))}

          <div className="mt-8" id="faqs">
            <SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>
            <Card>
              {FAQS[exam].map((f) => <FAQ key={f.question} question={f.question} answer={f.answer} />)}
            </Card>
          </div>

          <p className="mt-6 text-xs text-text-muted leading-relaxed text-center">
            This kit helps you prepare your own details. Always follow the instructions on the official notification, which take precedence over anything shown here.
          </p>
        </div>
      </div>

      {/* printable sheet (only on print) */}
      <PrintSheet data={data} />

      {toast && (
        <div className="fixed left-1/2 bottom-7 -translate-x-1/2 bg-text text-white text-sm font-semibold px-5 py-2.5 rounded-full z-50 shadow-lg">{toast}</div>
      )}
    </>
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
