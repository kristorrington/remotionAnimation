import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";
import { BRAND_NAME, BRAND_TAG } from "../brand";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Identity strip ("who is this guy?") for the first seconds of a short. Slides in
// from the left over the face zone, holds, slides back out. Positioned to stay
// clear of the seam-docked captions above and the platform UI below.
export const LowerThird: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const enter = spring({ frame, fps, config: { stiffness: 190, damping: 20, mass: 0.8 }, durationInFrames: 18 });
  const inX = interpolate(enter, [0, 1], [-560, 0]);
  const outX = interpolate(frame, [dur - 14, dur], [0, -560], CLAMP);
  const barH = interpolate(enter, [0, 1], [0, 74]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* low in the TOP face band, hugging the left edge — over the desk/set,
          never the face (the presenter is centered), and clear of the caption
          pill docked on the seam below (~1027) */}
      <div style={{ position: "absolute", top: 880, left: 0, transform: `translateX(${inX + outX}px)`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 7, height: barH, background: t.accent, boxShadow: t.glow ? `0 0 14px ${t.accent}` : undefined }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            padding: "10px 24px 10px 16px",
            // paper = white sticker card (near-black name reads over anything);
            // dark styles keep the dark pill with white name
            background: t.name === "paper" ? "rgba(255,255,255,0.95)" : "rgba(6,9,16,0.88)",
            borderRadius: "0 12px 12px 0",
            border: t.name === "paper" ? "1px solid rgba(31,30,29,0.14)" : "1px solid rgba(255,255,255,0.12)",
            borderLeft: "none",
            boxShadow: t.name === "paper" ? "0 10px 26px rgba(31,30,29,0.22)" : "0 12px 30px rgba(0,0,0,0.45)",
          }}
        >
          <span style={{ fontFamily: t.fontBody, fontWeight: 900, fontSize: 32, letterSpacing: 0.5, color: t.name === "paper" ? t.ink : "#FFFFFF" }}>{BRAND_NAME}</span>
          <span style={{ fontFamily: t.fontKicker, fontWeight: 700, fontSize: 21, letterSpacing: 3, color: t.name === "paper" ? "#B85C3A" : t.accent }}>{BRAND_TAG}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
