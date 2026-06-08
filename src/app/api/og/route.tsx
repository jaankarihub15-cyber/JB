import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const catColors: Record<string, { bg: string; accent: string; label: string }> = {
  yojana: { bg: "#0F3D2B", accent: "#2ECC71", label: "Government Scheme" },
  exam: { bg: "#1A2744", accent: "#3498DB", label: "Competitive Exam" },
  paisa: { bg: "#3D2B0F", accent: "#E67E22", label: "Financial Literacy" },
  guide: { bg: "#2B1A3D", accent: "#9B59B6", label: "How-To Guide" },
  compare: { bg: "#0F2B3D", accent: "#1ABC9C", label: "Smart Comparison" },
  calculator: { bg: "#1B4332", accent: "#2ECC71", label: "Financial Calculator" },
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "KnowledgeKendra";
  const icon = searchParams.get("icon") || "📋";
  const cat = searchParams.get("cat") || "yojana";

  const colors = catColors[cat] || catColors.yojana;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: `linear-gradient(135deg, ${colors.bg} 0%, #000000 100%)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: Category badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              background: colors.accent,
              color: "#000",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {colors.label}
          </div>
        </div>

        {/* Center: Icon + Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "72px" }}>{icon}</div>
          <div
            style={{
              fontSize: title.length > 40 ? "44px" : "52px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: Branding */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 800,
                color: "#000",
              }}
            >
              J
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#FFFFFF",
                opacity: 0.9,
              }}
            >
              KnowledgeKendra.com
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#FFFFFF",
              opacity: 0.5,
            }}
          >
            Schemes • Exams • Finance
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
