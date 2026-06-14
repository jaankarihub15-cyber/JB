"use client";

// Salary-first lead section for exam pages. Reads salary_table (new optional
// field) or falls back to major_posts. Hides when neither exists.
export function SalaryLead({ salary, posts }: {
  salary?: { intro?: string; rows?: { post: string; amount: string }[] };
  posts?: { post: string; in_hand_salary: string }[];
}) {
  const rows = salary?.rows?.length ? salary.rows : (posts || []).map(p => ({ post: p.post, amount: p.in_hand_salary }));
  if (!rows.length) return null;
  return (
    <section id="salary" className="card px-5 md:px-6 py-5 mt-6 scroll-mt-16">
      <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.07em] uppercase px-3 py-1.5 rounded-[10px] bg-accent-light text-accent mb-3">💰 Salary</div>
      <div className="text-[30px] font-extrabold text-accent leading-tight">{rows[0]?.amount || ""}</div>
      {salary?.intro && <p className="text-sm text-text-secondary leading-relaxed mt-1.5 mb-3">{salary.intro}</p>}
      <div className="mt-3">
        {rows.slice(0, 8).map((r, i) => (
          <div key={i} className="flex justify-between gap-3 py-2.5 border-t border-border text-sm">
            <span className="text-text-secondary" dangerouslySetInnerHTML={{ __html: r.post }} />
            <span className="font-semibold text-text whitespace-nowrap" dangerouslySetInnerHTML={{ __html: r.amount }} />
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-xl bg-accent-light text-accent text-sm leading-relaxed">
        <b>💡</b> {salary?.intro ? "Check the full post table below for department-wise details." : "Salary varies by post and city HRA. Check the full table below."}
      </div>
    </section>
  );
}
