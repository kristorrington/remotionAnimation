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

type Pos = "tl" | "tr" | "bl" | "br" | "tc" | "bc";
// NOTE: AbsoluteFill is flex-direction: column, so justifyContent = vertical,
// alignItems = horizontal.
const POS: Record<Pos, React.CSSProperties> = {
  tl: { justifyContent: "flex-start", alignItems: "flex-start" },
  tr: { justifyContent: "flex-start", alignItems: "flex-end" },
  bl: { justifyContent: "flex-end", alignItems: "flex-start" },
  br: { justifyContent: "flex-end", alignItems: "flex-end" },
  tc: { justifyContent: "flex-start", alignItems: "center" },
  bc: { justifyContent: "flex-end", alignItems: "center" },
};
const MARGIN: Record<Pos, string> = {
  tl: "96px 0 0 90px",
  tr: "96px 90px 0 0",
  bl: "0 0 130px 90px",
  br: "0 90px 130px 0",
  tc: "96px 0 0 0",
  bc: "0 0 130px 0",
};

// A small callout badge that pops in, holds, fades. Transparent annotation.
export const ActionBadge: React.FC<{ text: string; pos: Pos; check?: boolean; durationInFrames: number }> = ({ text, pos, check, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { stiffness: 260, damping: 17, mass: 0.7 }, durationInFrames: 14 });
  const scale = interpolate(enter, [0, 1], [0.5, 1]);
  const op = interpolate(frame, [0, 8, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], CLAMP);
  const checkScale = interpolate(spring({ frame: frame - 8, fps, config: { stiffness: 240, damping: 13 }, durationInFrames: 12 }), [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={POS[pos]}>
      <div
        style={{
          margin: MARGIN[pos],
          transform: `scale(${scale})`,
          opacity: op,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 22px",
          borderRadius: 999,
          background: "rgba(20,16,13,0.85)",
          border: PILL_BORDER,
          filter: DROP_SHADOW,
        }}
      >
        {check ? (
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${CYAN}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${checkScale})` }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: "#04121f" }}>✓</span>
          </span>
        ) : (
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
        )}
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: WHITE, whiteSpace: "nowrap" }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};
