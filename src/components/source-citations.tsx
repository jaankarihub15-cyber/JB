import Link from "next/link";

type SourceLink = {
  label: string;
  url: string;
};

export function SourceCitations({ sources, methodology = true }: { sources?: SourceLink[]; methodology?: boolean }) {
  return (
    <div className="mt-8 mb-4 p-5 bg-card-alt border border-border rounded-2xl">
      <p className="text-sm font-bold text-text mb-3 flex items-center gap-2">📋 Official Sources & Verification</p>
      {sources && sources.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {sources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1.5">
              <span className="text-text-muted">→</span> {s.label}
            </a>
          ))}
        </div>
      )}
      {methodology && (
        <p className="text-xs text-text-muted leading-relaxed">
          Information verified against official government portals and gazette notifications.{" "}
          <Link href="/about#methodology" className="text-accent underline">Read our editorial process</Link>.
        </p>
      )}
    </div>
  );
}
