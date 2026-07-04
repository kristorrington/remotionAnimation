import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DROP_SHADOW, FONT, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREEN = "#34D399";
const AMBER = "#F59E0B";

type Side = { title: string; items: string[]; accent: string; mark: string };

const Column: React.FC<{ side: Side; delay: number; from: "left" | "right" }> = ({ side, delay, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { stiffness: 150, damping: 19, mass: 0.8 }, durationInFrames: 16 });
  const x = interpolate(enter, [0, 1], [from === "left" ? -50 : 50, 0]);
  const op = interpolate(frame, [delay, delay + 10], [0, 1], CLAMP);
  return (
    <div style={{ width: 560, opacity: op, transform: `translateX(${x}px)`, padding: "30px 34px", borderRadius: 22, background: "rgba(8,12,20,0.85)", border: `1px solid ${side.accent}`, filter: DROP_SHADOW, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: "50%", background: side.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: "#04121f" }}>{side.mark}</span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: WHITE }}>{side.title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {side.items.map((it, i) => {
          const at = delay + 16 + i * 12;
          const o = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
          return (
            <div key={it} style={{ display: "flex", alignItems: "center", gap: 14, opacity: o }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: side.accent, boxShadow: `0 0 8px ${side.accent}` }} />
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.9)" }}>{it}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Two-column comparison card (e.g. simple vs complex, use vs avoid).
export const CompareCard: React.FC<{
  kicker?: string;
  left: { title: string; items: string[]; accent?: string; mark?: string };
  right: { title: string; items: string[]; accent?: string; mark?: string };
  leftDelay?: number;
  rightDelay?: number;
  durationInFrames: number;
}> = ({ kicker, left, right, leftDelay = 8, rightDelay = 22, durationInFrames }) => {
  const frame = useCurrentFrame();
  const kOp = interpolate(frame, [0, 12], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        {kicker ? <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: "#06B6D4", opacity: kOp, filter: DROP_SHADOW }}>{kicker}</span> : null}
        <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
          <Column side={{ title: left.title, items: left.items, accent: left.accent ?? GREEN, mark: left.mark ?? "✓" }} delay={leftDelay} from="left" />
          <Column side={{ title: right.title, items: right.items, accent: right.accent ?? AMBER, mark: right.mark ?? "!" }} delay={rightDelay} from="right" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
