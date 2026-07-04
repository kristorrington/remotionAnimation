import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, DROP_SHADOW, FONT, MONO, PILL_BG, PILL_BORDER, WHITE } from "./overlayUI";

// f5490 — "SKILL.md" badge + subtitle.
export const SkillBadge: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { stiffness: 180, damping: 15, mass: 0.8 },
    durationInFrames: 18,
  });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 16, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 32px",
            borderRadius: 16,
            background: PILL_BG,
            border: `1px solid ${BLUE}`,
            filter: DROP_SHADOW,
          }}
        >
          <span style={{ width: 10, height: 36, borderRadius: 3, background: `linear-gradient(180deg, ${BLUE}, ${CYAN})` }} />
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 46, color: WHITE }}>
            SKILL.md
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 30,
            color: CYAN,
            filter: DROP_SHADOW,
          }}
        >
          Claude's instruction manual
        </span>
      </div>
    </AbsoluteFill>
  );
};

// f5760 — "rules/" fan-out chips.
const RULES = ["compositions", "timing", "transitions", "text"];

export const RulesFanOut: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groupOpacity = interpolate(
    frame,
    [0, 8, durationInFrames - 16, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: groupOpacity }}>
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 40, color: BLUE, filter: DROP_SHADOW }}>
          rules/
        </span>
        <div style={{ display: "flex", gap: 18 }}>
          {RULES.map((rule, i) => {
            const pop = spring({
              frame: frame - 10 - i * 8,
              fps,
              config: { stiffness: 220, damping: 15, mass: 0.7 },
              durationInFrames: 16,
            });
            const scale = interpolate(pop, [0, 1], [0.4, 1]);
            const y = interpolate(pop, [0, 1], [24, 0]);
            const opacity = interpolate(pop, [0, 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={rule}
                style={{
                  transform: `translateY(${y}px) scale(${scale})`,
                  opacity,
                  padding: "14px 22px",
                  borderRadius: 12,
                  background: PILL_BG,
                  border: PILL_BORDER,
                  filter: DROP_SHADOW,
                  fontFamily: MONO,
                  fontSize: 28,
                  color: WHITE,
                }}
              >
                {rule}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// f7980 — three code chips appear in sequence.
const CODE_TERMS = ["useCurrentFrame()", "interpolate()", "spring()"];

export const CodeTermChips: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groupOpacity = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 20, opacity: groupOpacity }}>
        {CODE_TERMS.map((term, i) => {
          const enter = spring({
            frame: frame - i * 18,
            fps,
            config: { stiffness: 200, damping: 16, mass: 0.7 },
            durationInFrames: 16,
          });
          const scale = interpolate(enter, [0, 1], [0.5, 1]);
          const opacity = interpolate(enter, [0, 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={term}
              style={{
                transform: `scale(${scale})`,
                opacity,
                padding: "18px 26px",
                borderRadius: 12,
                background: PILL_BG,
                border: `1px solid ${i === 1 ? CYAN : BLUE}`,
                filter: DROP_SHADOW,
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: 32,
                color: WHITE,
              }}
            >
              {term}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
