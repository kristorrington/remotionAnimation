import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../components/overlayUI";
import { useTheme } from "../../theme";
import { ANIM_SPEED, PALETTE } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// KineticText — a single 2-5 word phrase for the MOST important lines only
// (CLAUDE.md §15.4). Enters in ~8f (opacity + position + slight scale), holds
// long enough to read, exits clean. NO elastic/cartoon bounce. Use EXACT
// transcript wording. `highlight` puts the hook keyword in a red box over the
// phrase. Stays inside YouTube-safe margins and clear of the bottom-right zone.
export const KineticText: React.FC<{
  text: string;
  durationInFrames: number;
  y?: number; // baseline centre (default upper-third); never the bottom-right
  size?: number;
  accent?: string;
  highlight?: string; // the ONE word to box in red (must appear in `text`)
}> = ({ text, durationInFrames, y = 360, size = 96, accent = PALETTE.opus, highlight }) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const inF = Math.round(8 * ANIM_SPEED);
  const outStart = durationInFrames - Math.round(10 * ANIM_SPEED);
  const op = interpolate(frame, [0, inF, outStart, durationInFrames], [0, 1, 1, 0], CLAMP);
  const ty = interpolate(frame, [0, inF, outStart, durationInFrames], [24, 0, 0, -16], CLAMP);
  const scale = interpolate(frame, [0, inF], [1.06, 1], CLAMP);
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: "50%",
        transform: `translate(-50%, -50%) translateY(${ty}px) scale(${scale})`,
        opacity: op,
        maxWidth: 1560,
        fontSize: size, // so the `em` gap below resolves against the text size
        display: "flex",
        flexWrap: "wrap",
        gap: "0.12em 0.34em",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {words.map((w, i) => {
        const clean = w.replace(/[^\p{L}\p{N}]/gu, "");
        const isHi = highlight && clean.toLowerCase() === highlight.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: size,
              letterSpacing: 1,
              lineHeight: 1.02,
              color: isHi ? "#fff" : t.text,
              background: isHi ? PALETTE.danger : "transparent",
              padding: isHi ? "0 0.18em" : 0,
              borderRadius: isHi ? 10 : 0,
              textShadow: t.glow && !isHi ? `0 0 40px ${accent}55` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
