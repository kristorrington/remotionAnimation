import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CYAN, DROP_SHADOW, FONT, RED, WHITE } from "./overlayUI";

const BULLETS = ["cleaner animations", "better structure", "fewer render headaches"];

// f10680–f11130 — Subscribe button (scale pulse) + three bullets fading in.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { stiffness: 170, damping: 16, mass: 0.8 },
    durationInFrames: 20,
  });
  const enterScale = interpolate(enter, [0, 1], [0.6, 1]);
  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous gentle scale pulse on the button.
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16);
  const buttonScale = enterScale * (1 + 0.05 * pulse);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity: enterOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Subscribe button */}
        <div
          style={{
            transform: `scale(${buttonScale})`,
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 40px",
            borderRadius: 14,
            background: RED,
            filter: DROP_SHADOW,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 0,
              height: 0,
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
              borderLeft: `20px solid ${WHITE}`,
            }}
          />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: WHITE }}>
            SUBSCRIBE
          </span>
        </div>

        {/* Bullets fade in, staggered */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {BULLETS.map((text, i) => {
            const start = 40 + i * 36;
            const opacity = interpolate(frame, [start, start + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const x = interpolate(frame, [start, start + 18], [-24, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={text}
                style={{
                  opacity,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: CYAN, filter: DROP_SHADOW }}>
                  ✓
                </span>
                <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 34, color: WHITE, filter: DROP_SHADOW }}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
