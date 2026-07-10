import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const ELECTRIC_BLUE = "#C15F3C";
const CYAN = "#D97757";

// Deterministic PRNG (mulberry32) — identical particles on every render.
// Never Math.random().
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Particle = {
  x: number; // % across width
  baseY: number; // % up from bottom (seed)
  size: number; // px
  speed: number; // % of height per frame
  opacity: number; // 0.08 - 0.12
  color: string;
};

const NUM_PARTICLES = 26;

const buildParticles = (): Particle[] => {
  const rand = mulberry32(0x9e3779b9);
  return Array.from({ length: NUM_PARTICLES }, () => ({
    x: rand() * 100,
    baseY: rand() * 110,
    size: 2 + rand() * 3,
    speed: 0.08 + rand() * 0.16,
    opacity: 0.08 + rand() * 0.04,
    color: rand() > 0.8 ? CYAN : ELECTRIC_BLUE,
  }));
};

// Act 4 — tiny electric-blue motes drift upward, suggesting a live data field.
export const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = useMemo(buildParticles, []);

  const fieldOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fieldOpacity }}>
      {particles.map((p, i) => {
        const yPct = (((p.baseY + frame * p.speed) % 110) + 110) % 110;
        const bottom = yPct - 5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              bottom: `${bottom}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
