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

// A centered result panel: title + a list of items that appear one by one.
// Used for the live-test payoffs (labels returned, priority summary, draft saved).
export const ResultCard: React.FC<{
  title: string;
  items: string[];
  accent?: string;
  durationInFrames: number;
}> = ({ title, items, accent = CYAN, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { stiffness: 200, damping: 18, mass: 0.8 }, durationInFrames: 16 });
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const env = interpolate(frame, [0, 12, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: env }}>
      <div
        style={{
          transform: `scale(${scale})`,
          minWidth: 540,
          padding: "30px 40px",
          borderRadius: 20,
          background: "rgba(20,16,13,0.9)",
          border: PILL_BORDER,
          filter: DROP_SHADOW,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 21, color: "#04121f" }}>✓</span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: WHITE }}>{title}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => {
            const at = 20 + i * 14;
            const e = spring({ frame: frame - at, fps, config: { stiffness: 180, damping: 18 }, durationInFrames: 12 });
            const x = interpolate(e, [0, 1], [-24, 0]);
            const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
            return (
              <div key={it} style={{ display: "flex", alignItems: "center", gap: 14, opacity: op, transform: `translateX(${x}px)` }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: accent, boxShadow: `0 0 9px ${accent}` }} />
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.9)" }}>{it}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
