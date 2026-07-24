import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, SERIF } from "../../components/overlayUI";
import { glassCard } from "../subjects";
import { PALETTE } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Model = { name: string; accent: string; tagline?: string };

// A single premium model card (glass sticker) that slides in from its side.
const Card: React.FC<{ model: Model; from: -1 | 1; at: number }> = ({ model, from, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: 30 });
  const x = interpolate(e, [0, 1], [from * 140, 0]);
  const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  return (
    <div
      style={{
        width: 420,
        padding: "38px 34px 34px",
        borderRadius: 20,
        ...glassCard(model.accent + "cc", 2.5),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `translateX(${x}px)`,
        opacity: op,
        boxShadow: `0 24px 60px rgba(31,30,29,0.22), 0 0 40px ${model.accent}44`,
      }}
    >
      <div style={{ width: 64, height: 6, borderRadius: 3, background: model.accent }} />
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 0.5, color: "#fff", transform: "translateZ(0)" }}>{model.name}</span>
      {model.tagline ? (
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: model.accent, textAlign: "center", transform: "translateZ(0)" }}>{model.tagline}</span>
      ) : null}
    </div>
  );
};

// ModelComparison — two clean model cards animate into a side-by-side with a
// serif "vs" between them (CLAUDE.md §15.6). Defaults to Opus (orange) vs Fable
// (purple). Premium and simple — no clutter.
export const ModelComparison: React.FC<{
  left?: Model;
  right?: Model;
  at?: number;
}> = ({ left = { name: "OPUS 5", accent: PALETTE.opus, tagline: "the flagship" }, right = { name: "FABLE 5", accent: PALETTE.fable, tagline: "highest-stakes" }, at = 6 }) => {
  const frame = useCurrentFrame();
  const vsOp = interpolate(frame, [at + 14, at + 24], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 56 }}>
      <Card model={left} from={-1} at={at} />
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 46, fontStyle: "italic", color: "rgba(31,30,29,0.4)", opacity: vsOp }}>vs</span>
      <Card model={right} from={1} at={at + 6} />
    </div>
  );
};
