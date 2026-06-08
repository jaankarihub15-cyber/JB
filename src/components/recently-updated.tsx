"use client";

export function RecentlyUpdatedBadge({ date }: { date: string }) {
  const updated = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - updated.getTime()) / 86400000);

  if (diffDays > 7) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-light text-accent">
      🔄 Updated {diffDays === 0 ? "today" : diffDays === 1 ? "yesterday" : `${diffDays}d ago`}
    </span>
  );
}
