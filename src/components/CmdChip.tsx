import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, DROP_SHADOW, MONO, PILL_BORDER, WHITE } from "./overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A bottom-left terminal chip that slides in and types the command out, then
// fades. A transparent annotation — sits over the screen recording.
export const CmdChip: React.FC<{ command: string; durationInFrames: number }> = ({ command, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { stiffness: 200, damping: 22, mass: 0.7 }, durationInFrames: 12 });
  const x = interpolate(enter, [0, 1], [-90, 0]);
  const opIn = interpolate(frame, [0, 8], [0, 1], CLAMP);
  const opOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], CLAMP);

  const typeFrames = Math.min(command.length * 1.4, 42);
  const chars = Math.round(interpolate(frame, [10, 10 + typeFrames], [0, command.length], CLAMP));
  const typed = command.slice(0, chars);
  const done = chars >= command.length;
  const cursorOn = Math.floor(frame / 7) % 2 === 0;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start" }}>
      <div
        style={{
          margin: "0 0 130px 90px",
          transform: `translateX(${x}px)`,
          opacity: Math.min(opIn, opOut),
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 24px",
          borderRadius: 12,
          background: "rgba(6,8,12,0.92)",
          border: PILL_BORDER,
          filter: DROP_SHADOW,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 27, fontWeight: 500, color: CYAN }}>❯</span>
        <span style={{ fontFamily: MONO, fontSize: 27, color: WHITE, whiteSpace: "nowrap" }}>
          {typed}
          <span style={{ opacity: done ? (cursorOn ? 1 : 0) : 1, color: BLUE }}>▋</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
