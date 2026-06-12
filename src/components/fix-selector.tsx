"use client";

import { useState, useMemo } from "react";
import {
  DocId,
  DOC_LABELS,
  MismatchType,
  MISMATCH_LABELS,
  FIX_ROUTES,
  FixRoute,
} from "@/lib/fix-data";

// the docs a user can pick as correct/wrong (ordered, common first)
const DOC_CHOICES: DocId[] = [
  "aadhaar", "pan", "epf", "bank", "marksheet", "birth", "ration", "caste", "income", "upi",
];

function findRoute(
  correct: DocId | null,
  wrong: DocId | null,
  mismatch: MismatchType | null
): FixRoute | null {
  if (!correct || !wrong || !mismatch) return null;
  // exact match first
  let r = FIX_ROUTES.find(
    (x) => x.correct === correct && x.wrong === wrong && x.mismatch.includes(mismatch)
  );
  if (r) return r;
  // fallback: same wrong-doc + mismatch (correction target is the wrong doc regardless of which correct doc)
  r = FIX_ROUTES.find((x) => x.wrong === wrong && x.mismatch.includes(mismatch));
  return r || null;
}

export function FixSelector({
  initialCorrect,
  initialWrong,
  initialMismatch,
}: {
  initialCorrect?: DocId;
  initialWrong?: DocId;
  initialMismatch?: MismatchType;
}) {
  const [correct, setCorrect] = useState<DocId | null>(initialCorrect ?? null);
  const [wrong, setWrong] = useState<DocId | null>(initialWrong ?? null);
  const [mismatch, setMismatch] = useState<MismatchType | null>(initialMismatch ?? null);

  const route = useMemo(() => findRoute(correct, wrong, mismatch), [correct, wrong, mismatch]);

  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-colors cursor-pointer " +
        (active
          ? "bg-accent border-accent text-white"
          : "bg-card border-border text-text-secondary hover:border-accent/40")
      }
    >
      {children}
    </button>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-[0_8px_30px_rgba(14,36,24,0.10)]">
      <div className="text-[11.5px] font-extrabold text-accent uppercase tracking-[0.05em] mb-3.5">
        🔎 Find your exact fix
      </div>

      <div className="mb-3.5">
        <div className="text-[13px] font-bold text-text-secondary mb-2">
          1. Which document has the correct value?
        </div>
        <div className="flex flex-wrap gap-2">
          {DOC_CHOICES.map((d) => (
            <Pill key={d} active={correct === d} onClick={() => setCorrect(d)}>
              {DOC_LABELS[d]}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mb-3.5">
        <div className="text-[13px] font-bold text-text-secondary mb-2">
          2. Which document is wrong?
        </div>
        <div className="flex flex-wrap gap-2">
          {DOC_CHOICES.filter((d) => d !== correct).map((d) => (
            <Pill key={d} active={wrong === d} onClick={() => setWrong(d)}>
              {DOC_LABELS[d]}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-[13px] font-bold text-text-secondary mb-2">
          3. What does not match?
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MISMATCH_LABELS) as MismatchType[]).map((m) => (
            <Pill key={m} active={mismatch === m} onClick={() => setMismatch(m)}>
              {MISMATCH_LABELS[m]}
            </Pill>
          ))}
        </div>
      </div>

      {/* Answer */}
      {correct && wrong && mismatch && (
        <div className="mt-4">
          {route ? (
            <div className="bg-accent-light border-[1.5px] border-[#BBDCCB] rounded-2xl p-4">
              <h3 className="text-[14.5px] font-extrabold text-accent-dark mb-3 flex items-center gap-2">
                ✅ Your fix path
              </h3>
              <Row k="Fix this">
                Correct your <b>{DOC_LABELS[route.fixDoc]}</b>. {route.order}
              </Row>
              <Row k="Where">
                {route.where}
                {route.whereUrl && (
                  <>
                    {" "}
                    <a
                      href={route.whereUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent font-bold underline"
                    >
                      Open portal →
                    </a>
                  </>
                )}
              </Row>
              <Row k="Proof">{route.proof}</Row>
              {route.fee && <Row k="Fee">{route.fee}</Row>}
              {route.caveat && (
                <div className="bg-[#FBF3E0] border border-[#EDD79B] rounded-xl px-3.5 py-3 text-[12.5px] text-[#6F551A] mt-3 flex gap-2">
                  <span>⚠️</span>
                  <span>{route.caveat}</span>
                </div>
              )}
              {route.minorMajor && (
                <p className="text-[12.5px] text-text-muted mt-2.5 leading-relaxed">
                  {route.minorMajor}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-card-alt border border-border rounded-2xl p-4 text-[13.5px] text-text-secondary">
              We do not yet have a verified fix for this exact combination. As a safe rule:
              correct the wrong document at its issuing authority, match it character-for-character
              to your other documents, then refresh any linked bank or scheme KYC. Always confirm
              the current form at the official portal or your nearest CSC.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 py-2.5 border-b border-[#D2E6DA] last:border-0 text-[13.5px]">
      <span className="font-extrabold text-text-secondary min-w-[68px] shrink-0">{k}</span>
      <span className="text-text">{children}</span>
    </div>
  );
}
