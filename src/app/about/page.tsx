import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About KnowledgeKendra — Our Mission, Team & Editorial Process",
  description: "KnowledgeKendra is built by Ashutosh Khulbe to help young Indians navigate government schemes, competitive exams, and personal finance. Learn about our editorial standards.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[860px] mx-auto px-6 py-10">
      <h1 className="heading text-3xl mb-2">About KnowledgeKendra</h1>
      <p className="text-text-secondary text-base mb-8">Trusted information for every Indian citizen — updated, verified, and free.</p>

      <div className="prose max-w-none text-text-secondary leading-relaxed space-y-6">

        <section>
          <h2 className="heading text-xl mt-8 mb-3 text-text">Our Mission</h2>
          <p className="text-base">KnowledgeKendra exists to bridge the information gap that prevents millions of Indians from accessing government benefits, preparing for competitive exams, and building financial literacy. We simplify complex official information into clear, actionable guides — in plain language, with no jargon.</p>
          <p className="text-base">We cover 150+ topics across government schemes (Yojana), competitive exams, personal finance (Paisa), how-to guides, and side-by-side comparisons — all sourced from official government portals and verified publications.</p>
        </section>

        <section>
          <h2 className="heading text-xl mt-8 mb-3 text-text">Who&apos;s Behind This</h2>
          <div className="card p-6 mt-4" id="author">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl font-extrabold">AK</div>
              <div>
                <div className="text-lg font-bold text-text">Ashutosh Khulbe</div>
                <div className="text-sm text-text-secondary">Founder &amp; Editor</div>
              </div>
            </div>
            <p className="text-base">I built KnowledgeKendra because I saw firsthand how difficult it is for people in tier-2 and tier-3 cities to find clear, trustworthy information about government schemes and exam preparation. Most existing sources are cluttered with ads, outdated, or written in bureaucratic language that nobody understands.</p>
            <p className="text-base mt-3">Every article on this site is researched from official sources, fact-checked against government notifications, and written to be understood by anyone — whether you&apos;re a farmer checking PM Kisan status, a student preparing for SSC CGL, or a first-time investor learning about SIPs.</p>
          </div>
        </section>

        <section>
          <h2 className="heading text-xl mt-8 mb-3 text-text">Our Editorial Process</h2>
          <p className="text-base mb-4">We take accuracy seriously. Here&apos;s how every piece of content on KnowledgeKendra is created:</p>
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">1</div>
                <div>
                  <div className="font-semibold text-text text-base">Official Sources First</div>
                  <p className="text-sm text-text-secondary mt-1">Every article starts with the official government portal, gazette notification, or exam authority website. We never rely on secondary blogs or news articles as primary sources.</p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">2</div>
                <div>
                  <div className="font-semibold text-text text-base">Fact-Checked &amp; Cross-Referenced</div>
                  <p className="text-sm text-text-secondary mt-1">Eligibility criteria, benefit amounts, deadlines, and application steps are cross-referenced across at least two official sources before publishing. We link directly to official portals so you can verify yourself.</p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">3</div>
                <div>
                  <div className="font-semibold text-text text-base">Regular Updates</div>
                  <p className="text-sm text-text-secondary mt-1">Government schemes change frequently — new installments, revised eligibility, deadline extensions. We review and update articles whenever official changes are announced. Each article shows its last updated date.</p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">4</div>
                <div>
                  <div className="font-semibold text-text text-base">Plain Language</div>
                  <p className="text-sm text-text-secondary mt-1">We rewrite bureaucratic language into simple, everyday English that anyone can understand. No jargon, no filler, no clickbait.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="heading text-xl mt-8 mb-3 text-text">Our Standards</h2>
          <div className="text-base space-y-2">
            <p>✅ We never publish information we cannot verify from official sources</p>
            <p>✅ We link directly to official application portals — not affiliate links</p>
            <p>✅ We do not accept paid placements or sponsored content</p>
            <p>✅ We clearly state when information is estimated vs. confirmed</p>
            <p>✅ We disclose the last updated date on every article</p>
          </div>
        </section>

        <section>
          <h2 className="heading text-xl mt-8 mb-3 text-text">Found an Error?</h2>
          <p className="text-base">Government policies change frequently. If you spot outdated information, an incorrect eligibility criterion, or a broken link, please let us know at <strong>hello@knowledgekendra.com</strong> and we will update it within 24 hours.</p>
        </section>

        <section>
          <h2 className="heading text-xl mt-8 mb-3 text-text">Disclaimer</h2>
          <p className="text-sm text-text-muted">KnowledgeKendra is an independent information platform. We are not affiliated with any government body. Information provided here is for educational purposes and sourced from publicly available government data. Always verify details on official government portals before making decisions. See our <Link href="/disclaimer" className="text-accent underline">full disclaimer</Link>.</p>
        </section>
      </div>
    </div>
  );
}
