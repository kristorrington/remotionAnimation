import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";

// ============================================================================
// NATIVE CHART KIT — recreate benchmark/pricing charts from PUBLIC DATA in the
// project style (CLAUDE.md §10.3) instead of screenshotting someone else's.
// Follows the dataviz method adapted to video: form first; categorical hues in
// FIXED order (never cycled); one axis; thin marks with rounded data-ends and
// 2px surface gaps; values as direct labels in ink (never series-colored text);
// recessive baseline; legend chips for ≥2 series. Palette note: the brand hues
// run brighter than the tile-chart lightness band — legal here because every
// mark carries a direct label + gaps (identity is never color-alone).
// Charts read data passed as props; keep the numbers in
// public/assets/external/charts/*.json with sourceUrl (data-as-assets) and
// render a SourceChip so the citation travels with the chart.
// ============================================================================

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WHITE = "#FFFFFF";
const INK_MUTED = "rgba(255,255,255,0.62)";
const TRACK = "rgba(255,255,255,0.09)";
const BASELINE = "rgba(255,255,255,0.22)";
// fixed categorical order — never cycled, never re-ranked by value
export const CHART_COLORS = ["#D97757", "#C15F3C", "#C9913D", "#4FA98A"] as const;

export type ChartDatum = { label: string; value: number; series?: string };
export type ChartData = {
  title?: string;
  unit?: string; // e.g. "%", "ms", "$/M tokens"
  source: { name: string; url?: string | null }; // null = record the URL when known
  data: ChartDatum[];
};

// The citation chip that travels with every recreated chart (§10.3).
export const SourceChip: React.FC<{ name: string; url?: string | null; at?: number }> = ({ name, url, at = 10 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 10], [0, 0.9], CLAMP);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, opacity: op, padding: "5px 14px", borderRadius: 999, background: "rgba(20,16,13,0.8)", border: "1px solid rgba(255,255,255,0.16)", transform: "translateZ(0)" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: CHART_COLORS[0] }} />
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, color: INK_MUTED }}>Source: {name}{url ? ` — ${url.replace(/^https?:\/\//, "").split("/")[0]}` : ""}</span>
    </div>
  );
};

const LegendChip: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
    <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: INK_MUTED }}>{label}</span>
  </span>
);

// Horizontal bars that GROW IN from the baseline, one after another. Direct
// value labels ride the bar ends. Groups (same label, multiple series) sit as
// adjacent thin bars with a 2px surface gap; series get legend chips.
export const BarsIn: React.FC<{ chart: ChartData; width?: number; at?: number; maxValue?: number; barH?: number }> = ({ chart, width = 900, at = 8, maxValue, barH = 34 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels = [...new Set(chart.data.map((d) => d.label))];
  const seriesNames = [...new Set(chart.data.map((d) => d.series ?? ""))];
  const multi = seriesNames.length > 1;
  const max = maxValue ?? Math.max(...chart.data.map((d) => d.value)) * 1.08;
  const labelW = 190;
  const plotW = width - labelW - 130;
  let row = 0;
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 14 }}>
      {chart.title ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: WHITE, transform: "translateZ(0)" }}>{chart.title}</span> : null}
      {multi && (
        <div style={{ display: "flex", gap: 24 }}>
          {seriesNames.map((s, i) => <LegendChip key={s} label={s} color={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </div>
      )}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: multi ? 18 : 12 }}>
        {/* recessive baseline */}
        <div style={{ position: "absolute", left: labelW, top: 0, bottom: 0, width: 2, background: BASELINE }} />
        {labels.map((label) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {chart.data.filter((d) => d.label === label).map((d) => {
              const si = seriesNames.indexOf(d.series ?? "");
              const color = CHART_COLORS[si % CHART_COLORS.length];
              const e = spring({ frame: frame - at - row++ * 9, fps, config: { stiffness: 120, damping: 20 }, durationInFrames: 26 });
              const w = Math.max(4, (d.value / max) * plotW * e);
              return (
                <div key={`${label}-${d.series}`} style={{ display: "flex", alignItems: "center", height: barH }}>
                  <span style={{ width: labelW - 16, textAlign: "right", paddingRight: 16, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: INK_MUTED, transform: "translateZ(0)" }}>
                    {multi ? (si === 0 ? label : "") : label}
                  </span>
                  <div style={{ width: plotW, height: barH - 6, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: TRACK }} />
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, borderRadius: 4, background: color, boxShadow: `0 0 12px ${color}66` }} />
                    <span style={{ position: "absolute", left: w + 12, top: "50%", transform: "translateY(-50%) translateZ(0)", fontFamily: FONT, fontWeight: 800, fontSize: 23, color: WHITE, opacity: interpolate(e, [0.7, 1], [0, 1], CLAMP), whiteSpace: "nowrap" }}>
                      {d.value}{chart.unit ?? ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <SourceChip name={chart.source.name} url={chart.source.url} at={at + 20} />
    </div>
  );
};

// A line that DRAWS ON left→right (single hue = magnitude over time), with ≥8px
// markers and a direct end label. One axis, recessive grid.
export const LineDraw: React.FC<{ chart: ChartData; width?: number; height?: number; at?: number; endLabel?: string }> = ({ chart, width = 900, height = 380, at = 8, endLabel }) => {
  const frame = useCurrentFrame();
  const pts = chart.data;
  const max = Math.max(...pts.map((d) => d.value)) * 1.1;
  const min = Math.min(0, ...pts.map((d) => d.value));
  const plotW = width - 90;
  const plotH = height - 90;
  const x = (i: number) => 50 + (i / (pts.length - 1)) * plotW;
  const y = (v: number) => 30 + plotH - ((v - min) / (max - min)) * plotH;
  const t = interpolate(frame, [at, at + 44], [0, 1], { ...CLAMP, easing: (v) => 1 - (1 - v) * (1 - v) });
  const path = pts.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`).join(" ");
  const totalLen = plotW * 1.5; // generous overestimate for dash draw-on
  const color = CHART_COLORS[0];
  const shownPts = Math.floor(t * (pts.length - 1) + 0.0001);
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 12 }}>
      {chart.title ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: WHITE, transform: "translateZ(0)" }}>{chart.title}</span> : null}
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {/* recessive horizontal grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={50} x2={50 + plotW} y1={30 + plotH * g} y2={30 + plotH * g} stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
        ))}
        <line x1={50} x2={50 + plotW} y1={30 + plotH} y2={30 + plotH} stroke={BASELINE} strokeWidth={2} />
        <path d={path} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={totalLen} strokeDashoffset={totalLen * (1 - t)} style={{ filter: `drop-shadow(0 0 10px ${color}66)` }} />
        {pts.map((d, i) => i <= shownPts && (
          <circle key={i} cx={x(i)} cy={y(d.value)} r={6} fill="#0B0F17" stroke={color} strokeWidth={3.5} />
        ))}
        {/* x labels */}
        {pts.map((d, i) => (
          <text key={`l-${i}`} x={x(i)} y={30 + plotH + 30} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={19} fill={INK_MUTED}>{d.label}</text>
        ))}
        {/* direct end label */}
        {t > 0.98 && (
          <text x={x(pts.length - 1) + 14} y={y(pts[pts.length - 1].value) + 7} fontFamily={FONT} fontWeight={800} fontSize={24} fill={WHITE}>
            {endLabel ?? `${pts[pts.length - 1].value}${chart.unit ?? ""}`}
          </text>
        )}
      </svg>
      <SourceChip name={chart.source.name} url={chart.source.url} at={at + 30} />
    </div>
  );
};

// A donut that FILLS to a single share/percent — for one headline proportion
// (not a multi-slice pie; more than ~2 parts belongs in bars).
export const DonutFill: React.FC<{ value: number; max?: number; label: string; size?: number; at?: number; color?: string; source?: { name: string; url?: string } }> = ({ value, max = 100, label, size = 300, at = 8, color = CHART_COLORS[0], source }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 60, damping: 20 }, durationInFrames: 46 });
  const frac = (value / max) * e;
  const r = 42;
  const dash = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={r} stroke={TRACK} strokeWidth={10} fill="none" />
          <circle cx={50} cy={50} r={r} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={`${dash * frac} ${dash}`} transform="rotate(-90 50 50)" style={{ filter: `drop-shadow(0 0 8px ${color}88)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: size * 0.21, color: WHITE, transform: "translateZ(0)" }}>{Math.round((value * e) as number)}%</span>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 0.065, letterSpacing: 2, color: INK_MUTED, transform: "translateZ(0)" }}>{label}</span>
        </div>
      </div>
      {source ? <SourceChip name={source.name} url={source.url} at={at + 26} /> : null}
    </div>
  );
};

