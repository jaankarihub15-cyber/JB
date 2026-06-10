import Link from "next/link";

// Theme V2 full-bleed hero band: badges, title, byline, floating amount card.
// Server component. Pulls only verified data from the page's own hero fields.
export function HeroV2({
  title,
  subtitle,
  badge,
  updatedDate,
  primaryStat,
  quickActions,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  updatedDate?: string;
  primaryStat?: { label: string; value: string; sub?: string };
  quickActions?: { label: string; href: string; primary?: boolean }[];
}) {
  return (
    <div className="py-9 md:py-12">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {badge && (
          <span className="text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#DFF3E8]">
            {badge}
          </span>
        )}
        {updatedDate && (
          <span className="text-[10.5px] font-extrabold tracking-wider px-3 py-1.5 rounded-full bg-[#E8A33D] text-[#3D2A07] uppercase">
            Updated {updatedDate}
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
        <div>
          <h1 className="text-[26px] md:text-[34px] font-extrabold leading-[1.2] tracking-[-0.5px] mb-3">
            {title}
          </h1>
          <p className="hero-sub text-[15px] leading-relaxed max-w-[560px] mb-5">{subtitle}</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#9FE2BE] text-[#0F3D2A] flex items-center justify-center font-extrabold text-[13px]">
              A
            </div>
            <div className="text-[12.5px] leading-tight">
              <b className="text-white">Ash K.</b>
              <br />
              <span className="text-[#8FB8A2]">{updatedDate ? `Updated ${updatedDate}` : ""}</span>
            </div>
          </div>
        </div>

        {primaryStat && (
          <div className="bg-white rounded-[20px] p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)] relative mt-2 md:mt-0">
            <div className="text-[10px] font-extrabold tracking-[0.1em] text-[#8a978d] uppercase mb-1.5">
              {primaryStat.label}
            </div>
            <div className="text-[26px] font-extrabold text-[#0E2418] leading-tight">
              {primaryStat.value}
            </div>
            {primaryStat.sub && (
              <div className="text-[12px] text-[#67786D] mt-1">{primaryStat.sub}</div>
            )}
            {quickActions && quickActions.length > 0 && (
              <div className="grid gap-2 mt-4">
                {quickActions.map((qa) => (
                  <Link
                    key={qa.href}
                    href={qa.href}
                    className={
                      qa.primary
                        ? "flex items-center justify-center gap-2 rounded-[11px] px-3 py-3 text-[13.5px] font-extrabold bg-[#1B6B4A] text-white hover:bg-[#0F3D2A] transition-colors"
                        : "flex items-center justify-center gap-2 rounded-[11px] px-3 py-3 text-[13.5px] font-extrabold bg-[#EDF6F0] text-[#0F3D2A] border border-[#CDE5D6] hover:bg-[#E0EFE6] transition-colors"
                    }
                  >
                    {qa.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
