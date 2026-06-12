import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbSchema, faqSchema, howToSchema } from "@/components/json-ld";
import { FixSelector } from "@/components/fix-selector";
import { FIX_PAGES } from "@/lib/fix-data";

export function generateStaticParams() {
  return FIX_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = FIX_PAGES.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.meta,
    alternates: { canonical: `https://knowledgekendra.com/fix/${slug}` },
    openGraph: { title: p.title, description: p.meta, type: "article" },
  };
}

export default async function FixComboPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = FIX_PAGES.find((x) => x.slug === slug);
  if (!p) notFound();

  const faqs = COMMON_FAQS[p.slug] ?? [];

  return (
    <div className="theme-v2 py-0">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://knowledgekendra.com" },
          { name: "Fix", url: "https://knowledgekendra.com/fix" },
          { name: p.h1, url: `https://knowledgekendra.com/fix/${slug}` },
        ])}
      />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}

      {/* Hero band */}
      <div className="hero-band-v2">
        <div className="max-w-[760px] mx-auto px-5 md:px-6">
          <div className="pt-6 text-[12.5px] font-semibold text-[#8FB8A2]">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-1.5 opacity-60">/</span>
            <a href="/fix" className="hover:text-white transition-colors">Fix</a>
            <span className="mx-1.5 opacity-60">/</span>
            <b className="text-[#DFF3E8]">{p.h1.length > 48 ? p.h1.slice(0, 45) + "..." : p.h1}</b>
          </div>
          <div className="pt-10 pb-20">
            <div className="flex flex-wrap gap-2 mb-3.5">
              <span className="text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#DFF3E8]">
                🔧 Document Fix
              </span>
              <span className="text-[10.5px] font-extrabold tracking-wider px-3 py-1.5 rounded-full bg-[#E8A33D] text-[#3D2A07] uppercase">
                Updated June 2026
              </span>
            </div>
            <h1 className="text-[25px] md:text-[29px] font-extrabold leading-[1.22] text-white mb-2.5">
              {p.h1}
            </h1>
            <p className="text-[14.5px] text-[#BFDCCB] max-w-xl">{p.intro}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-5 md:px-6 pb-12 -mt-14 relative z-10">
        {/* Interactive tool, pre-set to this combo */}
        <FixSelector
          initialCorrect={p.correct}
          initialWrong={p.wrong}
          initialMismatch={p.mismatch}
        />

        <Link
          href="/fix"
          className="block text-center bg-accent text-white font-bold py-3 rounded-xl text-[14px] mt-4 hover:bg-accent/90 transition-colors"
        >
          Fix a different mismatch →
        </Link>

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-[19px] font-extrabold mb-3 flex items-center gap-2">
              ❓ Common questions
            </h2>
            <div className="bg-card border border-border rounded-2xl px-5 py-1">
              {faqs.map((f, i) => (
                <details key={i} className="border-b border-border last:border-0 py-3.5 group">
                  <summary className="text-[14px] font-bold text-text cursor-pointer list-none flex justify-between gap-3">
                    <span>{f.question}</span>
                    <span className="text-text-muted group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p
                    className="text-[13.5px] text-text-secondary leading-relaxed mt-2.5"
                    dangerouslySetInnerHTML={{ __html: f.answer }}
                  />
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Trust footer */}
        <div className="flex items-center gap-3 py-4 mt-6 border-t border-border">
          <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center text-[13px] font-extrabold">AK</div>
          <div>
            <div className="text-[13.5px] font-bold text-text">Ash K.</div>
            <div className="text-[11.5px] text-text-muted">Researched &amp; verified from official sources</div>
          </div>
        </div>
        <div className="p-4 bg-card-alt border border-border rounded-2xl text-[12px] text-text-muted leading-relaxed">
          📋 <b className="text-text-secondary">Verified from official sources.</b> Correction routes
          via UIDAI, Income Tax / Protean (NSDL), UTIITSL and EPFO.{" "}
          <Link href="/about#methodology" className="text-accent underline">Read our editorial process</Link>.
        </div>
      </div>
    </div>
  );
}

type QA = { question: string; answer: string };

