import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, SERIF } from "../../components/overlayUI";
import { useTheme } from "../../theme";
import { PALETTE } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Prices = { name: string; input: number; output: number; accent: string };

// One price row: the higher figure gets struck through, the lower figure counts
// up in accent — "reducing into" the cheaper price.
const Row: React.FC<{ label: string; higher: number; lower: number; accent: string; at: number }> = ({ label, higher, lower, accent, at }) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const count = Math.round(interpolate(frame, [at, at + 26], [higher, lower], CLAMP));
  const strike = interpolate(frame, [at + 6, at + 22], [0, 1], CLAMP);
  const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: op }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: t.textDim, width: 150, textAlign: "right" }}>{label}</span>
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: "rgba(31,30,29,0.42)" }}>${higher}</span>
        <div style={{ position: "absolute", top: "52%", left: -4, width: `${strike * 108}%`, height: 4, background: PALETTE.danger, borderRadius: 2 }} />
      </div>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: "rgba(31,30,29,0.35)" }}>→</span>
      <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 76, lineHeight: 1, color: accent, transform: "translateZ(0)" }}>${count}</span>
    </div>
  );
};

// PriceComparison — API $/M tokens, the higher model's price REDUCING INTO the
// cheaper one, with a "HALF THE PRICE" payoff (CLAUDE.md §15.6). Prices are
// props (fill from the transcript). Defaults: Fable $10/$50 -> Opus $5/$25.
export const PriceComparison: React.FC<{
  lower?: Prices; // the cheaper model (Opus)
  higher?: Prices; // the pricier model (Fable)
  at?: number;
  payoff?: string;
}> = ({
  lower = { name: "OPUS 5", input: 5, output: 25, accent: PALETTE.opus },
  higher = { name: "FABLE 5", input: 10, output: 50, accent: PALETTE.fable },
  at = 6,
  payoff = "HALF THE PRICE",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = at + 60;
  const s = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15, mass: 0.9 }, durationInFrames: 20 });
  const stampScale = interpolate(s, [0, 1], [1.6, 1]);
  const stampOp = interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: PALETTE.cost }}>API PRICE · PER MILLION TOKENS</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Row label="INPUT" higher={higher.input} lower={lower.input} accent={lower.accent} at={at} />
        <Row label="OUTPUT" higher={higher.output} lower={lower.output} accent={lower.accent} at={at + 12} />
      </div>
      <div
        style={{
          marginTop: 8,
          padding: "12px 30px",
          borderRadius: 12,
          background: lower.accent,
          transform: `rotate(-2deg) scale(${stampScale})`,
          opacity: stampOp,
          boxShadow: `0 14px 40px ${lower.accent}66`,
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 1, color: "#fff" }}>{payoff}</span>
      </div>
    </div>
  );
};
