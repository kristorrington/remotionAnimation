import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const BLUE = "#C15F3C";
const WHITE = "#FFFFFF";
const GREY = "#8B9098";
const FULL = "…using AI";

// Seeded PRNG (mulberry32) — never Math.random().
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// BEAT 3 (f69–90, 21 frames) — "using AI"
// HARD CUT to a clean near-black card; the line types in with a blinking cursor,
// a credit tag fades in, and a blue glow pulses over the final 6 frames.
export const UsingAICard: React.FC = () => {
  const frame = useCurrentFrame();

  // Typewriter via string slicing.
  const chars = Math.round(
    interpolate(frame, [0, 12], [0, FULL.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typed = FULL.slice(0, chars);
  const cursorOn = Math.floor(frame / 7) % 2 === 0;

  const tagOpacity = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle blue glow pulse over the last 6 frames (f15–21).
  const glow = interpolate(frame, [15, 18, 21], [0, 1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sparks = useMemo(() => {
    const rand = mulberry32(0xa1c0de);
    return Array.from({ length: 7 }, () => ({
      x: (rand() - 0.5) * 620,
      y: (rand() - 0.5) * 220,
      size: 3 + rand() * 3,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A", justifyContent: "center", alignItems: "center" }}>
      {/* Glow pulse */}
      <AbsoluteFill
        style={{
          opacity: glow,
          background: "radial-gradient(circle at 50% 48%, rgba(59,130,246,0.30) 0%, transparent 55%)",
        }}
      />

      {/* Seeded glow sparks */}
      {sparks.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: BLUE,
            transform: `translate(${s.x}px, ${s.y}px)`,
            opacity: glow * 0.8,
            boxShadow: `0 0 10px ${BLUE}`,
          }}
        />
      ))}

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 56,
            color: WHITE,
            textShadow: `0 0 ${20 * glow}px rgba(59,130,246,${0.6 * glow})`,
          }}
        >
          {typed}
          <span style={{ color: BLUE, opacity: cursorOn ? 1 : 0 }}>▋</span>
        </div>
        <div style={{ fontFamily, fontWeight: 400, fontSize: 24, letterSpacing: 2, color: GREY, opacity: tagOpacity }}>
          Claude Code&nbsp;&nbsp;+&nbsp;&nbsp;Remotion
        </div>
      </div>
    </AbsoluteFill>
  );
};
