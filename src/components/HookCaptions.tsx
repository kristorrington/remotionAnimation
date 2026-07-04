import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

const CYAN = "#06B6D4";
const WHITE = "#FFFFFF";

// Each phrase is timed to its beat. The word "this" glows/scales at f50 and f66
// to punctuate each example landing.
const PHRASES: { text: string; start: number; end: number; emphasizeAt: number | null }[] = [
  { text: "want to make animations like this", start: 0, end: 55, emphasizeAt: 50 },
  { text: "or this", start: 55, end: 100, emphasizeAt: 66 }
];

// BEAT-spanning caption layer (f0–90). Toggle via the showCaptions prop on HookIntro.
export const HookCaptions: React.FC = () => {
  const frame = useCurrentFrame();

  const active = PHRASES.find((p) => frame >= p.start && frame < p.end) ?? PHRASES[PHRASES.length - 1];

  const opacity = interpolate(
    frame,
    [active.start, active.start + 4, active.end - 4, active.end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Emphasis pulse for the word "this".
  const emph =
    active.emphasizeAt === null
      ? 0
      : interpolate(frame, [active.emphasizeAt - 6, active.emphasizeAt, active.emphasizeAt + 9], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const words = active.text.split(" ");

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          marginBottom: 90,
          opacity,
          display: "inline-flex",
          gap: 14,
          alignItems: "baseline",
          padding: "16px 30px",
          borderRadius: 14,
          background: "rgba(8,10,14,0.72)",
          border: "1px solid rgba(255,255,255,0.10)",
          filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.55))",
          fontFamily,
        }}
      >
        {words.map((w, i) => {
          const isThis = w.toLowerCase() === "this";
          const scale = isThis ? 1 + emph * 0.28 : 1;
          const color = isThis ? CYAN : WHITE;
          return (
            <span
              key={`${w}-${i}`}
              style={{
                display: "inline-block",
                fontWeight: isThis ? 800 : 600,
                fontSize: 38,
                color,
                transform: `scale(${scale})`,
                textShadow: isThis ? `0 0 ${emph * 26}px ${CYAN}` : "none",
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
