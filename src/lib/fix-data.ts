// ============================================================
// Document Discrepancy Engine - source of truth
// Every fix path verified from official sources (see /about#methodology).
// Where a route varies by state, we name the AUTHORITY, never a fake national form.
// ============================================================

export type DocId =
  | "aadhaar"
  | "pan"
  | "bank"
  | "upi"
  | "epf"
  | "marksheet"
  | "birth"
  | "ration"
  | "caste"
  | "income";

export const DOC_LABELS: Record<DocId, string> = {
  aadhaar: "Aadhaar",
  pan: "PAN card",
  bank: "Bank account",
  upi: "UPI",
  epf: "EPF / UAN",
  marksheet: "10th marksheet / certificate",
  birth: "Birth certificate",
  ration: "Ration card",
  caste: "Caste certificate",
  income: "Income certificate",
};

export type MismatchType = "name" | "dob" | "address" | "gender";

export const MISMATCH_LABELS: Record<MismatchType, string> = {
  name: "Name / spelling",
  dob: "Date of birth",
  address: "Address",
  gender: "Gender",
};

// A single verified correction route.
export type FixRoute = {
  // which combo this answers
  correct: DocId; // the document the user says is RIGHT
  wrong: DocId; // the document that is WRONG and must change
  mismatch: MismatchType[];
  // the answer
  fixDoc: DocId; // the ONE document to actually correct
  where: string; // exact portal / authority
  whereUrl?: string; // official link if national + stable
  proof: string; // what proof to carry
  order?: string; // multi-step ordering note (anchor / downstream)
  minorMajor?: string; // affidavit/gazette note
  caveat?: string; // honest "confirm at X" where it varies
  fee?: string;
};

export const FIX_ROUTES: FixRoute[] = [
  // 1. Aadhaar wrong (name) - the anchor fix
  {
    correct: "pan",
    wrong: "aadhaar",
    mismatch: ["name"],
    fixDoc: "aadhaar",
    where: "myAadhaar portal (online, OTP) or Aadhaar Seva Kendra",
    whereUrl: "https://myaadhaar.uidai.gov.in",
    proof: "Valid proof of identity showing the correct name (PAN, passport, or certificate)",
    order: "Fix Aadhaar first. PAN, bank and EPF all check against Aadhaar, so correct it before anything downstream.",
    minorMajor: "Minor spelling fix needs no affidavit. A major name change may need an affidavit or gazette notification.",
    caveat: "Aadhaar name can be updated only twice in a lifetime. Make sure the new spelling matches your other documents.",
    fee: "₹50",
  },
  // 2. PAN wrong (name or DOB)
  {
    correct: "aadhaar",
    wrong: "pan",
    mismatch: ["name", "dob"],
    fixDoc: "pan",
    where: "Protean (NSDL) or UTIITSL - 'Changes or Correction in PAN' form",
    whereUrl: "https://www.protean-tinpan.com",
    proof: "Proof of identity, address and date of birth (from 1 April 2026 all three are required; Aadhaar alone may not be enough for DOB)",
    order: "Correct PAN to match your Aadhaar. The PAN number stays the same; a fresh card is issued.",
    minorMajor: "Supporting documents must show the exact corrected value.",
    caveat: "After PAN is corrected, refresh your bank KYC manually so the new name flows through.",
  },
  // 3. DOB mismatch Aadhaar vs EPF
  {
    correct: "birth",
    wrong: "epf",
    mismatch: ["dob"],
    fixDoc: "epf",
    where: "UAN Member Portal - 'Modify Basic Details'; if it needs employer sign-off, use the Joint Declaration",
    whereUrl: "https://unifiedportal-mem.epfindia.gov.in",
    proof: "A valid date-of-birth document (birth certificate, school leaving certificate or passport)",
    order: "Under EPFO 3.0, many corrections self-approve if Aadhaar is linked and matches. Otherwise a Joint Declaration with your employer is filed.",
    caveat: "Since 16 January 2024, Aadhaar is NOT accepted as proof of date of birth. Use a birth or school certificate instead.",
  },
  // 4. Aadhaar wrong (DOB)
  {
    correct: "birth",
    wrong: "aadhaar",
    mismatch: ["dob"],
    fixDoc: "aadhaar",
    where: "Aadhaar Seva Kendra (DOB change usually needs a centre visit)",
    whereUrl: "https://myaadhaar.uidai.gov.in",
    proof: "Birth certificate, passport, or school leaving certificate showing the correct date",
    order: "Fix Aadhaar first if it is the wrong one, then let PAN, bank and EPF re-sync.",
    fee: "₹50",
  },
  // 5. Name mismatch Aadhaar vs 10th marksheet (user chooses direction)
  {
    correct: "marksheet",
    wrong: "aadhaar",
    mismatch: ["name", "dob"],
    fixDoc: "aadhaar",
    where: "Aadhaar Seva Kendra with your marksheet as proof (or myAadhaar online if the change is minor)",
    whereUrl: "https://myaadhaar.uidai.gov.in",
    proof: "Original 10th marksheet / certificate",
    order: "Decide which is correct. Usually it is easier to fix Aadhaar to match the marksheet than to get a board certificate reissued.",
    minorMajor: "To instead correct the marksheet: apply at your school or education board office with a written application and ID proof.",
    fee: "₹50 (Aadhaar side)",
  },
  // 6. EPF claim rejected - name mismatch
  {
    correct: "aadhaar",
    wrong: "epf",
    mismatch: ["name", "gender"],
    fixDoc: "epf",
    where: "UAN Member Portal - 'Modify Basic Details'; Joint Declaration with employer if required",
    whereUrl: "https://unifiedportal-mem.epfindia.gov.in",
    proof: "Aadhaar with the correct name; employer attestation may be needed if the error came from onboarding",
    order: "If your name differs across PAN, Aadhaar, bank and EPF, the EPFO system auto-rejects the claim. Make EPF match Aadhaar.",
    caveat: "Under EPFO 3.0 many such fixes are self-approved when Aadhaar is linked.",
  },
];

