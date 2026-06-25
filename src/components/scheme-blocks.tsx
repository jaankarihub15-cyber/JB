import {
  CheckCircle2, XCircle, Check, X, ChevronRight, AlertTriangle,
  Info, Lightbulb, Wallet, Users, Calendar, TrendingUp,
  ShieldCheck, FileText, ArrowRight, Trophy, Sparkles,
  type LucideIcon,
} from "lucide-react";

// ============== SHARED TYPES ==============
type IconKey =
  | "wallet" | "users" | "calendar" | "trending" | "shield" | "file"
  | "check" | "x" | "info" | "alert" | "trophy" | "sparkles" | "arrow"
  | "lightbulb";

const ICONS: Record<IconKey, LucideIcon> = {
  wallet: Wallet,
  users: Users,
  calendar: Calendar,
  trending: TrendingUp,
  shield: ShieldCheck,
  file: FileText,
  check: CheckCircle2,
  x: XCircle,
  info: Info,
  alert: AlertTriangle,
  trophy: Trophy,
  sparkles: Sparkles,
  arrow: ArrowRight,
  lightbulb: Lightbulb,
};

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  // Allow emoji passthrough (any non-keyword string)
  if (!(name in ICONS)) {
    return <span className={className}>{name}</span>;
  }
  const Cmp = ICONS[name as IconKey];
  return <Cmp className={className} />;
}

