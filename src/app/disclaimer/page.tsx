import type { Metadata } from "next";
export const metadata: Metadata = { title: "Disclaimer" };
export default function DisclaimerPage() {
  return (
    <div className="max-w-[860px] mx-auto px-6 py-10">
      <h1 className="heading text-3xl mb-6">Disclaimer</h1>
      <div className="text-text-secondary leading-relaxed space-y-4">
        <p className="text-base">The information provided on JaankariHub is for general informational and educational purposes only. While we strive to keep the content accurate and up-to-date, we make no guarantees about the completeness, reliability, or accuracy of any information on this site.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Not Official Government Source</h2>
        <p className="text-base">JaankariHub is not affiliated with, endorsed by, or connected to any government department or agency. All government scheme information is sourced from official portals and public documents, but for the most current and authoritative information, always refer to the official government websites linked on each page.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Not Financial Advice</h2>
        <p className="text-base">Content in our Paisa Guide section is educational and should not be considered financial advice. Investment decisions involve risk. Mutual fund investments are subject to market risks. Past performance does not guarantee future results. Please consult a SEBI-registered financial advisor before making any investment decisions.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Eligibility Checker</h2>
        <p className="text-base">Our eligibility checker provides indicative results based on general eligibility criteria. Actual eligibility depends on specific documents, state-level rules, and scheme-specific conditions. Always verify your eligibility on the official scheme portal before applying.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Exam Information</h2>
        <p className="text-base">Exam dates, patterns, and syllabus information is based on officially published notifications and calendars. These are subject to change by the conducting body. Always verify with the official exam website for the latest updates.</p>
      </div>
    </div>
  );
}
