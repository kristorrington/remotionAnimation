import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../../components/overlayUI";
import { useTheme } from "../../theme";
import { PALETTE } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const STEPS = ["Low", "Medium", "High", "X-high", "Max"];

// EffortSelector — a stepped selector (Low · Medium · High · X-high · Max) that
// slides a glowing knob to `value` (CLAUDE.md §15.6). Explains that headline
// performance depends on how much inference effort/cost the model may spend.
// The higher the step, the hotter the accent (effort/cost rises →).
export const EffortSelector: React.FC<{
  value?: number; // target step index 0-4
  at?: number;
  accent?: string;
  labels?: string[];
}> = ({ value = 3, at = 6, accent = PALETTE.opus, labels = STEPS }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = labels.length;
  const trackW = 900;
  const gap = trackW / (n - 1);
  const e = spring({ frame: frame - at, fps, config: { stiffness: 90, damping: 18 }, durationInFrames: 40 });
  const knobStep = interpolate(e, [0, 1], [0, value], CLAMP);
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: accent }}>INFERENCE EFFORT · COST RISES →</span>
      <div style={{ position: "relative", width: trackW, height: 90 }}>
        {/* track */}
        <div style={{ position: "absolute", top: 42, left: 0, width: trackW, height: 6, borderRadius: 3, background: "rgba(120,112,102,0.35)" }} />
        {/* filled portion up to the knob */}
        <div style={{ position: "absolute", top: 42, left: 0, width: knobStep * gap, height: 6, borderRadius: 3, background: accent }} />
        {/* notches + labels */}
        {labels.map((l, i) => {
          const active = i <= Math.round(knobStep);
          return (
            <div key={l} style={{ position: "absolute", top: 0, left: i * gap, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", marginTop: 38, background: active ? accent : "rgba(120,112,102,0.5)", boxShadow: active ? `0 0 12px ${accent}88` : undefined }} />
              <span style={{ fontFamily: FONT, fontWeight: i === Math.round(knobStep) ? 800 : 600, fontSize: 22, color: i === Math.round(knobStep) ? t.text : t.textDim }}>{l}</span>
            </div>
          );
        })}
        {/* the knob */}
        <div style={{ position: "absolute", top: 26, left: knobStep * gap, transform: "translateX(-50%)", width: 38, height: 38, borderRadius: "50%", background: accent, border: "3px solid #fff", boxShadow: `0 6px 18px rgba(31,30,29,0.3), 0 0 24px ${accent}aa` }} />
      </div>
    </div>
  );
};
