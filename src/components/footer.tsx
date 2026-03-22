import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[860px] mx-auto px-6 py-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="heading text-xl inline-block mb-3">
              <span className="text-text">Jaankari</span>
              <span className="text-accent">Kendra</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              Simple, accurate information about government schemes, exams, and personal finance.
            </p>
          </div>

          {/* Schemes */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-3 uppercase tracking-wide">Yojana</h4>
            <div className="flex flex-col gap-2">
              <Link href="/yojana/pm-kisan" className="text-sm text-text-secondary hover:text-accent">PM Kisan</Link>
              <Link href="/yojana/ayushman-bharat" className="text-sm text-text-secondary hover:text-accent">Ayushman Bharat</Link>
              <Link href="/yojana/sukanya-samriddhi-yojana" className="text-sm text-text-secondary hover:text-accent">Sukanya Samriddhi</Link>
              <Link href="/yojana/pm-awas-yojana" className="text-sm text-text-secondary hover:text-accent">PM Awas Yojana</Link>
              <Link href="/yojana" className="text-sm text-accent font-medium">All Schemes →</Link>
            </div>
          </div>

          {/* Exams */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-3 uppercase tracking-wide">Exams</h4>
            <div className="flex flex-col gap-2">
              <Link href="/exam/ssc-cgl-2026" className="text-sm text-text-secondary hover:text-accent">SSC CGL 2026</Link>
              <Link href="/exam/upsc-cse" className="text-sm text-text-secondary hover:text-accent">UPSC CSE 2026</Link>
              <Link href="/exam/ibps-po" className="text-sm text-text-secondary hover:text-accent">IBPS PO 2026</Link>
              <Link href="/exam/ssc-chsl" className="text-sm text-text-secondary hover:text-accent">SSC CHSL 2026</Link>
              <Link href="/exam" className="text-sm text-accent font-medium">All Exams →</Link>
            </div>
          </div>

          {/* Paisa Guide */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-3 uppercase tracking-wide">Paisa Guide</h4>
            <div className="flex flex-col gap-2">
              <Link href="/paisa/what-is-sip" className="text-sm text-text-secondary hover:text-accent">What is SIP?</Link>
              <Link href="/paisa/what-is-mutual-fund" className="text-sm text-text-secondary hover:text-accent">What is Mutual Fund?</Link>
              <Link href="/paisa/ppf-guide" className="text-sm text-text-secondary hover:text-accent">PPF Guide</Link>
              <Link href="/paisa/credit-score-guide" className="text-sm text-text-secondary hover:text-accent">Credit Score Guide</Link>
              <Link href="/paisa" className="text-sm text-accent font-medium">All Articles →</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/about" className="text-sm text-text-muted hover:text-text-secondary">About</Link>
            <Link href="/contact" className="text-sm text-text-muted hover:text-text-secondary">Contact</Link>
            <Link href="/privacy" className="text-sm text-text-muted hover:text-text-secondary">Privacy Policy</Link>
            <Link href="/disclaimer" className="text-sm text-text-muted hover:text-text-secondary">Disclaimer</Link>
          </div>
          <p className="text-sm text-text-muted text-center">
            © {new Date().getFullYear()} KnowledgeKendra · All info sourced from official portals
          </p>
        </div>
      </div>
    </footer>
  );
}
