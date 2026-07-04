import React from "react";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/RobotoMono";

// Shared palette / type for all tutorial overlays.
export const BLUE = "#3B82F6";
export const CYAN = "#06B6D4";
export const WHITE = "#FFFFFF";
export const RED = "#EF4444";

// Semi-transparent dark pill so text stays legible over any screen content.
export const PILL_BG = "rgba(8,10,14,0.74)";
export const PILL_BORDER = "1px solid rgba(255,255,255,0.10)";

// Subtle drop shadow so overlays read over bright or busy footage.
export const DROP_SHADOW = "drop-shadow(0 8px 22px rgba(0,0,0,0.55))";

const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: monoFamily } = loadMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const FONT = interFamily;
export const MONO = monoFamily;

// A rounded, semi-transparent dark pill. Inline-flex so it hugs its content.
export const Pill: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 24px",
        borderRadius: 16,
        background: PILL_BG,
        border: PILL_BORDER,
        filter: DROP_SHADOW,
        fontFamily: FONT,
        color: WHITE,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
