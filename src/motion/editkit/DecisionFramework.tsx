import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../../components/overlayUI";
import { glassCard } from "../subjects";
import { PALETTE } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Column = { name: string; use: string; accent: string; highlight?: boolean };

// DecisionFramework — the closing three-column recommendation (CLAUDE.md §15.6).
// Each column reveals on its cue (`revealAts`); the highlighted one (the
// practical middle choice — Opus) reads as the recommendation. Ends on a clean
// held frame. Defaults: SONNET / OPUS / FABLE.
export const DecisionFramework: React.FC<{
  columns?: Column[];
  revealAts?: number[];
  title?: string;
}> = ({
  columns = [
    { name: "SONNET", use: "Routine, high-volume work", accent: PALETTE.sonnet },
    { name: "OPUS", use: "Difficult practical work", accent: PALETTE.opus, highlight: true },
    { name: "FABLE", use: "Highest-stakes autonomous projects", accent: PALETTE.fable },
  ],
  revealAts = [6, 40, 74],
  title = "WHICH ONE?",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = interpolate(frame, [0, 10], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: "rgba(31,30,29,0.55)", opacity: titleOp }}>{title}</span>
      <div style={{ display: "flex", alignItems: "stretch", gap: 30 }}>
        {columns.map((c, i) => {
          const at = revealAts[i] ?? 6 + i * 34;
          const e = spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: 30 });
          const y = interpolate(e, [0, 1], [46, 0]);
          const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
          const hi = c.highlight;
          return (
            <div
              key={c.name}
              style={{
                width: 360,
                padding: hi ? "44px 30px" : "36px 30px",
                borderRadius: 18,
                ...glassCard(c.accent + (hi ? "" : "cc"), hi ? 3 : 2),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                transform: `translateY(${y}px) scale(${hi ? 1.05 : 1})`,
                opacity: op,
                boxShadow: hi ? `0 26px 66px rgba(31,30,29,0.28), 0 0 46px ${c.accent}66` : "0 18px 46px rgba(31,30,29,0.18)",
              }}
            >
              {hi ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, letterSpacing: 2, color: "#fff", background: c.accent, padding: "4px 14px", borderRadius: 999 }}>THE PRACTICAL PICK</span> : null}
              <div style={{ width: 56, height: 6, borderRadius: 3, background: c.accent }} />
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 0.5, color: "#fff", transform: "translateZ(0)" }}>{c.name}</span>
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, lineHeight: 1.25, textAlign: "center", color: hi ? "#fff" : c.accent, transform: "translateZ(0)" }}>{c.use}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
