import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The scroll-stopping line. Words slam in one by one (stagger = motion in the
// first second), the last word in the theme accent. `context` is ONE plain-
// words setup line under the hook (sentence case, not shouty) so a cold viewer
// knows what the video is about — e.g. "Fable 5 = Claude's new top model."
export const HookTitle: React.FC<{ text: string; hold: number; context?: string }> = ({ text, hold, context }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const words = text.split(" ");
  const out = interpolate(frame, [hold - 14, hold], [1, 0], CLAMP);
  const ctxIn = spring({ frame: frame - 12, fps, config: { stiffness: 220, damping: 16 }, durationInFrames: 16 });

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
      {context ? (
        <div
          style={{
            marginTop: 24,
            maxWidth: 900,
            textAlign: "center",
            opacity: interpolate(ctxIn, [0, 0.4], [0, 1]),
            transform: `translateY(${interpolate(ctxIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <span style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 30, lineHeight: 1.3, letterSpacing: 0.4, color: "rgba(255,255,255,0.78)", textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}>{context}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
