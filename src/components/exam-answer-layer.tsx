"use client";

// Theme V2, exam-specific "answer-first" layer: status pill, answer-router
// grid, fact tiles, and a sticky anchor nav. All inputs optional, every block
// hides when its data is absent so un-migrated exam pages render clean.

const ICONS: Record<string, string> = {
  cash: "💰", book: "📘", "user-check": "✅", chart: "📊",
  calendar: "📅", file: "📄", clipboard: "📋", list: "📝",
};

const STATUS: Record<string, { label: string; cls: string }> = {
  form_open: { label: "Form open", cls: "bg-[#1B6B4A] text-white" },
  upcoming: { label: "Upcoming", cls: "bg-[#E1E0DB] text-[#5f5e5a]" },
  notification_out: { label: "Notification out", cls: "bg-[#E6F1FB] text-[#185FA5]" },
  exam_soon: { label: "Exam soon", cls: "bg-[#FAEEDA] text-[#854F0B]" },
  result_out: { label: "Result out", cls: "bg-[#1B6B4A] text-white" },
};

export function StatusPill({ status }: { status?: string }) {
  if (!status || !STATUS[status]) return null;
  const s = STATUS[status];
  return (
    <span className={`inline-block text-[11px] font-bold tracking-wide px-3 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function ExamStickyNav({ items }: { items: { id: string; label: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="sticky top-0 z-20 -mx-5 md:-mx-6 px-5 md:px-6 bg-white/95 backdrop-blur border-b border-border">
      <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap py-2.5">
        {items.map((it, i) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`text-[12.5px] font-semibold px-3 py-1.5 rounded-full transition-colors ${
              i === 0 ? "bg-[#E1F5EE] text-[#1B6B4A]" : "text-[#5f5e5a] hover:bg-[#F4F3EF]"
            }`}
          >
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function AnswerRouter({
  items,
}: {
  items?: { icon: string; title: string; sub: string; anchor: string }[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-5">
      <div className="text-[13px] font-semibold text-[#5f5e5a] mb-2.5">What do you need?</div>
      <div className="grid grid-cols-2 gap-2.5">
        {items.slice(0, 4).map((it) => (
          <a
            key={it.anchor}
            href={`#${it.anchor}`}
            className="block bg-card border border-border rounded-2xl p-3.5 hover:border-[#1B6B4A]/40 transition-colors"
          >
            <div className="text-[21px] leading-none">{ICONS[it.icon] || "📄"}</div>
            <div className="text-[14px] font-semibold mt-1.5 text-text">{it.title}</div>
            <div className="text-[11.5px] text-[#5f5e5a] mt-0.5">{it.sub}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function FactTiles({
  facts,
}: {
  facts?: { label: string; value: string }[];
}) {
  if (!facts || facts.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="text-[13px] font-semibold text-[#5f5e5a] mb-2.5">Key facts</div>
      <div className="grid grid-cols-2 gap-2.5">
        {facts.slice(0, 4).map((f) => (
          <div key={f.label} className="bg-[#F4F3EF] rounded-xl px-3.5 py-3">
            <div className="text-[11px] text-[#5f5e5a]">{f.label}</div>
            <div className="text-[17px] font-bold text-[#1B6B4A] leading-tight mt-0.5">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SalaryLead({
  salary,
  posts,
}: {
  salary?: { intro?: string; rows?: { post: string; amount: string }[] };
  posts?: { post: string; in_hand_salary: string; department?: string }[];
}) {
  // Prefer explicit salary_table; else derive from existing major_posts.
  const rows =
    salary?.rows && salary.rows.length > 0
      ? salary.rows
      : (posts || []).map((p) => ({ post: p.post, amount: p.in_hand_salary }));
  if (rows.length === 0) return null;
  return (
    <div id="salary" className="card p-5 mt-5 scroll-mt-16">
      <h2 className="text-[16.5px] font-semibold mb-2.5">Salary (most asked)</h2>
      {salary?.intro && (
        <p className="text-[13.5px] text-[#5f5e5a] leading-[1.75] mb-3">{salary.intro}</p>
      )}
      <table className="w-full border-collapse">
        <tbody>
          {rows.slice(0, 8).map((r, i) => (
            <tr key={i}>
              <td
                className="text-[13px] py-2.5 border-t border-border text-[#5f5e5a]"
                dangerouslySetInnerHTML={{ __html: r.post }}
              />
              <td
                className="text-[13px] py-2.5 border-t border-border text-right font-semibold text-text whitespace-nowrap pl-3"
                dangerouslySetInnerHTML={{ __html: r.amount }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
