import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, DROP_SHADOW, FONT, PILL_BG, PILL_BORDER, WHITE } from "./overlayUI";

// Local-frame sync points (Agenda Sequence starts at 0:18 / f542):
//   title          0:18.0  -> 0
//   item 1         0:19.3  -> 39   "create a new remotion project"
//   item 2         0:21.9  -> 117  "add the best-practices skill"
//   benefit 1      0:24.2  -> 186  "cleaner video code"
//   benefit 2      0:27.2  -> 276  "right patterns"
//   benefit 3      0:28.6  -> 318  "better animations"
//   let's go       0:31.3  -> 399
const ITEMS = [
  { label: "Create a Remotion project", at: 39 },
  { label: "Add the best-practices skill", at: 117 },
];
const BENEFITS = [
  { label: "Cleaner code", at: 186 },
  { label: "Right patterns", at: 276 },
  { label: "Better animations", at: 318 },
];

export const Agenda: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groupOpacity = interpolate(
    frame,
    [0, 10, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const letsGo = spring({
    frame: frame - 399,
    fps,
    config: { stiffness: 240, damping: 14 },
    durationInFrames: 18,
  });
  const letsGoScale = interpolate(letsGo, [0, 1], [0.6, 1]);
  const letsGoOpacity = interpolate(frame, [399, 410], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: groupOpacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: CYAN, filter: DROP_SHADOW }}>
          IN THIS TUTORIAL
        </span>

        {/* Two main checklist items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ITEMS.map(({ label, at }) => {
            const enter = spring({
              frame: frame - at,
              fps,
              config: { stiffness: 160, damping: 18, mass: 0.7 },
              durationInFrames: 16,
            });
            const x = interpolate(enter, [0, 1], [-40, 0]);
            const opacity = interpolate(frame, [at, at + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const check = interpolate(enter, [0.3, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={label}
                style={{
                  opacity,
                  transform: `translateX(${x}px)`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "16px 28px",
                  borderRadius: 14,
                  background: PILL_BG,
                  border: PILL_BORDER,
                  filter: DROP_SHADOW,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 34,
                    color: CYAN,
                    transform: `scale(${check})`,
                    display: "inline-block",
                  }}
                >
                  ✓
                </span>
                <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 38, color: WHITE }}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Benefit chips */}
        <div style={{ display: "flex", gap: 16 }}>
          {BENEFITS.map(({ label, at }) => {
            const enter = spring({
              frame: frame - at,
              fps,
              config: { stiffness: 220, damping: 15, mass: 0.7 },
              durationInFrames: 16,
            });
            const scale = interpolate(enter, [0, 1], [0.4, 1]);
            const opacity = interpolate(frame, [at, at + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={label}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "rgba(59,130,246,0.14)",
                  border: `1px solid ${BLUE}`,
                  filter: DROP_SHADOW,
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 26,
                  color: WHITE,
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Let's go */}
        <span
          style={{
            marginTop: 6,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 4,
            color: WHITE,
            opacity: letsGoOpacity,
            transform: `scale(${letsGoScale})`,
            filter: DROP_SHADOW,
          }}
        >
          LET'S GET INTO IT →
        </span>
      </div>
    </AbsoluteFill>
  );
};