// Bars that ANIMATE BETWEEN SNAPSHOTS (before → after): widths tween and rows
// swap rank positions. For "the ranking changed" beats.
export const BarRace: React.FC<{ before: ChartData; after: ChartData; switchAt: number; width?: number; barH?: number }> = ({ before, after, switchAt, width = 900, barH = 40 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [switchAt, switchAt + 34], [0, 1], { ...CLAMP, easing: (v) => v * v * (3 - 2 * v) });
  const labels = before.data.map((d) => d.label);
  const val = (label: string) => {
    const a = before.data.find((d) => d.label === label)?.value ?? 0;
    const b = after.data.find((d) => d.label === label)?.value ?? a;
    return a + (b - a) * t;
  };
  const rankOf = (label: string, data: ChartDatum[]) => [...data].sort((p, q) => q.value - p.value).findIndex((d) => d.label === label);
  const max = Math.max(...before.data.map((d) => d.value), ...after.data.map((d) => d.value)) * 1.08;
  const labelW = 190;
  const plotW = width - labelW - 130;
  const rowH = barH + 14;
  return (
    <div style={{ width, position: "relative", height: labels.length * rowH }}>
      {labels.map((label, i) => {
        const y = (rankOf(label, before.data) + (rankOf(label, after.data) - rankOf(label, before.data)) * t) * rowH;
        const v = val(label);
        const color = CHART_COLORS[i % CHART_COLORS.length]; // color follows the ENTITY, not its rank
        const w = Math.max(4, (v / max) * plotW);
        return (
          <div key={label} style={{ position: "absolute", left: 0, top: y, display: "flex", alignItems: "center", height: barH }}>
            <span style={{ width: labelW - 16, textAlign: "right", paddingRight: 16, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: INK_MUTED, transform: "translateZ(0)" }}>{label}</span>
            <div style={{ width: plotW, height: barH - 8, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: TRACK }} />
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, borderRadius: 4, background: color, boxShadow: `0 0 12px ${color}66` }} />
              <span style={{ position: "absolute", left: w + 12, top: "50%", transform: "translateY(-50%) translateZ(0)", fontFamily: FONT, fontWeight: 800, fontSize: 23, color: WHITE, whiteSpace: "nowrap" }}>{Math.round(v)}{before.unit ?? ""}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