// The 6 launch pages (combo -> page). Slug is the rankable URL under /fix/.
export type FixPage = {
  slug: string;
  h1: string;
  short: string; // short card title
  title: string; // <=60c
  meta: string; // <=160c
  // which route in FIX_ROUTES this page pre-selects
  correct: DocId;
  wrong: DocId;
  mismatch: MismatchType;
  intro: string;
  icon: string;
  group: "id" | "epf" | "education"; // for hub filtering
  popular?: boolean;
};

export const FIX_PAGES: FixPage[] = [
  {
    slug: "aadhaar-pan-name-mismatch",
    h1: "Aadhaar and PAN Name Mismatch: How to Fix",
    title: "Aadhaar PAN Name Mismatch 2026: How to Fix It",
    meta: "Aadhaar and PAN name not matching? The verified step-by-step fix, which document to correct first, proof needed, and the official portal.",
    correct: "aadhaar",
    wrong: "pan",
    mismatch: "name",
    intro: "When your Aadhaar and PAN names do not match, PAN linking and bank KYC can fail. Fix the one that is wrong, then let the rest re-sync.",
    icon: "🆔",
    group: "id",
    short: "🪪 Aadhaar / PAN name not matching",
    popular: true,
  },
  {
    slug: "aadhaar-name-correction",
    h1: "Aadhaar Name Correction: Online and Offline",
    title: "Aadhaar Name Correction 2026: Online Steps & Proof",
    meta: "Correct your Aadhaar name online or at a Seva Kendra. Proof needed, the ₹50 fee, the twice-in-a-lifetime limit, and how to avoid rejection.",
    correct: "pan",
    wrong: "aadhaar",
    mismatch: "name",
    intro: "If your Aadhaar name is wrong or misspelled, fix it first, because PAN, bank and EPF all check against Aadhaar.",
    icon: "✍️",
    group: "id",
    short: "✍️ Wrong name on Aadhaar",
  },
  {
    slug: "dob-mismatch-aadhaar-epf",
    h1: "Date of Birth Mismatch in Aadhaar and EPF",
    title: "DOB Mismatch Aadhaar & EPF 2026: How to Correct",
    meta: "EPF claim failing on a date-of-birth mismatch? The verified fix via the UAN portal, why Aadhaar is not valid DOB proof, and what is.",
    correct: "birth",
    wrong: "epf",
    mismatch: "dob",
    intro: "A date-of-birth mismatch between Aadhaar and EPF blocks claims. Note that Aadhaar is no longer accepted as DOB proof.",
    icon: "📅",
    group: "epf",
    short: "📅 Date of birth mismatch in EPF",
  },
  {
    slug: "name-mismatch-aadhaar-marksheet",
    h1: "Name Mismatch in Aadhaar and 10th Marksheet",
    title: "Aadhaar & 10th Marksheet Name Mismatch Fix 2026",
    meta: "Name or DOB different on your Aadhaar and 10th marksheet? Which one to correct, the proof needed, and the official route for each.",
    correct: "marksheet",
    wrong: "aadhaar",
    mismatch: "name",
    intro: "Recruitment and admissions reject applications when Aadhaar and the 10th marksheet do not match. Pick the correct one and fix the other.",
    icon: "🎓",
    group: "education",
    short: "🎓 Aadhaar vs 10th marksheet",
    popular: true,
  },
  {
    slug: "pan-correction-online",
    h1: "PAN Card Correction: Online Process",
    title: "PAN Card Correction 2026: NSDL/UTIITSL Steps",
    meta: "Correct your PAN name or date of birth via Protean (NSDL) or UTIITSL. Documents required from 1 April 2026, the form, and the fee.",
    correct: "aadhaar",
    wrong: "pan",
    mismatch: "name",
    intro: "Fix PAN details through Protean (NSDL) or UTIITSL. The PAN number stays the same and a corrected card is reissued.",
    icon: "🪪",
    group: "id",
    short: "🪪 Fix PAN card details",
  },
  {
    slug: "epf-claim-rejected-name-mismatch",
    h1: "EPF Claim Rejected for Name Mismatch",
    title: "EPF Claim Rejected: Name Mismatch Fix 2026",
    meta: "EPF claim rejected on a name mismatch? Make EPF match Aadhaar via the UAN portal, when a Joint Declaration is needed, and EPFO 3.0 self-approval.",
    correct: "aadhaar",
    wrong: "epf",
    mismatch: "name",
    intro: "If your name differs across Aadhaar, PAN, bank and EPF, the EPFO system auto-rejects withdrawals. Make EPF match Aadhaar.",
    icon: "💼",
    group: "epf",
    short: "💼 EPF claim rejected on name",
  },
];
