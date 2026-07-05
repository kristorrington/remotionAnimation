import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The scroll-stopping line. Words slam in one by one (stagger = motion in the
// first second), the last word in the theme accent.
export const HookTitle: React.FC<{ text: string; hold: number }> = ({ text, hold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const words = text.split(" ");
  const out = interpolate(frame, [hold - 14, hold], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", padding: "170px 56px 0", opacity: out }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px", maxWidth: 980 }}>
        {words.map((w, i) => {
          const d = 3 + i * 3; // stagger
          const s = spring({ frame: frame - d, fps, config: { stiffness: 320, damping: 16, mass: 0.5 }, durationInFrames: 12 });
          const wordOp = interpolate(frame, [d, d + 4], [0, 1], CLAMP);
          const scale = interpolate(s, [0, 1], [1.7, 1]);
          const isLast = i === words.length - 1;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: wordOp,
                transform: `scale(${scale})`,
                fontFamily: t.fontDisplay,
                fontWeight: t.titleWeight,
                fontSize: t.name === "bold" ? 100 : 92,
                lineHeight: 1.04,
                letterSpacing: t.name === "bold" ? 0.5 : -1.5,
                color: isLast ? t.accent : t.text,
                textTransform: "uppercase",
                textShadow: "0 6px 34px rgba(0,0,0,0.75)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
