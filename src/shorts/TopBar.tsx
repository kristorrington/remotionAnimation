import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";

// Retention furniture pinned to the top: a progress bar (completion nudge) with
// beat MILESTONE ticks (visible pacing — the viewer sees beats coming) and a
// small persistent "what this is about" topic banner. Themed via useTheme().
export const TopBar: React.FC<{ topic: string; beats?: number[] }> = ({ topic, beats }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = useTheme();
  const bold = t.name === "bold";
  const progress = interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* progress track, fill, then milestone ticks on top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, height: 8, width: `${progress}%`, background: t.accent, boxShadow: t.glow ? `0 0 16px ${t.accent}` : undefined }} />
      {(beats ?? []).map((p, i) => {
        const passed = progress / 100 >= p;
        return <div key={i} style={{ position: "absolute", top: 0, left: `${p * 100}%`, width: 4, height: 8, background: passed ? "rgba(20,16,13,0.85)" : "rgba(255,255,255,0.4)" }} />;
      })}
      {/* topic banner */}
      <div style={{ position: "absolute", top: 34, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 28px",
            borderRadius: bold ? 8 : 999,
            background: "rgba(20,16,13,0.74)",
            border: bold ? `2px solid ${t.accent}` : "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: t.accent, boxShadow: t.glow ? `0 0 12px ${t.accent}` : undefined }} />
          <span style={{ fontFamily: bold ? t.fontKicker : t.fontBody, fontWeight: 800, fontSize: 29, letterSpacing: 3, color: t.text, textTransform: "uppercase" }}>{topic}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
