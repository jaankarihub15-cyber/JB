import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function PrivacyPage() {
  return (
    <div className="max-w-[860px] mx-auto px-6 py-10">
      <h1 className="heading text-3xl mb-6">Privacy Policy</h1>
      <div className="text-text-secondary leading-relaxed space-y-4">
        <p className="text-sm text-text-muted">Last updated: March 2026</p>
        <p className="text-base">KnowledgeKendra respects your privacy. This policy explains what data we collect (very little) and how we use it.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Information We Collect</h2>
        <p className="text-base">When you use our Eligibility Checker tool, the information you enter (age, gender, occupation, income, category) is processed entirely in your browser. We do not store this data on any server. It is not transmitted anywhere.</p>
        <p className="text-base">We use privacy-respecting analytics to understand how many people visit our site and which pages are popular. This data is aggregated and anonymous — we cannot identify individual visitors.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Cookies</h2>
        <p className="text-base">We use minimal cookies required for the site to function. We do not use tracking cookies, advertising cookies, or third-party cookies.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Third-Party Links</h2>
        <p className="text-base">Our pages link to official government portals (pmkisan.gov.in, ssc.gov.in, etc.) and financial platforms. These external sites have their own privacy policies. We recommend reviewing them before submitting personal information.</p>
        <h2 className="heading text-xl mt-6 mb-3 text-text">Contact</h2>
        <p className="text-base">Questions about this policy? Email us at hello@knowledgekendra.in</p>
      </div>
    </div>
  );
}
