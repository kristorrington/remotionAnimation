import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, FONT, PILL_BORDER, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Local sync points (Sequence starts at f522):
//   "add tasks to a web app"      f527 -> 5
//   "work through a movie site"   f634 -> 112
//   "check a live Amazon listing" f694 -> 172
const CARDS = [
  { n: "1", title: "Add tasks", sub: "to a web app", at: 5 },
  { n: "2", title: "Work through", sub: "a messy movie site", at: 112 },
  { n: "3", title: "Check a listing", sub: "live on Amazon", at: 172 },
];

// f522–805 — "by the end Hermes Agent will ... a web app ... movie site ... Amazon"
export const DemoPreview: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: CYAN, opacity: headOpacity, filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}>
          BY THE END, HERMES WILL
        </span>

        <div style={{ display: "flex", gap: 34 }}>
          {CARDS.map((c) => {
            const e = spring({ frame: frame - c.at, fps, config: { stiffness: 220, damping: 17, mass: 0.7 }, durationInFrames: 16 });
            const scale = interpolate(e, [0, 1], [0.5, 1]);
            const y = interpolate(e, [0, 1], [40, 0]);
            const op = interpolate(frame, [c.at, c.at + 8], [0, 1], CLAMP);
            return (
              <div
                key={c.n}
                style={{
                  width: 360,
                  height: 300,
                  borderRadius: 22,
                  background: "rgba(8,12,20,0.78)",
                  border: PILL_BORDER,
                  boxShadow: "0 22px 60px rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 22,
                  opacity: op,
                  transform: `translateY(${y}px) scale(${scale})`,
                }}
              >
                <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: WHITE, boxShadow: `0 0 26px rgba(59,130,246,0.6)` }}>
                  {c.n}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: WHITE }}>{c.title}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 26, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>{c.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
