import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, CYAN, WHITE } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const StepRow: React.FC<{ n: number; label: string; at: number; accent: string; last: boolean }> = ({ n, label, at, accent, last }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 210, damping: 18, mass: 0.7 }, durationInFrames: 16 });
  const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  const x = interpolate(e, [0, 1], [-40, 0]);
  const rail = interpolate(frame, [at + 8, at + 26], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: op, transform: `translateX(${x}px)` }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", background: `${accent}22`, border: `3px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${accent}55`, transform: `scale(${interpolate(e, [0, 1], [0.4, 1])})` }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: WHITE }}>{n}</span>
        </div>
        {!last && <div style={{ position: "absolute", top: 62, width: 4, height: 40 * rail, background: `${accent}66` }} />}
      </div>
      <div style={{ padding: "18px 30px", borderRadius: 14, background: "rgba(12,18,30,0.9)", border: `1px solid ${accent}44`, minWidth: 560, boxShadow: `0 14px 34px rgba(0,0,0,0.4)` }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: WHITE }}>{label}</span>
      </div>
    </div>
  );
};

// A process / checklist as an animated numbered timeline (rail grows between
// steps) — for "draft → verify" and "measure 3 things", not a bullet list.
export const StepsScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; steps: { label: string; at: number }[]; accent?: string; titleSize?: number }> = ({
  durationInFrames,
  kicker,
  title,
  steps,
  accent = CYAN,
  titleSize = 84,
}) => {
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x5e}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={titleSize} accent={accent} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          {steps.map((s, i) => (
            <StepRow key={s.label} n={i + 1} label={s.label} at={s.at} accent={accent} last={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
