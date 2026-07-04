import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, DROP_SHADOW, FONT, PILL_BG, PILL_BORDER, WHITE } from "./overlayUI";

type Props = {
  step: string; // e.g. "STEP 01"
  title: string; // e.g. "Create the project"
  durationInFrames: number;
};

// Reusable step lower-third: slides in from the left (~10f), holds, slides out.
export const StepLowerThird: React.FC<Props> = ({ step, title, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { stiffness: 140, damping: 18, mass: 0.7 },
    durationInFrames: 14,
  });
  const inX = interpolate(enter, [0, 1], [-460, 0]);

  const exitStart = durationInFrames - 10;
  const outX = interpolate(frame, [exitStart, durationInFrames], [0, -460], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacityIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityOut = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start" }}>
      <div
        style={{
          marginLeft: 90,
          marginBottom: 150,
          transform: `translateX(${inX + outX}px)`,
          opacity: Math.min(opacityIn, opacityOut),
          display: "inline-flex",
          alignItems: "stretch",
          borderRadius: 16,
          overflow: "hidden",
          background: PILL_BG,
          border: PILL_BORDER,
          filter: DROP_SHADOW,
          fontFamily: FONT,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: 6,
            background: `linear-gradient(180deg, ${BLUE}, ${CYAN})`,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "18px 28px",
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 2,
              color: CYAN,
            }}
          >
            {step}
          </span>
          <span style={{ width: 1, height: 30, background: "rgba(255,255,255,0.18)" }} />
          <span style={{ fontWeight: 600, fontSize: 30, color: WHITE }}>{title}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