const COMMON_FAQS: Record<string, QA[]> = {
  "aadhaar-pan-name-mismatch": [
    { question: "Will my PAN number change after correction?", answer: "No. Your PAN number stays the same. A corrected card is reissued with the updated name." },
    { question: "How long does PAN correction take?", answer: "Online PAN corrections through Protean (NSDL) or UTIITSL typically process in a couple of weeks.<br><br>Track it using the acknowledgement number you receive on submission." },
    { question: "Can I fix Aadhaar instead of PAN?", answer: "Yes, you can correct either side. Usually it is easier to match PAN to Aadhaar, since more services check Aadhaar.<br><br>Whichever you change, both must end up identical." },
    { question: "Why did my bank account get frozen?", answer: "Banks refresh KYC and freeze service when name or details do not tally across Aadhaar and PAN.<br><br>Fix the mismatch, then refresh your bank KYC manually to restore access." },
  ],
  "aadhaar-name-correction": [
    { question: "How many times can I change my Aadhaar name?", answer: "UIDAI allows an Aadhaar name update only twice in a lifetime, so make sure the new spelling is final and matches your other documents." },
    { question: "What is the fee for Aadhaar name correction?", answer: "The standard fee is ₹50, payable online or at an Aadhaar Seva Kendra." },
    { question: "Can I correct my Aadhaar name fully online?", answer: "Minor spelling changes can often be done online at the myAadhaar portal with OTP.<br><br>Larger changes may need a visit to an Aadhaar Seva Kendra with proof." },
    { question: "Why does my name correction keep getting rejected?", answer: "The most common reason is the proof document not matching the name you typed, even by one letter.<br><br>Upload a clear document whose name exactly matches what you want on Aadhaar." },
  ],
  "dob-mismatch-aadhaar-epf": [
    { question: "Is Aadhaar accepted as date of birth proof for EPF?", answer: "No. Since 16 January 2024, EPFO does not accept Aadhaar as proof of date of birth.<br><br>Use a birth certificate, school leaving certificate or passport instead." },
    { question: "How do I correct my date of birth in EPF?", answer: "Log in to the UAN Member Portal and use Modify Basic Details. If employer sign-off is needed, a Joint Declaration is filed." },
    { question: "Will the correction be approved automatically?", answer: "Under EPFO 3.0, many corrections self-approve when your Aadhaar is linked and matches.<br><br>Otherwise it routes through your employer and the EPFO office." },
  ],
  "name-mismatch-aadhaar-marksheet": [
    { question: "Which should I correct, Aadhaar or my marksheet?", answer: "Usually it is easier to correct Aadhaar to match the marksheet than to get a board certificate reissued.<br><br>Pick whichever value is truly correct and fix the other." },
    { question: "How do I correct my 10th marksheet name?", answer: "Apply at your school or the education board office with a written application, ID proof and copies of both documents." },
    { question: "Does a name mismatch fail government job applications?", answer: "Yes. Recruitment verification rejects applications when Aadhaar and the 10th certificate do not match, so fix it before applying." },
  ],
  "pan-correction-online": [
    { question: "Where do I correct my PAN online?", answer: "Through Protean (formerly NSDL) or UTIITSL, using the Changes or Correction in PAN form." },
    { question: "What documents are needed from 1 April 2026?", answer: "Proof of identity, address and date of birth are required for demographic corrections.<br><br>Aadhaar alone may not be enough for date-of-birth changes." },
    { question: "Does my PAN number change after correction?", answer: "No. The same PAN number is retained and a corrected card is issued." },
  ],
  "epf-claim-rejected-name-mismatch": [
    { question: "Why was my EPF claim rejected for a name mismatch?", answer: "If your name differs across Aadhaar, PAN, bank and EPF, the EPFO system auto-rejects the claim during KYC verification." },
    { question: "How do I fix the EPF name to match Aadhaar?", answer: "Use Modify Basic Details on the UAN Member Portal. A Joint Declaration with your employer may be needed if the error came from onboarding." },
    { question: "Does EPFO 3.0 make this easier?", answer: "Yes. Many corrections are now self-approved when your Aadhaar is linked, reducing the back-and-forth with employers." },
  ],
};
