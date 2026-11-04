import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const TAGS = ["Sistemas web", "Aplicativos", "Sites", "Integrações", "IA"];

// Imagem de compartilhamento (Open Graph) padrão do site, gerada no build.
export function renderOgCard({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #2a3a8f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Topologia decorativa */}
        <div style={{ position: "absolute", top: 70, right: 80, display: "flex", gap: 18 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: i === 0 ? "#7b93ff" : "rgba(123,147,255,0.35)",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 44, background: "#516CF8", borderRadius: 4 }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Peluga Labs</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 28, color: "#9fb0ff", fontWeight: 600 }}>{eyebrow}</div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {TAGS.map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 24,
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#e2e8f0",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize
  );
}
