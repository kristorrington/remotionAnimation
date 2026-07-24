import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../../components/overlayUI";
import { SourceChip, ChartData } from "../charts";
import { useTheme } from "../../theme";
import { PALETTE } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BAR_COLORS = [PALETTE.opus, PALETTE.fable, PALETTE.sonnet, PALETTE.win];

// Which kind of evidence this is — MUST be shown so internal evals are never
// passed off as independent (CLAUDE.md §15.6).
const KIND = {
  internal: { label: "BRAND'S OWN EVAL", color: PALETTE.cost },
  independent: { label: "INDEPENDENT EVAL", color: PALETTE.win },
  interpretation: { label: "MY READ", color: PALETTE.sonnet },
} as const;

// BenchmarkBar — clean horizontal bars for a benchmark result, ONLY when the
// transcript states an exact value (never fabricate). Theme-correct (ink labels
// on paper) + reuses charts.tsx `SourceChip`, and stamps the evidence class so
// internal ≠ independent. One bar per `chart.data` row (value + unit).
export const BenchmarkBar: React.FC<{
  chart: ChartData;
  sourceType: keyof typeof KIND;
  at?: number;
  width?: number;
}> = ({ chart, sourceType, at = 8, width = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const k = KIND[sourceType];
  const labelW = 190;
  const plotW = width - labelW - 120;
  const max = Math.max(...chart.data.map((d) => d.value)) * 1.08;
  const headOp = interpolate(frame, [0, 10], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: headOp }}>
        {chart.title ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: t.text, transform: "translateZ(0)" }}>{chart.title}</span> : null}
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: "#fff", background: k.color, padding: "6px 14px", borderRadius: 999 }}>{k.label}</span>
      </div>
      <div style={{ width, display: "flex", flexDirection: "column", gap: 16 }}>
        {chart.data.map((d, i) => {
          const color = BAR_COLORS[i % BAR_COLORS.length];
          const e = spring({ frame: frame - at - i * 9, fps, config: { stiffness: 120, damping: 20 }, durationInFrames: 26 });
          const w = Math.max(4, (d.value / max) * plotW * e);
          return (
            <div key={d.label} style={{ display: "flex", alignItems: "center", height: 40 }}>
              <span style={{ width: labelW, textAlign: "right", paddingRight: 20, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: t.textDim, transform: "translateZ(0)" }}>{d.label}</span>
              <div style={{ width: plotW, height: 34, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "rgba(120,112,102,0.2)" }} />
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, borderRadius: 6, background: color, boxShadow: `0 0 14px ${color}55` }} />
                <span style={{ position: "absolute", left: w + 14, top: "50%", transform: "translateY(-50%) translateZ(0)", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: t.text, opacity: interpolate(e, [0.7, 1], [0, 1], CLAMP), whiteSpace: "nowrap" }}>
                  {d.value}
                  {chart.unit ?? ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <SourceChip name={chart.source.name} url={chart.source.url} at={at + 20} />
    </div>
  );
};
