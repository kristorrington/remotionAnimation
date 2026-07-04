import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLUE, CYAN } from "./overlayUI";

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
};

// A cinematic, on-brand animated backdrop for full-screen "moment" sequences
// (hook, key-term pops, outro). Aurora glows drift, a HUD grid parallaxes, motes
// rise, and a vignette focuses the centre. Everything is frame-driven — no CSS
// animation. A fade envelope keeps the edges clean against transparent gaps.
export const AnimatedBackground: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const motes = useMemo(buildMotes, []);

  const envelope = interpolate(
    frame,
    [0, 12, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
            "radial-gradient(120% 120% at 50% 40%, #0a1422 0%, #050a14 45%, #02040a 100%)",
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
