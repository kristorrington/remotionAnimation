import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GOLD } from "../components/overlayUI";
import { useTheme } from "../theme";
import { BRAND_HANDLE } from "../brand";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// End-of-clip call to action in the lower third (clear of the face). GOLD
// button + dark ink text in both styles — yellow-on-dark is the top-CTR
// combo in the colour research; gold is reserved for CTAs and key numbers.
export const ShortOutro: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const bold = t.name === "bold";

  const enter = spring({ frame, fps, config: { stiffness: 200, damping: 18, mass: 0.8 }, durationInFrames: 18 });
  const op = interpolate(frame, [0, 12], [0, 1], CLAMP) * interpolate(frame, [dur - 10, dur], [1, 0], CLAMP);
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const pulse = 1 + 0.04 * Math.sin(frame * 0.2);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", gap: 22, padding: "0 0 430px", opacity: op }}>
      <div
        style={{
          transform: `scale(${scale * pulse}) rotate(${bold ? -1.5 : 0}deg)`,
          display: "inline-flex",
          alignItems: "center",
          gap: 18,
          padding: "26px 54px",
          borderRadius: bold ? 12 : 18,
          background: bold ? t.accent : GOLD,
          boxShadow: `0 20px 50px rgba(0,0,0,0.55), 0 0 34px ${GOLD}44`,
        }}
      >
        <span style={{ width: 0, height: 0, borderTop: "16px solid transparent", borderBottom: "16px solid transparent", borderLeft: `26px solid ${t.ink}` }} />
        <span style={{ fontFamily: t.fontDisplay, fontWeight: bold ? t.titleWeight : 900, fontSize: 52, letterSpacing: 1, color: t.ink, textTransform: "uppercase" }}>{text}</span>
      </div>
      {/* the handle — so the CTA works even when the username is off-screen */}
      <span style={{ opacity: interpolate(frame, [14, 26], [0, 1], CLAMP), fontFamily: t.fontBody, fontWeight: 800, fontSize: 44, letterSpacing: 1.5, color: bold ? t.accent2 : t.accent, textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>
        {BRAND_HANDLE}
      </span>
    </AbsoluteFill>
  );
};
