import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CYAN, DROP_SHADOW, MONO, PILL_BG, PILL_BORDER, WHITE } from "./overlayUI";

type Props = {
  command: string;
  durationInFrames: number;
};

// Reusable monospace command chip: slides in from the right, holds, fades out.
export const CommandChip: React.FC<Props> = ({ command, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { stiffness: 150, damping: 19, mass: 0.7 },
    durationInFrames: 14,
  });
  const x = interpolate(enter, [0, 1], [480, 0]);

  const opacityIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityOut = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end" }}>
      <div
        style={{
          marginTop: 150,
          marginRight: 90,
          transform: `translateX(${x}px)`,
          opacity: Math.min(opacityIn, opacityOut),
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 22px",
          borderRadius: 12,
          background: PILL_BG,
          border: PILL_BORDER,
          filter: DROP_SHADOW,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 26, color: CYAN, fontWeight: 500 }}>
          ❯
        </span>
        <span style={{ fontFamily: MONO, fontSize: 26, color: WHITE }}>{command}</span>
      </div>
    </AbsoluteFill>
  );
};
