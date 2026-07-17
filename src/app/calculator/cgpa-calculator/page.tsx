import type { Metadata } from "next";
import { CgpaCalc } from "@/components/calculators/cgpa-calc";
import { SgpaToCgpaCalc } from "@/components/calculators/sgpa-to-cgpa-calc";
import { CalcHero } from "@/components/calc-hero";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/json-ld";
import { Breadcrumb, SectionHeading, FAQ } from "@/components/ui";

export const metadata: Metadata = {
  title: "CGPA Calculator 2026: Convert CGPA to Percentage Online",
  description: "Free CGPA calculator for 2026. Convert SGPA to CGPA and CGPA to percentage instantly. Enter subjects, credits, grades. Supports VIT, SRM, KTU, VTU.",
  alternates: { canonical: "https://knowledgekendra.com/calculator/cgpa-calculator" },
};

const faqs = [
  { question: "What is the SRM CGPA to percentage formula?", answer: "SRM works on a 10-point scale and Percentage = CGPA \u00d7 10 is the commonly used conversion, so 8.5 CGPA reads as 85%. SRM states the official conversion on the consolidated grade sheet, and that printed version is what recruiters and universities accept." },
  { question: "What is 9.2 CGPA in percentage?", answer: "It depends on the formula. Under CBSE (\u00d7 9.5) it is 87.4%, under the \u00d7 10 engineering-university formula it is 92%, and under AKTU ((CGPA - 0.5) \u00d7 10) it is 87%. Use the formula your own board or university publishes." },
  { question: "Which VTU CGPA formula applies to me?", answer: "Admitted in 2021 or later under the new CBCS scheme: Percentage = CGPA \u00d7 10. Admitted under the 2015-2018 schemes: (CGPA - 0.75) \u00d7 10. The two differ by 7.5 percentage points, so confirm your scheme with the college exam cell before quoting a number." },
  { question: "How to convert CGPA to percentage?", answer: "The most common formula is: Percentage = CGPA × 9.5. This is the CBSE-recommended conversion. So a CGPA of 8.5 = 80.75%. However, different universities use different multipliers, VTU uses CGPA × 10 - 7.5, Anna University uses a direct mapping table, and some IITs use CGPA × 10. Always check your university's specific conversion formula." },
  { question: "What is the difference between CGPA and GPA?", answer: "GPA (Grade Point Average) is typically calculated for a single semester. CGPA (Cumulative Grade Point Average) is the weighted average across ALL semesters. When companies ask for your 'CGPA,' they mean the cumulative GPA across your entire degree. Some universities call it CPI (Cumulative Performance Index), it's the same thing." },
  { question: "What is a good CGPA in India?", answer: "Generally: 9.0+ = Outstanding (top 5-10% of class), 8.0-8.9 = Excellent (competitive for top companies), 7.0-7.9 = Good (meets most job requirements), 6.0-6.9 = Average (may face cutoff issues at some companies), Below 6.0 = Below average. For higher studies abroad, 8.5+ CGPA (or 80%+) is typically expected for good universities." },
  { question: "How are credits assigned to subjects?", answer: "Credits reflect the workload of a subject. A 4-credit subject typically has 4 hours of lectures per week. Lab subjects usually get 1-2 credits. Project/thesis gets 6-12 credits. Core subjects get 3-4 credits, electives get 2-3 credits. Higher credits mean that subject has more impact on your CGPA. A poor grade in a 4-credit subject hurts more than in a 2-credit elective." },
  { question: "What is the CGPA grading scale?", answer: "Most Indian universities use a 10-point scale: O (Outstanding) = 10, A+ (Excellent) = 9, A (Very Good) = 8, B+ (Good) = 7, B (Above Average) = 6, C (Average) = 5, D (Pass) = 4, F (Fail) = 0. Some universities like VIT use S, A, B, C, D, E grades. The grade points may differ, always check your university handbook." },
  { question: "Does CGPA matter for placements?", answer: "Yes, most companies have a CGPA cutoff for campus placements, typically 6.0 to 7.0 for mass recruiters, 7.5+ for premium companies, and 8.0+ for dream companies. However, CGPA is just a filter, once you pass the cutoff, your interview performance matters more. Some startups and product companies don't have CGPA cutoffs at all." },
  { question: "How to calculate CGPA from marks?", answer: "First convert marks to grade points using your university's grading table (e.g., 90-100 = 10, 80-89 = 9, etc.). Then: CGPA = Sum of (Grade point × Credits) / Total credits. For example: Subject A (4 credits × 8 GP) + Subject B (3 credits × 9 GP) = 32 + 27 = 59. Total credits = 7. CGPA = 59/7 = 8.43." },
  { question: "How to calculate CGPA from SGPA?", answer: "CGPA is the average of your SGPA across all semesters. If every semester has equal credits, just add up all your SGPAs and divide by the number of semesters. For example, four semesters of 8.0, 8.5, 9.0, and 8.5 give a CGPA of (8.0 + 8.5 + 9.0 + 8.5) / 4 = 8.5. If your semesters carry different total credits, multiply each SGPA by that semester's credits, add them up, and divide by total credits." },
  { question: "What is the difference between SGPA and CGPA?", answer: "SGPA (Semester Grade Point Average) is your performance in a single semester. CGPA (Cumulative Grade Point Average) combines all your semesters into one overall figure. You earn a fresh SGPA each semester, and your CGPA updates as a running average of all of them. Employers and universities usually ask for CGPA, since it reflects your whole degree, not one term." },
  { question: "Can CGPA decrease?", answer: "Yes. If you score lower grades in later semesters, your cumulative CGPA will drop. The impact depends on how many credits the lower-graded subjects carry. A single F (0 grade points) in a 4-credit subject can drop your CGPA by 0.3-0.5 points. Conversely, high grades in high-credit subjects (like project/thesis with 8-12 credits) can significantly boost your CGPA." },
  { question: "What is the VIT CGPA to percentage formula?", answer: "VIT uses CGPA × 10 for percentage conversion. So 8.5 CGPA = 85%. VIT uses grades S (10), A (9), B (8), C (7), D (6), E (5), F (0). VIT also has a Dean's List for students with CGPA above 9.0. For VIT placements, most companies require 7.0+ CGPA." },
  { question: "What is SGPA vs CGPA?", answer: "SGPA (Semester Grade Point Average) is your GPA for a single semester. CGPA is the cumulative average across all semesters. To calculate CGPA from SGPAs: CGPA = Sum of (SGPA × Semester credits) / Total credits across all semesters. Your CGPA changes every semester as new SGPA is factored in." },
  { question: "How to improve CGPA?", answer: "Focus on high-credit subjects (core subjects, projects), these have maximum impact. Attend classes regularly, internal assessment marks (10-30% of total) are easy points. Use previous year papers to understand exam patterns. If your university allows, re-take failed or low-scored subjects to replace grades. Start improving from semester 3-4, later semesters have higher-credit subjects." },
  { question: "Is CGPA important for MBA admission?", answer: "For IIM CAT-based admissions, CGPA/percentage matters in the profile score (typically 10-20% weightage). IIM Ahmedabad requires minimum 6.0 CGPA. Most IIMs give extra points for 8.0+ CGPA. For GMAT-based programs (ISB, international MBA), a 7.5+ CGPA is expected. Low CGPA can be offset by excellent CAT/GMAT score and work experience." },
  { question: "What CGPA is First Class?", answer: "In most Indian universities: 6.5-7.4 CGPA = First Class, 7.5-8.4 = First Class with Distinction, 8.5+ = Outstanding. CBSE 10th standard considers 8.0+ CGPA as A1 (highest grade). For percentage-based systems: 60%+ = First Class, 50-59% = Second Class. The exact mapping varies by university, check your degree certificate classification rules." },
  { question: "How to calculate CGPA for CBSE Class 10?", answer: "CBSE Class 10 switched from CGPA to marks-based system in 2017. But for older batches: CGPA was calculated by averaging the grade points of all subjects (excluding the 6th additional subject). Each subject was graded A1 (10) to E (4-5). Percentage = CGPA × 9.5. This formula was officially recommended by CBSE and is widely accepted." },
  { question: "Does CGPA matter for government jobs?", answer: "Most government exams (SSC, UPSC, Banking) require only a minimum qualification, 'graduation in any discipline.' They don't ask for CGPA or percentage above the pass mark. Your selection depends entirely on exam performance, not college grades. Some PSUs and DRDO/ISRO recruitment specify 60% or 6.5 CGPA minimum, but these are exceptions, not the norm." },
];

