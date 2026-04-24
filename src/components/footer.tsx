import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-xs font-extrabold">K</div>
              <span className="text-base font-extrabold tracking-tight text-text">Knowledge<span className="text-accent">Kendra</span></span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              Simple, accurate information about government schemes, exams, and personal finance.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Yojana</h4>
            <div className="flex flex-col gap-2">
              <Link href="/yojana/pm-kisan" className="text-xs text-text-secondary hover:text-accent transition-colors">PM Kisan</Link>
              <Link href="/yojana/ayushman-bharat" className="text-xs text-text-secondary hover:text-accent transition-colors">Ayushman Bharat</Link>
              <Link href="/yojana/ladli-behna-yojana" className="text-xs text-text-secondary hover:text-accent transition-colors">Ladli Behna</Link>
              <Link href="/yojana/pm-surya-ghar" className="text-xs text-text-secondary hover:text-accent transition-colors">PM Surya Ghar</Link>
              <Link href="/yojana" className="text-xs text-accent font-bold">All Schemes →</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Exams</h4>
            <div className="flex flex-col gap-2">
              <Link href="/exam/ssc-cgl-2026" className="text-xs text-text-secondary hover:text-accent transition-colors">SSC CGL 2026</Link>
              <Link href="/exam/upsc-cse" className="text-xs text-text-secondary hover:text-accent transition-colors">UPSC CSE 2026</Link>
              <Link href="/exam/ibps-po" className="text-xs text-text-secondary hover:text-accent transition-colors">IBPS PO 2026</Link>
              <Link href="/exam/jee-main" className="text-xs text-text-secondary hover:text-accent transition-colors">JEE Main 2026</Link>
              <Link href="/exam" className="text-xs text-accent font-bold">All Exams →</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Paisa Guide</h4>
            <div className="flex flex-col gap-2">
              <Link href="/paisa/what-is-sip" className="text-xs text-text-secondary hover:text-accent transition-colors">What is SIP?</Link>
              <Link href="/paisa/what-is-mutual-fund" className="text-xs text-text-secondary hover:text-accent transition-colors">What is Mutual Fund?</Link>
              <Link href="/paisa/ppf-guide" className="text-xs text-text-secondary hover:text-accent transition-colors">PPF Guide</Link>
              <Link href="/paisa/credit-score-guide" className="text-xs text-text-secondary hover:text-accent transition-colors">Credit Score Guide</Link>
              <Link href="/paisa" className="text-xs text-accent font-bold">All Articles →</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">More</h4>
            <div className="flex flex-col gap-2">
              <Link href="/guide" className="text-xs text-text-secondary hover:text-accent transition-colors">How-To Guides</Link>
              <Link href="/compare" className="text-xs text-text-secondary hover:text-accent transition-colors">Comparisons</Link>
              <Link href="/calculator" className="text-xs text-text-secondary hover:text-accent transition-colors">Calculators</Link>
              <Link href="/check-eligibility" className="text-xs text-text-secondary hover:text-accent transition-colors">Eligibility Checker</Link>
              <Link href="/search" className="text-xs text-text-secondary hover:text-accent transition-colors">Search</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/about" className="text-xs text-text-muted hover:text-text-secondary transition-colors">About</Link>
            <Link href="/feed.xml" className="text-xs text-text-muted hover:text-text-secondary transition-colors">RSS Feed</Link>
            <Link href="/about#author" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Editorial Process</Link>
            <Link href="/contact" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Contact</Link>
            <Link href="/privacy" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Disclaimer</Link>
          </div>
          <p className="text-xs text-text-muted text-center">
            © 2026 KnowledgeKendra by Ashutosh Khulbe · All info sourced from official government portals
          </p>
        </div>
      </div>
    </footer>
  );
}