// ============== 1. STAT GRID ==============
// {type:"stat_grid", items:[{icon:"wallet",value:"₹15,000",label:"Per child/year",color:"green"}]}
export function StatGrid({ items }: {
  items: Array<{ icon?: string; value: string; label: string; color?: "green" | "blue" | "amber" | "pink" | "purple" }>;
}) {
  const colorMap = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    pink: "bg-pink-50 border-pink-200 text-pink-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4">
      {items.map((s, i) => {
        const color = colorMap[s.color || "green"];
        return (
          <div key={i} className={`rounded-xl border p-3.5 ${color}`}>
            {s.icon && (
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-2">
                <Icon name={s.icon} className="w-4 h-4" />
              </div>
            )}
            <div className="text-base font-extrabold leading-tight">{s.value}</div>
            <div className="text-xs text-gray-600 mt-0.5 font-semibold">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ============== 2. ELIGIBILITY CHECK ==============
// {type:"eligibility_check", qualify:[...], disqualify:[...]}
export function EligibilityCheck({ qualify, disqualify, heading }: {
  qualify: string[];
  disqualify: string[];
  heading?: string;
}) {
  return (
    <div className="my-4">
      {heading && <h3 className="text-base font-bold mb-3">{heading}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl p-4 bg-green-50 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-3 font-bold text-sm text-green-800">
            <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
            You qualify if
          </div>
          <ul className="space-y-1.5">
            {qualify.map((q, i) => (
              <li key={i} className="text-sm pl-6 relative leading-snug text-gray-800">
                <span className="absolute left-0 top-1 w-3.5 h-3.5 bg-green-600 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></span>
                {q}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-4 bg-red-50 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-3 font-bold text-sm text-red-700">
            <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center"><X className="w-3.5 h-3.5" /></span>
            You won't qualify if
          </div>
          <ul className="space-y-1.5">
            {disqualify.map((q, i) => (
              <li key={i} className="text-sm pl-6 relative leading-snug text-gray-800">
                <span className="absolute left-0 top-1 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center"><X className="w-2.5 h-2.5 text-white" /></span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============== 3. PROCESS FLOW ==============
// {type:"process_flow", steps:[{icon:"shield",title:"Aadhaar",desc:"..."}]}
export function ProcessFlow({ steps, heading }: {
  steps: Array<{ icon?: string; title: string; desc?: string }>;
  heading?: string;
}) {
  return (
    <div className="my-4">
      {heading && <h3 className="text-base font-bold mb-3">{heading}</h3>}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(steps.length, 4)} gap-2 md:gap-0 relative`}>
        {steps.map((s, i) => (
          <div key={i} className="relative bg-white border-2 border-green-200 rounded-xl p-3.5 text-center">
            <div className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-extrabold mx-auto mb-2">
              {i + 1}
            </div>
            {s.icon && (
              <div className="text-2xl mb-1.5 flex justify-center">
                <Icon name={s.icon} className="w-6 h-6 text-green-700" />
              </div>
            )}
            <div className="text-xs font-bold leading-tight">{s.title}</div>
            {s.desc && <div className="text-[11px] text-gray-500 mt-1 leading-snug">{s.desc}</div>}
            {i < steps.length - 1 && (
              <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 bg-white rounded-full z-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== 4. ICON LIST ==============
// {type:"icon_list", items:[{icon:"file",title:"Aadhaar",sub:"Bank-linked"}]}
export function IconList({ items, heading }: {
  items: Array<{ icon?: string; title: string; sub?: string }>;
  heading?: string;
}) {
  return (
    <div className="my-4">
      {heading && <h3 className="text-base font-bold mb-3">{heading}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
            {it.icon && (
              <div className="flex-shrink-0 w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                <Icon name={it.icon} className="w-4 h-4 text-green-700" />
              </div>
            )}
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight">{it.title}</div>
              {it.sub && <div className="text-xs text-gray-500 mt-0.5">{it.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== 5. TIMELINE ==============
// {type:"timeline", items:[{date:"JAN 11",event:"...",desc:"..."}]}
export function Timeline({ items, heading }: {
  items: Array<{ date: string; event: string; desc?: string }>;
  heading?: string;
}) {
  return (
    <div className="my-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
      {heading && (
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">{heading}</h4>
      )}
      <div>
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <div key={i} className={`relative pl-7 ${isLast ? "" : "pb-3.5"}`}>
              {!isLast && <span className="absolute left-2 top-1.5 bottom-0 w-0.5 bg-green-200" />}
              <span className="absolute left-0 top-1.5 w-3 h-3 bg-green-600 rounded-full ring-2 ring-white shadow-[0_0_0_2px_#16a34a]" />
              <div className="text-xs font-extrabold text-green-700">{it.date}</div>
              <div className="text-sm font-semibold leading-tight">{it.event}</div>
              {it.desc && <div className="text-xs text-gray-500 mt-0.5">{it.desc}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============== 6. COMPARISON CARD ==============
// {type:"comparison_card", heading:"...", win:{name,amount,sub}, others:[{name,amount,sub}]}
export function ComparisonCard({ heading, win, others }: {
  heading?: string;
  win: { name: string; amount: string; sub?: string };
  others: Array<{ name: string; amount: string; sub?: string }>;
}) {
  return (
    <div className="my-4 bg-gradient-to-br from-green-800 to-green-600 rounded-2xl p-5 text-white">
      {heading && <h3 className="text-sm font-bold opacity-90 mb-3">{heading}</h3>}
      <div className="grid grid-cols-2 gap-px bg-white/20 rounded-xl overflow-hidden">
        <div className="bg-white/20 backdrop-blur p-3.5">
          <div className="text-[10px] font-bold tracking-wide opacity-80">{win.name} <span className="text-amber-300">· YOURS</span></div>
          <div className="text-2xl font-extrabold leading-tight mt-1">{win.amount}</div>
          {win.sub && <div className="text-[11px] opacity-75 mt-0.5">{win.sub}</div>}
        </div>
        {others.slice(0, 3).map((o, i) => (
          <div key={i} className="bg-white/5 p-3.5">
            <div className="text-[10px] font-bold tracking-wide opacity-70">{o.name}</div>
            <div className="text-xl font-extrabold leading-tight mt-1">{o.amount}</div>
            {o.sub && <div className="text-[11px] opacity-65 mt-0.5">{o.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== 7. BAR CHART ==============
// {type:"bar_chart", heading, rows:[{label,value:6300,display:"₹6,300 Cr"}]}
export function BarChart({ rows, heading, suffix }: {
  rows: Array<{ label: string; value: number; display?: string }>;
  heading?: string;
  suffix?: string;
}) {
  const max = Math.max(...rows.map(r => r.value));
  return (
    <div className="my-4 bg-white border border-gray-200 rounded-xl p-4">
      {heading && (
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">{heading}</h4>
      )}
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="text-xs font-bold min-w-[80px]">{r.label}</div>
            <div className="flex-1 bg-gray-100 rounded h-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-700 to-green-500 rounded flex items-center px-2.5 text-white text-xs font-bold transition-all"
                style={{ width: `${Math.max((r.value / max) * 100, 18)}%` }}
              >
                {r.display || `${r.value}${suffix || ""}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== 8. NUMBER HIGHLIGHT ==============
// {type:"number_highlight", big:"₹19,617 Cr", title:"...", desc:"..."}
export function NumberHighlight({ big, title, desc }: {
  big: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="my-4 bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
      <div className="text-3xl sm:text-4xl font-extrabold text-amber-900 leading-none flex-shrink-0 text-center sm:min-w-[140px]">{big}</div>
      <div className="flex-1 text-center sm:text-left">
        <h4 className="text-sm font-extrabold text-amber-900 mb-1">{title}</h4>
        {desc && <p className="text-xs text-amber-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />}
      </div>
    </div>
  );
}

// ============== 9. MODERN CALLOUT ==============
// {type:"modern_callout", variant:"warning"|"info", title:"...", content:"..."}
export function ModernCallout({ variant, title, content, icon }: {
  variant?: "warning" | "info" | "tip";
  title: string;
  content: string;
  icon?: string;
}) {
  const styles = {
    warning: { bg: "bg-amber-50", border: "border-amber-300", iconBg: "bg-amber-500", titleColor: "text-amber-900", textColor: "text-amber-800", defaultIcon: "alert" },
    info: { bg: "bg-blue-50", border: "border-blue-300", iconBg: "bg-blue-500", titleColor: "text-blue-900", textColor: "text-blue-800", defaultIcon: "info" },
    tip: { bg: "bg-green-50", border: "border-green-300", iconBg: "bg-green-600", titleColor: "text-green-900", textColor: "text-green-800", defaultIcon: "lightbulb" },
  };
  const s = styles[variant || "info"];
  return (
    <div className={`my-4 flex gap-3 p-4 rounded-xl border ${s.bg} ${s.border} items-start`}>
      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white ${s.iconBg}`}>
        <Icon name={icon || s.defaultIcon} className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className={`text-sm font-extrabold mb-1 ${s.titleColor}`}>{title}</div>
        <p className={`text-xs leading-relaxed ${s.textColor}`} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

// ============== 10. QUICK ACTION GRID ==============
// {type:"quick_action_grid", items:[{icon,label,sub,url}]}
export function QuickActionGrid({ items }: {
  items: Array<{ icon?: string; label: string; sub?: string; url?: string }>;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 my-4">
      {items.map((q, i) => {
        const Tag = q.url ? "a" : "div";
        return (
          // @ts-ignore
          <Tag
            key={i}
            href={q.url}
            target={q.url?.startsWith("http") ? "_blank" : undefined}
            rel={q.url?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="bg-white border-2 border-gray-200 hover:border-green-600 hover:-translate-y-0.5 rounded-xl p-3.5 text-center transition-all cursor-pointer block"
          >
            {q.icon && (
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name={q.icon} className="w-4 h-4 text-green-700" />
              </div>
            )}
            <div className="text-xs font-bold">{q.label}</div>
            {q.sub && <div className="text-[11px] text-gray-500 mt-0.5">{q.sub}</div>}
          </Tag>
        );
      })}
    </div>
  );
}

// ============== DISPATCHER ==============
// Pass an extra_section object, this renders the right component
export function SchemeBlock({ section }: { section: any }) {
  switch (section.type) {
    case "stat_grid":
      return <StatGrid items={section.items} />;
    case "eligibility_check":
      return <EligibilityCheck qualify={section.qualify} disqualify={section.disqualify} heading={section.heading} />;
    case "process_flow":
      return <ProcessFlow steps={section.steps} heading={section.heading} />;
    case "icon_list":
      return <IconList items={section.items} heading={section.heading} />;
    case "timeline":
      return <Timeline items={section.items} heading={section.heading} />;
    case "comparison_card":
      return <ComparisonCard heading={section.heading} win={section.win} others={section.others} />;
    case "bar_chart":
      return <BarChart rows={section.rows} heading={section.heading} suffix={section.suffix} />;
    case "number_highlight":
      return <NumberHighlight big={section.big} title={section.title} desc={section.desc} />;
    case "modern_callout":
      return <ModernCallout variant={section.variant} title={section.title} content={section.content} icon={section.icon} />;
    case "quick_action_grid":
      return <QuickActionGrid items={section.items} />;
    default:
      return null;
  }
}
