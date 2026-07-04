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

// A top-center "prompt to Hermes" chat bubble that drops in and types out.
// Transparent annotation over the screen recording.
export const ChatPrompt: React.FC<{ text: string; durationInFrames: number }> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { stiffness: 180, damping: 20, mass: 0.8 }, durationInFrames: 16 });
  const y = interpolate(enter, [0, 1], [-60, 0]);
  const op = interpolate(frame, [0, 10, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], CLAMP);

  const chars = Math.round(interpolate(frame, [12, 12 + Math.min(text.length * 0.9, 60)], [0, text.length], CLAMP));
  const typed = text.slice(0, chars);
  const done = chars >= text.length;
  const cursorOn = Math.floor(frame / 7) % 2 === 0;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center" }}>
      <div
        style={{
          marginTop: 80,
          transform: `translateY(${y}px)`,
          opacity: op,
          maxWidth: 1280,
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          padding: "20px 28px",
          borderRadius: 18,
          borderTopLeftRadius: 6,
          background: "rgba(10,14,22,0.88)",
          border: PILL_BORDER,
          filter: DROP_SHADOW,
        }}
      >
        <span style={{ flexShrink: 0, padding: "4px 12px", borderRadius: 8, background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#04121f" }}>
          YOU
        </span>
        <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, lineHeight: 1.3, color: WHITE }}>
          {typed}
          <span style={{ opacity: done ? 0 : cursorOn ? 1 : 0, color: CYAN }}>▋</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
