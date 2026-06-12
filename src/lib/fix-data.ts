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
  // 7. Aadhaar address wrong
  {
    correct: "bank",
    wrong: "aadhaar",
    mismatch: ["address"],
    fixDoc: "aadhaar",
    where: "myAadhaar portal online (address is the one field you can update online)",
    whereUrl: "https://myaadhaar.uidai.gov.in",
    proof: "A valid proof of address (utility bill, passport, bank statement or similar)",
    order: "Only the address can be changed online. Name, date of birth and gender need an Aadhaar Seva Kendra visit.",
    caveat: "Online document update is free until 14 June 2026. After that a fee applies (around \u20B925 to \u20B975 depending on service and channel). Confirm the current fee on myAadhaar.",
  },
  // 8. Aadhaar gender wrong
  {
    correct: "birth",
    wrong: "aadhaar",
    mismatch: ["gender"],
    fixDoc: "aadhaar",
    where: "Aadhaar Seva Kendra (gender cannot be changed online, a centre visit is required)",
    whereUrl: "https://myaadhaar.uidai.gov.in",
    proof: "Aadhaar plus a supporting identity document; carry originals to the centre",
    order: "Book a slot, then visit the centre. Gender, name and date of birth are not editable from home.",
    caveat: "If your registered mobile is not linked, add it at the centre first, or OTP-based steps will fail.",
  },
  // 9. Aadhaar vs bank name mismatch - DBT / scheme payment failing
  {
    correct: "aadhaar",
    wrong: "bank",
    mismatch: ["name"],
    fixDoc: "bank",
    where: "Your bank branch. Update KYC to match Aadhaar, then submit a fresh NPCI / Aadhaar seeding consent form for DBT",
    whereUrl: "https://base.npci.org.in",
    proof: "Aadhaar with the correct name and your bank passbook",
    order: "Aadhaar linking for KYC is not the same as NPCI seeding for payments. Fix the name first, then re-seed. Only one account can be active for DBT at a time.",
    caveat: "Even a small difference (initials vs full name, an extra surname) breaks the payment. Ask the branch to enable the NPCI / DBT flag and check status at base.npci.org.in.",
  },
  // 10. Ration card name wrong - state issued
  {
    correct: "aadhaar",
    wrong: "ration",
    mismatch: ["name", "dob", "address"],
    fixDoc: "ration",
    where: "Your state PDS / food portal or ration office, using the state correction form (for example Form 5 in West Bengal, Form 6-A in Gujarat)",
    proof: "Aadhaar with the correct details plus your existing ration card",
    order: "Ration cards are state issued, so the exact form and portal vary by state. Aadhaar is the mandatory proof everywhere.",
    caveat: "The name on the form must match your Aadhaar character for character. Blurry uploads and spelling gaps are the top rejection reasons. Confirm your state's current form at the state PDS portal or a CSC.",
  },
  // 11. Caste certificate name/details wrong - state issued
  {
    correct: "birth",
    wrong: "caste",
    mismatch: ["name", "dob"],
    fixDoc: "caste",
    where: "Your revenue authority (Tehsildar or SDM) or state portal such as MeeSeva, Nadakacheri or eMitra",
    proof: "Identity proof, supporting certificates and the existing caste certificate",
    order: "Caste certificates are issued by the state revenue department. Re-apply or file a correction so the certificate matches your other documents.",
    caveat: "Details must match your supporting documents, or verification is rejected. Confirm your state's exact route at the revenue office or a CSC.",
  },
  // 12. Income certificate value/name wrong - state issued
  {
    correct: "aadhaar",
    wrong: "income",
    mismatch: ["name", "dob"],
    fixDoc: "income",
    where: "Your revenue authority (Tehsildar or SDM) or state portal (MeeSeva, Nadakacheri, eMitra)",
    proof: "Income proof (salary slip, employer certificate or self-declaration) plus identity proof",
    order: "Income certificates are state issued and time limited. If details are wrong, re-apply with matching proof.",
    caveat: "Declared income must match your proof, or it is rejected. Confirm your state's current process at the revenue office or a CSC.",
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
  {
    slug: "aadhaar-bank-name-mismatch",
    h1: "Aadhaar and Bank Name Mismatch: Payment Failing",
    short: "\u{1F3E6} Scheme payment failing on bank name",
    title: "Aadhaar Bank Name Mismatch 2026: Fix DBT Payment",
    meta: "Scheme or DBT payment failing because your Aadhaar and bank names do not match? Fix the bank KYC, re-seed NPCI, and get the credit moving.",
    correct: "aadhaar",
    wrong: "bank",
    mismatch: "name",
    intro: "When your name on Aadhaar does not match your bank record, scheme payments like PM Kisan or Ladki Bahin fail. Match the name, then re-seed for DBT.",
    icon: "\u{1F3E6}",
    group: "id",
    popular: true,
  },
  {
    slug: "ration-card-name-correction",
    h1: "Ration Card Name Correction: State Process",
    short: "\u{1F35A} Wrong name on ration card",
    title: "Ration Card Name Correction 2026: State Process",
    meta: "Wrong or mismatched name on your ration card? The state correction form, the Aadhaar proof needed, and how to avoid the common rejections.",
    correct: "aadhaar",
    wrong: "ration",
    mismatch: "name",
    intro: "Ration cards are state issued, so the form varies. Aadhaar is the mandatory proof, and the name must match it exactly.",
    icon: "\u{1F35A}",
    group: "education",
  },
  {
    slug: "caste-certificate-name-mismatch",
    h1: "Caste Certificate Name Mismatch: How to Correct",
    short: "\u{1F4DC} Caste certificate details wrong",
    title: "Caste Certificate Name Mismatch 2026: Fix It",
    meta: "Caste certificate name or details not matching your other documents? The revenue office or state portal route, proof needed, and what gets rejected.",
    correct: "birth",
    wrong: "caste",
    mismatch: "name",
    intro: "Caste certificates are issued by the state revenue department. Re-apply or file a correction so it matches your other documents.",
    icon: "\u{1F4DC}",
    group: "education",
  },
  {
    slug: "income-certificate-mismatch",
    h1: "Income Certificate Mismatch: How to Correct",
    short: "\u{1F4B5} Income certificate wrong",
    title: "Income Certificate Mismatch 2026: How to Correct",
    meta: "Income certificate details wrong or rejected? Re-apply at the revenue office or state portal with matching proof. What is needed and why it fails.",
    correct: "aadhaar",
    wrong: "income",
    mismatch: "name",
    intro: "Income certificates are state issued and time limited. If the details are wrong, re-apply with proof that matches your declaration.",
    icon: "\u{1F4B5}",
    group: "education",
  },
  {
    slug: "aadhaar-address-change",
    h1: "Aadhaar Address Change: Online Process",
    short: "\u{1F4CD} Wrong address on Aadhaar",
    title: "Aadhaar Address Change 2026: Online Steps & Proof",
    meta: "Update your Aadhaar address online via myAadhaar. The proof accepted, the free-update window, and why only address can be changed from home.",
    correct: "bank",
    wrong: "aadhaar",
    mismatch: "address",
    intro: "Address is the one Aadhaar field you can change online. Upload a valid address proof and verify with OTP.",
    icon: "\u{1F4CD}",
    group: "id",
  },
  {
    slug: "aadhaar-gender-correction",
    h1: "Aadhaar Gender Correction: Process & Proof",
    short: "\u{2696} Gender wrong on Aadhaar",
    title: "Aadhaar Gender Correction 2026: Centre Process",
    meta: "Gender wrong on your Aadhaar and blocking KYC or a claim? Gender needs an Aadhaar Seva Kendra visit. The proof to carry and what to expect.",
    correct: "birth",
    wrong: "aadhaar",
    mismatch: "gender",
    intro: "Gender cannot be changed online. A short Aadhaar Seva Kendra visit with proof fixes it.",
    icon: "\u{2696}\uFE0F",
    group: "id",
  },
];
