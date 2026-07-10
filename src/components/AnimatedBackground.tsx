import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLUE, CYAN } from "./overlayUI";
import { useTheme } from "../theme";

// Deterministic PRNG (mulberry32) — identical particles every render.
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Mote = {
  x: number;
  baseY: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
};

const buildMotes = (): Mote[] => {
  const rand = mulberry32(0x1234abcd);
  return Array.from({ length: 40 }, () => ({
    x: rand() * 100,
    baseY: rand() * 110,
    size: 2 + rand() * 4,
    speed: 0.06 + rand() * 0.18,
    opacity: 0.15 + rand() * 0.25,
    color: rand() > 0.75 ? CYAN : BLUE,
  }));
};

type Props = {
  durationInFrames: number;
  // Optional faint scattered background words (bold style only) — rotated,
  // dimmed, e.g. the topic's key terms floating behind the card.
  words?: string[];
  // false = stay fully opaque for the whole duration (no fade envelope). Used by
  // gap BRIDGES: they sit under two crossfading cards, and if the bridge fades
  // too, the footage bleeds through the stack mid-transition.
  fade?: boolean;
};

// The full-screen backdrop for "moment" sequences, themed:
//   cinematic — aurora glows, HUD grid, rising motes, vignette (all frame-driven)
//   bold      — flat slate with a soft vignette and optional scattered words
// A fade envelope keeps the edges clean against transparent gaps in both.
export const AnimatedBackground: React.FC<Props> = ({ durationInFrames, words, fade = true }) => {
  const frame = useCurrentFrame();
  const motes = useMemo(buildMotes, []);
  const theme = useTheme();

  const envelope = fade
    ? interpolate(
        frame,
        [0, 12, durationInFrames - 14, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 1;

  if (theme.flat) {
    const drift = Math.sin(frame * 0.02) * 6;
    return (
      <AbsoluteFill style={{ opacity: envelope }}>
        <AbsoluteFill style={{ backgroundColor: theme.bg }} />
        {words?.map((w, i) => {
          const rand = mulberry32(0x51ab + i * 977);
          const x = 6 + rand() * 78;
          const y = 6 + rand() * 82;
          const rot = -14 + rand() * 28;
          return (
            <span
              key={`${w}-${i}`}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: `rotate(${rot}deg) translateY(${drift * (i % 2 ? 1 : -1)}px)`,
                fontFamily: theme.fontDisplay,
                fontWeight: theme.titleWeight,
                fontSize: 44 + rand() * 26,
                letterSpacing: 1,
                color: theme.textDim,
                opacity: 0.35,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {w}
            </span>
          );
        })}
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 55%, rgba(0,0,0,0.28) 100%)" }} />
      </AbsoluteFill>
    );
  }

  // Drifting aurora blobs.
  const aX = 32 + 12 * Math.sin(frame * 0.012);
  const aY = 36 + 10 * Math.cos(frame * 0.010);
  const bX = 70 + 14 * Math.cos(frame * 0.009);
  const bY = 62 + 12 * Math.sin(frame * 0.013);
  const auroraPulse = 0.5 + 0.5 * Math.sin(frame * 0.03);

  // Slow grid parallax + diagonal light streak sweep.
  const gridX = (frame * 0.35) % 64;
  const gridY = (frame * 0.55) % 64;
  const streak = ((frame * 0.9) % (1920 + 700)) - 700;

  return (
    <AbsoluteFill style={{ opacity: envelope }}>
      {/* Base deep-space gradient */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 40%, #221a14 0%, #13100d 45%, #080605 100%)",
        }}
      />

      {/* Aurora glows */}
      <div
        style={{
          position: "absolute",
          left: `${aX}%`,
          top: `${aY}%`,
          width: 1300,
          height: 1300,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BLUE} 0%, rgba(59,130,246,0.25) 35%, transparent 70%)`,
          filter: "blur(70px)",
          opacity: 0.42 + 0.12 * auroraPulse,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${bX}%`,
          top: `${bY}%`,
          width: 1100,
          height: 1100,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN} 0%, rgba(6,182,212,0.22) 35%, transparent 70%)`,
          filter: "blur(70px)",
          opacity: 0.34 + 0.12 * (1 - auroraPulse),
        }}
      />

      {/* HUD grid with parallax drift, masked toward the edges */}
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage: `
            linear-gradient(to right, ${BLUE} 1px, transparent 1px),
            linear-gradient(to bottom, ${BLUE} 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          backgroundPosition: `${gridX}px ${gridY}px`,
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 0%, black 45%, transparent 80%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, black 0%, black 45%, transparent 80%)",
        }}
      />

      {/* Diagonal light streak sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: streak,
          width: 320,
          transform: "skewX(-18deg)",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.10) 50%, transparent 100%)",
        }}
      />

      {/* Rising motes */}
      <AbsoluteFill>
        {motes.map((m, i) => {
          const yPct = (((m.baseY + frame * m.speed) % 110) + 110) % 110;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${m.x}%`,
                bottom: `${yPct - 5}%`,
                width: m.size,
                height: m.size,
                borderRadius: "50%",
                backgroundColor: m.color,
                opacity: m.opacity,
                boxShadow: `0 0 ${m.size * 2.5}px ${m.color}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Vignette to focus the centre */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