export default function Page() {
  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://knowledgekendra.com" }, { name: "Calculators", url: "https://knowledgekendra.com/calculator" }, { name: "CGPA Calculator 2026", url: "https://knowledgekendra.com/calculator/cgpa-calculator" }])} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "CGPA Calculator 2026", description: "Free CGPA calculator, enter subjects, credits, grades. Convert CGPA to percentage.", applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } }} />

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculator" }, { label: "CGPA Calculator 2026" }]} />

      <CalcHero
        icon="🎓"
        title="CGPA Calculator 2026"
        tagline="Calculate your CGPA by entering subjects, credit hours, and grades. Add or remove subjects as needed, and convert CGPA to an approximate percentage using the standard formula."
        chips={["SGPA to CGPA", "CGPA to percentage", "VIT · SRM · KTU · VTU"]}
        updated="June 2026"
      />

      {/* Quick answer */}
      <div className="bg-card border-l-4 border-accent border-y border-r border-border rounded-r-2xl p-4 my-5">
        <div className="text-[11px] font-bold uppercase tracking-wide text-accent-dark mb-1">The short answer</div>
        <p className="text-[14px] text-text leading-relaxed">CBSE converts CGPA to percentage with CGPA &times; 9.5, so 8.0 CGPA is 76%. Most engineering universities (VTU 2021+ scheme, Anna, KTU, JNTU) use CGPA &times; 10, AKTU uses (CGPA - 0.5) &times; 10. The formula on your own marksheet always wins, check it before filling any form.</p>
      </div>

      <CgpaCalc />

      <SectionHeading icon="🔄">SGPA to CGPA converter</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-4">Already have your SGPA for each semester? Enter them below to get your overall CGPA. For most universities, CGPA is simply the average of all your semester SGPAs, assuming each semester carries equal credits.</p>
      <SgpaToCgpaCalc />
      <div className="my-5 rounded-r-lg p-4" style={{ borderLeft: "4px solid #1B6B4A", backgroundColor: "#DCFCE7" }}>
        <p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2"><span>📌</span><span>How SGPA becomes CGPA</span></p>
        <p className="text-sm text-text-secondary leading-relaxed">SGPA is your score for one semester. CGPA is the cumulative figure across all semesters.<br /><br />If your semesters have different total credits, the exact formula weights each SGPA by its credits. When credits are roughly equal, a simple average is accurate enough for most checks.</p>
      </div>

      <SectionHeading icon="🔄">CGPA to percentage quick reference</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-4">The most common conversion is the CBSE formula: Percentage = CGPA × 9.5. Use the table below for a quick check, but always confirm your own university formula.</p>
      <div className="overflow-x-auto mb-2">
        <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-accent-dark text-white text-left">
              <th className="px-3 py-2 font-semibold">CGPA</th>
              <th className="px-3 py-2 font-semibold">CBSE (× 9.5)</th>
              <th className="px-3 py-2 font-semibold">VIT / SRM (× 10)</th>
              <th className="px-3 py-2 font-semibold">VTU (−0.75 ×10)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["10", "95%", "100%", "92.5%"],
              ["9.5", "90.25%", "95%", "87.5%"],
              ["9.0", "85.5%", "90%", "82.5%"],
              ["8.5", "80.75%", "85%", "77.5%"],
              ["8.33", "79.14%", "83.3%", "75.8%"],
              ["8.13", "77.24%", "81.3%", "73.8%"],
              ["8.0", "76%", "80%", "72.5%"],
              ["7.5", "71.25%", "75%", "67.5%"],
              ["7.0", "66.5%", "70%", "62.5%"],
              ["6.5", "61.75%", "65%", "57.5%"],
            ].map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-card-alt" : "bg-card"}>
                <td className="px-3 py-2 font-semibold text-accent">{r[0]}</td>
                <td className="px-3 py-2 text-text-secondary">{r[1]}</td>
                <td className="px-3 py-2 text-text-secondary">{r[2]}</td>
                <td className="px-3 py-2 text-text-secondary">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted mb-6 italic">Conversions are approximate. Anna University and some others use a direct mapping table, not a single formula.</p>

      <div className="my-5 rounded-r-lg p-4" style={{ borderLeft: "4px solid #2563EB", backgroundColor: "#DBEAFE" }}>
        <p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2"><span>💡</span><span>CGPA to percentage</span></p>
        <p className="text-sm text-text-secondary leading-relaxed">CBSE formula: Percentage = CGPA × 9.5, so a CGPA of 8.0 = 76%. VTU formula: Percentage = (CGPA − 0.75) × 10. VIT formula: Percentage = CGPA × 10.<br /><br />Always check which formula your university uses. Using the wrong one on your resume can cause issues during verification.</p>
      </div>

      <SectionHeading icon="📖">What is CGPA?</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">CGPA stands for Cumulative Grade Point Average. It&apos;s a weighted average of grade points earned across all subjects in all semesters of your degree. The &quot;weighted&quot; part is important, a 4-credit subject impacts your CGPA twice as much as a 2-credit subject. This is why performing well in core subjects (which typically carry more credits) matters more than electives.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Most Indian universities follow a 10-point grading scale where 10 is the highest (Outstanding) and 0 is a fail. The formula is: CGPA = Total weighted grade points ÷ Total credits. Weighted grade points = Grade point × Credits for each subject, summed across all subjects in all semesters.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">CGPA was introduced to replace the marks-based system because it reduces the focus on marginal differences (is 78% really different from 79%?) and provides a standardized scale across different examination patterns. Today, almost all engineering colleges, central universities, and most state universities use CGPA.</p>

      <div className="my-6">
        <p className="text-xs text-text-muted mb-2 text-center italic">10-point grading scale used by most Indian universities</p>
        <div className="card p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[
              ["O", "10", "#DCFCE7", "#1B6B4A"],
              ["A+", "9", "#DCFCE7", "#1B6B4A"],
              ["A", "8", "#DBEAFE", "#1E40AF"],
              ["B+", "7", "#DBEAFE", "#1E40AF"],
              ["B", "6", "#FFF7ED", "#C2410C"],
              ["C", "5", "#FFF7ED", "#C2410C"],
              ["D", "4", "#FEE2E2", "#DC2626"],
              ["F", "0", "#FEE2E2", "#DC2626"],
            ].map(([g, p, bg, fg]) => (
              <div key={g} className="rounded-lg py-2 text-center" style={{ background: bg }}>
                <div className="text-base font-extrabold" style={{ color: fg }}>{g}</div>
                <div className="text-[11px]" style={{ color: fg }}>{p} pts</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-text-muted mt-3 text-center italic">Grade names and cutoffs vary by university, check your specific handbook.</p>
        </div>
      </div>

      <SectionHeading icon="🏫">University-specific conversion formulas</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">CBSE: Percentage = CGPA × 9.5. Officially recommended by CBSE for Class 10. Widely used as a default when no university-specific formula exists.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">VTU (Visvesvaraya Technological University): the formula depends on your scheme. Students under the 2021/2022 CBCS scheme use Percentage = CGPA &times; 10, while older 2015-2018 scheme students use (CGPA - 0.75) &times; 10, a 7.5-point difference for the same CGPA. Confirm your scheme with your college exam cell before quoting either.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Anna University: Uses a direct mapping table rather than a formula. Approximately: 9.5+ CGPA ≈ 95%+, 8.5 ≈ 82%, 7.5 ≈ 72%. Anna University provides official conversion on degree certificates.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">VIT, SRM, BITS: Percentage = CGPA × 10. So 8.5 CGPA = 85%. This is the simplest conversion and is used by many private universities.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">KTU (APJ Abdul Kalam Technological University): Percentage = CGPA × 10 for placements. KTU uses S (10), A+ (9), A (8.5), B+ (8), B (7), C+ (6), C (5.5), D (5), F (0).</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">AKTU (Dr. APJ Abdul Kalam Technical University, UP): Percentage = (CGPA - 0.5) &times; 10. An 8.0 CGPA is 75%, not 80%. This half-point deduction trips up UP engineering students on government job forms every year.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">KIIT, GGSIPU (IP University), JNTU: Percentage = CGPA &times; 10 is the commonly used conversion. Private and deemed universities generally state the formula on the consolidated marksheet or degree, which is the version that counts.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">No official formula from your university? The UGC-recognised default is Percentage = CGPA &times; 9.5. Use it only when your institution has published nothing, and say so on the form if asked.</p>

      <div className="my-5 rounded-r-lg p-4" style={{ borderLeft: "4px solid #DC2626", backgroundColor: "#FEE2E2" }}>
        <p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2"><span>⚠️</span><span>Common mistake on resumes</span></p>
        <p className="text-sm text-text-secondary leading-relaxed">Don&apos;t convert CGPA using the wrong formula. If you&apos;re from VTU and use CGPA × 9.5 (CBSE formula), you&apos;ll overstate your percentage. During background verification, companies check the formula with your university. Mismatched percentages can lead to offer cancellation. Always mention which formula you used or just state CGPA directly.</p>
      </div>

      <blockquote className="my-6 border-l-4 border-accent pl-5 py-2">
        <p className="text-lg font-semibold text-text leading-snug italic">A single F grade (0 points) in a 4-credit subject can drop your CGPA by 0.3-0.5 points. That&apos;s the difference between clearing a 7.0 placement cutoff and missing it.</p>
      </blockquote>

      <SectionHeading icon="💼">CGPA cutoffs for placements</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Mass recruiters (TCS, Infosys, Wipro, Cognizant): 6.0-6.5 CGPA minimum. These companies hire in bulk and the CGPA bar is low. Focus is on aptitude test and interview performance.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Premium companies (Amazon, Microsoft, Google, Goldman Sachs): 7.0-8.0 CGPA minimum. These companies receive thousands of applications and use CGPA as a filter. Coding ability matters more than CGPA once you clear the cutoff.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Startups: Often no CGPA cutoff at all. They evaluate based on projects, GitHub portfolio, and problem-solving skills. If your CGPA is low but you have strong practical skills, startups are a better path than traditional placements.</p>

      <div className="my-5 rounded-r-lg p-4" style={{ borderLeft: "4px solid #EA580C", backgroundColor: "#FFF7ED" }}>
        <p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2"><span>🎯</span><span>For students with low CGPA</span></p>
        <p className="text-sm text-text-secondary leading-relaxed">CGPA below 7.0 doesn&apos;t end your career. Focus on: (1) Building real projects and hosting them on GitHub. (2) Competitive programming on LeetCode/Codeforces. (3) Certifications (AWS, Google Cloud, etc.). (4) Open-source contributions. Many top engineers at Google and Amazon had average CGPAs but exceptional portfolios.</p>
      </div>

      <p className="text-xs text-text-muted mt-6 mb-8 italic">Last reviewed: April 2026 • CGPA conversion formulas sourced from official university websites. Always verify with your specific institution.</p>

      
      <SectionHeading icon="📊">How CGPA is calculated, step by step</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Step 1: List all subjects with their credit hours. Core subjects typically have 3-4 credits, labs 1-2 credits, and electives 2-3 credits. Your university handbook specifies exact credits for each course.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Step 2: Assign grade points to each subject based on the grade you received. On a standard 10-point scale: O=10, A+=9, A=8, B+=7, B=6, C=5, D=4, F=0.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Step 3: Multiply each subject&apos;s grade point by its credits to get weighted grade points. Then sum all weighted grade points and divide by total credits. Example: (8×4 + 9×3 + 7×3 + 10×2) = 32+27+21+20 = 100. Total credits = 12. CGPA = 100÷12 = 8.33.</p>

      <SectionHeading icon="🎯">Strategies to maximize CGPA</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">1. Prioritize high-credit subjects: A difference of one grade (say B+ vs A) in a 4-credit subject impacts your CGPA twice as much as in a 2-credit elective. Put extra study hours into core subjects with 4+ credits, the ROI on your time is highest there.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">2. Never underestimate internals: Most universities allocate 20-40% of total marks to internal assessments (assignments, quizzes, attendance, mid-semester tests). These are predictable and controllable. Securing 35/40 in internals means you only need 25/60 in the final exam for an A grade, a much easier target.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">3. Use the grade improvement option: Many universities allow you to re-take courses to improve grades. If your university offers this (check the academic regulations), re-taking a subject where you scored C or D can boost your CGPA significantly, especially if it was a high-credit subject.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">4. Choose electives wisely: Some electives are known for lenient grading, easier content, or better-teaching professors. Ask seniors. Picking an elective where 40% of the class gets A+ is smarter than one where the average grade is B. This isn&apos;t gaming the system, it&apos;s smart course planning.</p>

      <div className="my-6">
        <p className="text-xs text-text-muted mb-2 text-center italic">Impact of one grade change on overall CGPA</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 text-center" style={{ background: "#FEE2E2" }}>
            <div className="text-sm font-bold" style={{ color: "#991B1B" }}>4-credit subject: B to A</div>
            <div className="text-[11px] mt-1" style={{ color: "#991B1B" }}>Grade points change: 6 to 8</div>
            <div className="text-2xl font-extrabold mt-2" style={{ color: "#DC2626" }}>+0.40 CGPA</div>
            <div className="text-[11px] mt-1" style={{ color: "#991B1B" }}>Significant jump</div>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ background: "#DCFCE7" }}>
            <div className="text-sm font-bold" style={{ color: "#145236" }}>2-credit elective: B to A</div>
            <div className="text-[11px] mt-1" style={{ color: "#145236" }}>Grade points change: 6 to 8</div>
            <div className="text-2xl font-extrabold mt-2" style={{ color: "#1B6B4A" }}>+0.20 CGPA</div>
            <div className="text-[11px] mt-1" style={{ color: "#145236" }}>Half the impact</div>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-3">Same grade improvement, but the 4-credit subject gives double the CGPA boost. This is why focusing on high-credit courses matters more than spreading effort equally.</p>
      </div>

      <SectionHeading icon="🌍">CGPA for higher studies abroad</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">For MS/PhD applications to US/UK/European universities, CGPA is converted to the 4.0 GPA scale. Common conversion: Indian 10-point CGPA ÷ 2.5 ≈ US 4.0 GPA. So 8.0 CGPA ≈ 3.2 GPA. However, each university evaluates Indian transcripts differently, many use WES (World Education Services) for official conversion.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Competitive thresholds: For top US universities (MIT, Stanford, CMU): 9.0+ CGPA (or 3.6+ GPA) is typically expected. For good universities (top 50): 8.0+ CGPA. For decent universities (top 100): 7.0+ CGPA. GRE score, SOP, research experience, and recommendations matter more than CGPA alone for graduate admissions.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">WES evaluation: If applying to universities that require WES credential evaluation, your Indian grades are evaluated and converted to a US-equivalent GPA. WES tends to evaluate Indian grades conservatively, a 7.5 CGPA might convert to 3.0 GPA (instead of the 3.0 you&apos;d get from simple division). Factor this into your expectations.</p>

      <div className="my-6">
        <p className="text-xs text-text-muted mb-2 text-center italic">Approximate CGPA to US 4.0 GPA scale (and target university tier)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-accent-dark text-white text-left">
                <th className="px-3 py-2 font-semibold">CGPA (10)</th>
                <th className="px-3 py-2 font-semibold">US GPA (4.0)</th>
                <th className="px-3 py-2 font-semibold">Target tier</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["9.0+", "3.6+", "Top US (MIT, Stanford, CMU)"],
                ["8.0 - 8.9", "3.2 - 3.5", "Top 50 universities"],
                ["7.0 - 7.9", "2.8 - 3.1", "Top 100 universities"],
                ["Below 7.0", "Below 2.8", "Offset with GRE, research, SOP"],
              ].map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-card-alt" : "bg-card"}>
                  <td className="px-3 py-2 font-semibold text-accent">{r[0]}</td>
                  <td className="px-3 py-2 text-text-secondary">{r[1]}</td>
                  <td className="px-3 py-2 text-text-secondary">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-muted mt-2 italic">Rough guide only. WES and individual universities evaluate Indian transcripts differently, often more conservatively.</p>
      </div>

      <SectionHeading icon="📋">CGPA on your resume, best practices</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">When to mention CGPA: Always include CGPA on your resume if it&apos;s above 7.0. If below 7.0, include it only if the job posting explicitly asks for it, otherwise, listing it draws attention to a weakness. For experienced professionals (5+ years), CGPA becomes less relevant, focus on work experience instead.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Format: Write &quot;CGPA: 8.5/10 (Equivalent: 80.75%)&quot;, include both CGPA and percentage to avoid confusion. Mention the conversion formula used: &quot;(CBSE formula: CGPA × 9.5)&quot;. If your university provides an official grade sheet with percentage, use that number instead of self-calculated conversion.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">During interviews: If asked about a low CGPA, be honest but redirect. &quot;My CGPA is 6.8, which I know isn&apos;t top-tier. I focused heavily on building practical skills, here&apos;s my portfolio of 5 projects including [specific project]. My CGPA doesn&apos;t reflect my technical ability, and I&apos;m happy to demonstrate that in a coding round.&quot;</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Background verification: Companies verify CGPA/percentage during background checks. They contact your university directly or use verification services. Never round up or inflate your CGPA, if your actual CGPA is 7.4 and you write 7.5, it will be flagged during verification and can result in offer cancellation even months after joining.</p>

      <SectionHeading icon="🎓">CGPA across different university systems in India</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">IITs: Use a 10-point CPI (Cumulative Performance Index). Grading: AA(10), AB(9), BB(8), BC(7), CC(6), CD(5), DD(4), FF(0). Some IITs use relative grading, your grade depends on class average, not absolute marks. A 7.5 CPI from IIT is considered very good because of relative grading difficulty.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">NITs: Similar 10-point CGPA system. Use absolute grading (not relative). Grades: S(10), A(9), B(8), C(7), D(6), E(5), F(0). NIT CGPA to percentage: most NITs recommend CGPA × 9.5 or provide their own conversion on the degree certificate.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Mumbai University: Uses a unique system where grade points are 10, 9, 8, 7, 6, 5, 4 for grades O, A+, A, B+, B, C, P respectively. Percentage = (CGPA - 0.5) × 10 for engineering. So 8.0 CGPA = 75% (not 76% as CBSE formula would give).</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">JNTU (Jawaharlal Nehru Technological University): Uses a 10-point scale with grades S(10), A(9), B(8), C(7), D(6), E(5), F(0). Percentage conversion: CGPA × 10 - 7.5. So 8.0 CGPA = 72.5%. This is significantly different from CBSE, a JNTU student with 8.0 CGPA and a VIT student with 8.0 CGPA have different percentage equivalents.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Autonomous colleges under AICTE: Each college may define its own grading system within AICTE guidelines. Some use absolute grading, others relative. Some have 10-point scales, others use 4-point scales (mimicking the US system). Always check your specific college&apos;s academic regulations document for the official conversion method.</p>

      <div className="my-6">
        <p className="text-xs text-text-muted mb-2 text-center italic">CGPA to percentage formula by major Indian university system</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-accent-dark text-white text-left">
                <th className="px-3 py-2 font-semibold">University</th>
                <th className="px-3 py-2 font-semibold">Conversion</th>
                <th className="px-3 py-2 font-semibold">8.0 CGPA =</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["CBSE", "CGPA × 9.5", "76%"],
                ["VIT / SRM / BITS", "CGPA × 10", "80%"],
                ["VTU", "(CGPA − 0.75) × 10", "72.5%"],
                ["KTU", "CGPA × 10 (placements)", "80%"],
                ["JNTU", "CGPA × 10 − 7.5", "72.5%"],
                ["Mumbai (Engg)", "(CGPA − 0.5) × 10", "75%"],
                ["Anna University", "Direct mapping table", "~78%"],
                ["IITs / NITs", "10-point CPI, own table", "varies"],
              ].map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-card-alt" : "bg-card"}>
                  <td className="px-3 py-2 font-semibold text-accent">{r[0]}</td>
                  <td className="px-3 py-2 text-text-secondary">{r[1]}</td>
                  <td className="px-3 py-2 text-text-secondary">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-muted mt-2 italic">Always confirm with your university handbook or degree certificate, formulas change and some use official mapping tables.</p>
      </div>

      <SectionHeading icon="🧮">CGPA calculation examples</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Example 1, Engineering student, Semester 3: Data Structures (4cr, A=8), Digital Logic (4cr, A+=9), Maths III (3cr, B+=7), Environmental Science (2cr, O=10), Lab (2cr, A=8). Weighted sum = 32+36+21+20+16 = 125. Total credits = 15. SGPA = 125/15 = 8.33.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Example 2, Cumulative across 4 semesters: Sem 1 SGPA=7.8 (20cr), Sem 2 SGPA=8.2 (22cr), Sem 3 SGPA=8.5 (20cr), Sem 4 SGPA=8.0 (18cr). CGPA = (7.8×20 + 8.2×22 + 8.5×20 + 8.0×18) ÷ (20+22+20+18) = (156+180.4+170+144) ÷ 80 = 650.4/80 = 8.13.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Example 3, Impact of one failed subject: Same Sem 3 as Example 1, but Environmental Science = F(0) instead of O(10). New weighted sum = 32+36+21+0+16 = 105. SGPA = 105/15 = 7.00. One F in a 2-credit subject dropped SGPA from 8.33 to 7.00, a 1.33 point drop. This shows why avoiding failures is critical even in low-credit subjects.</p>

      <div className="my-6 card p-5">
        <p className="text-sm font-bold text-text mb-4 text-center">The CGPA formula in 3 steps</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ["1", "Grade point × credits", "For each subject, multiply its grade point by its credit hours."],
            ["2", "Add them all up", "Sum the weighted grade points across every subject."],
            ["3", "Divide by total credits", "That sum ÷ total credits = your CGPA."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-xl p-4 bg-card-alt border border-border text-center">
              <div className="w-8 h-8 rounded-lg bg-accent text-white grid place-items-center font-bold mx-auto mb-2">{n}</div>
              <div className="text-sm font-semibold text-text mb-1">{t}</div>
              <div className="text-xs text-text-muted leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-accent-dark font-semibold mt-4 bg-accent-light rounded-lg py-2">CGPA = Σ (Grade point × Credits) ÷ Total credits</p>
      </div>

      <SectionHeading icon="📈">CGPA trends in Indian education</SectionHeading>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Grade inflation: Average CGPAs have been rising across Indian universities over the past decade. In many engineering colleges, the class average has moved from 6.5 to 7.5 in the last 10 years. This means a 7.5 CGPA today is less impressive than the same score 10 years ago. Employers are aware of this trend, they increasingly look at relative rank (top 10%, top 25%) rather than absolute CGPA.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Relative vs absolute grading: IITs use relative grading where your grade depends on class performance, not absolute marks. Scoring 60/100 might get you an A if the class average is 40. State universities use absolute grading, 60/100 always gives the same grade regardless of class average. This is why comparing CGPAs across universities is unreliable without context.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Online semester impact: CGPAs from 2020-2022 (COVID online semesters) are generally higher than pre-COVID averages because of open-book exams and reduced proctoring. Some employers discount these semester grades during hiring. If your CGPA has a noticeable spike during online semesters, be prepared to address this in interviews, it&apos;s better to acknowledge it proactively than have the interviewer draw their own conclusions.</p>
      <p className="text-base text-text-secondary leading-[1.75] mb-5">Credit system evolution: UGC introduced the Choice Based Credit System (CBCS) in 2015-16 for all central and state universities. Under CBCS, students choose electives from a basket, and credits are standardized across universities. This has made CGPA more comparable across institutions than before, though implementation quality varies significantly between universities.</p>

<SectionHeading icon="❓">Frequently asked questions</SectionHeading>
      {faqs.map((f: any) => <FAQ key={f.question} question={f.question} answer={f.answer} />)}

      <div className="mt-10 flex flex-wrap gap-2">
        <a href="/calculator/income-tax-calculator" className="px-4 py-2 rounded-lg text-sm bg-card border border-border hover:border-accent/40 text-text-secondary transition-colors">Income Tax Calculator →</a>
        <a href="/calculator/gratuity-calculator" className="px-4 py-2 rounded-lg text-sm bg-card border border-border hover:border-accent/40 text-text-secondary transition-colors">Gratuity Calculator →</a>
        <a href="/calculator/sip-calculator" className="px-4 py-2 rounded-lg text-sm bg-card border border-border hover:border-accent/40 text-text-secondary transition-colors">SIP Calculator →</a>
      </div>
    </div>
  );
}
