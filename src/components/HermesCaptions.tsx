import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT, RED, WHITE } from "./overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Captions timed to the narration. Gaps between phrases show nothing.
// "apart" flashes red as the chips fall apart (~f230).
type Phrase = {
  text: string;
  start: number;
  end: number;
  emphasizeWord?: string;
  emphasizeAt?: number;
};
const PHRASES: Phrase[] = [
  { text: "most AI agents can search the web", start: 0, end: 60 },
  { text: "but the second you ask them to click a button", start: 67, end: 142 },
  { text: "fill out a form or use a real website — they fall apart", start: 142, end: 262, emphasizeWord: "apart", emphasizeAt: 232 },
  { text: "in this video I'm connecting Hermes to Playwright MCP", start: 275, end: 385 },
  { text: "so it can control a real browser inside WSL", start: 396, end: 488 },
  { text: "on Windows", start: 488, end: 518 },
];

export const HermesCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const active = PHRASES.find((p) => frame >= p.start && frame < p.end);
  if (!active) return null;

  const opacity = interpolate(frame, [active.start, active.start + 4, active.end - 4, active.end], [0, 1, 1, 0], CLAMP);
  const emph =
    active.emphasizeAt === undefined
      ? 0
      : interpolate(frame, [active.emphasizeAt - 5, active.emphasizeAt, active.emphasizeAt + 10], [0, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          marginBottom: 96,
          opacity,
          display: "inline-flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 1400,
          padding: "16px 30px",
          borderRadius: 14,
          background: "rgba(8,10,14,0.72)",
          border: "1px solid rgba(255,255,255,0.10)",
          filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.55))",
          fontFamily: FONT,
        }}
      >
        {active.text.split(" ").map((w, i) => {
          const isEmph = active.emphasizeWord !== undefined && w.toLowerCase().includes(active.emphasizeWord);
          const scale = isEmph ? 1 + emph * 0.25 : 1;
          return (
            <span
              key={`${w}-${i}`}
              style={{
                display: "inline-block",
                fontWeight: isEmph ? 800 : 600,
                fontSize: 38,
                color: isEmph ? RED : WHITE,
                transform: `scale(${scale})`,
                textShadow: isEmph ? `0 0 ${emph * 26}px ${RED}` : "none",
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
