export function CalcHero({
  icon,
  title,
  tagline,
  chips,
  updated,
}: {
  icon: string;
  title: string;
  tagline: string;
  chips?: string[];
  updated?: string;
}) {
  return (
    <div className="mt-4 mb-6 bg-card border border-border rounded-3xl p-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-3xl shrink-0">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">{title}</h1>
          {updated && <p className="text-xs text-text-muted mt-1">Updated: {updated} · By Ash K.</p>}
        </div>
      </div>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{tagline}</p>
      {chips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent-light text-accent-dark"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
