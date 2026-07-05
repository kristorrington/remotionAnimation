import React from "react";
import { useTheme } from "../theme";

// A wonky "tape" banner — dark chunky text on an accent strip with irregular
// torn edges and a slight tilt. The bold style's signature ("IS BACK",
// "BREAK IT DOWN"). Edges are a fixed jittered polygon so every render matches.
const EDGE = "polygon(0% 12%, 3% 2%, 22% 6%, 41% 0%, 63% 5%, 82% 1%, 97% 7%, 100% 18%, 99% 78%, 100% 92%, 78% 96%, 56% 100%, 38% 94%, 18% 99%, 3% 93%, 1% 82%)";

export const Tape: React.FC<{
  children: React.ReactNode;
  tilt?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, tilt = -2, fontSize = 84, style }) => {
  const t = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${tilt}deg)`,
        background: t.accent,
        clipPath: EDGE,
        padding: "14px 44px 18px",
        fontFamily: t.fontDisplay,
        fontWeight: t.titleWeight,
        fontSize,
        lineHeight: 1,
        letterSpacing: 1,
        color: t.ink,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
