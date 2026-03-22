import type { Metadata } from "next";
export const metadata: Metadata = { title: "About KnowledgeKendra" };
export default function AboutPage() {
  return (
    <div className="max-w-[860px] mx-auto px-6 py-10">
      <h1 className="heading text-3xl mb-6">About KnowledgeKendra</h1>
      <div className="prose max-w-none text-text-secondary leading-relaxed space-y-4">
        <p className="text-base">KnowledgeKendra is a free information platform that makes government schemes, competitive exams, and personal finance easy to understand for everyone in India.</p>
        <p className="text-base">We believe that every Indian citizen deserves access to clear, accurate, and jargon-free information about the benefits and opportunities available to them — whether it&apos;s a farmer checking eligibility for PM Kisan, a student preparing for SSC CGL, or a first-time investor learning about SIPs.</p>
        <h2 className="heading text-2xl mt-8 mb-4 text-text">Why We Built This</h2>
        <p className="text-base">Most government information websites in India are cluttered with ads, popups, outdated information, and confusing language. We wanted to build something different — a clean, fast, mobile-friendly site that respects your time and gives you exactly what you need.</p>
        <h2 className="heading text-2xl mt-8 mb-4 text-text">Our Promise</h2>
        <p className="text-base">Every piece of information on KnowledgeKendra is sourced from official government portals and verified sources. We link directly to official application pages so you can take action immediately. We don&apos;t sell your data, we don&apos;t show misleading ads, and we don&apos;t use clickbait headlines.</p>
        <h2 className="heading text-2xl mt-8 mb-4 text-text">Contact</h2>
        <p className="text-base">Have a question, suggestion, or found an error? We&apos;d love to hear from you. Reach out at <strong>hello@knowledgekendra.in</strong></p>
      </div>
    </div>
  );
}
