import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, DROP_SHADOW, FONT, PILL_BORDER, WHITE } from "./overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Step = { text: string; at: number };

// A right-side panel whose steps appear and check off as the agent works through
// them — `at` is the local frame each step is reached. Transparent annotation.
export const ProcessChecklist: React.FC<{ title: string; steps: Step[]; durationInFrames: number }> = ({ title, steps, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const env = interpolate(frame, [0, 16, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end" }}>
      <div
        style={{
          margin: "0 90px 0 0",
          opacity: env,
          width: 460,
          padding: "26px 30px",
          borderRadius: 20,
          background: "rgba(8,12,20,0.85)",
          border: PILL_BORDER,
          filter: DROP_SHADOW,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 10, height: 24, borderRadius: 3, background: `linear-gradient(180deg, ${BLUE}, ${CYAN})` }} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: WHITE }}>{title}</span>
        </div>

        {steps.map((s) => {
          const e = spring({ frame: frame - s.at, fps, config: { stiffness: 170, damping: 19, mass: 0.7 }, durationInFrames: 14 });
          const x = interpolate(e, [0, 1], [28, 0]);
          const op = interpolate(frame, [s.at, s.at + 10], [0, 1], CLAMP);
          const check = interpolate(frame, [s.at + 6, s.at + 18], [0, 1], CLAMP);
          return (
            <div key={s.text} style={{ display: "flex", alignItems: "center", gap: 16, opacity: op, transform: `translateX(${x}px)` }}>
              <span
                style={{
                  flexShrink: 0,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: `2px solid ${CYAN}`,
                  background: `linear-gradient(135deg, ${CYAN}, ${BLUE})`,
                  opacity: check,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.6 + 0.4 * check})`,
                }}
              >
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: "#04121f" }}>✓</span>
              </span>
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 27, color: WHITE }}>{s.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
