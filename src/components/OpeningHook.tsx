import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, DROP_SHADOW, FONT, MONO, PILL_BORDER, WHITE } from "./overlayUI";

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ── Opening, word-synced to the caption timings (frame = sec×30) ──
//   "want to make animations like this"  Card A (cinematic) plays   f1–54
//   "or this"                            Card B (kinetic) slides in  f54–69
//   "using AI"                           cards merge into "USING AI" f69–90
const THIS_AT = 50; // highlight pulse on "this"
const ORTHIS_AT = 54; // Card B enters on "or this"
const USINGAI_AT = 69; // cards converge / "USING AI" forms

const CARD_W = 520;
const CARD_H = 320;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// A rounded "preview window" with traffic-light chrome.
const CardShell: React.FC<{
  children: React.ReactNode;
  glow: number;
  caption: string;
}> = ({ children, glow, caption }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 4,
          color: CYAN,
          filter: DROP_SHADOW,
        }}
      >
        {caption}
      </span>
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 18,
          overflow: "hidden",
          background: "linear-gradient(160deg, #1d1712, #05080f)",
          border: PILL_BORDER,
          boxShadow: `0 18px 50px rgba(0,0,0,0.55), 0 0 ${20 + glow * 36}px rgba(193,95,60,${0.25 + glow * 0.5})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <div style={{ position: "relative", width: "100%", height: CARD_H - 36 }}>{children}</div>
      </div>
    </div>
  );
};

export const OpeningHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = useMemo(() => {
    const rand = mulberry32(0x00c0ffee);
    return Array.from({ length: 9 }, () => ({
      phase: rand() * Math.PI * 2,
      speed: 0.2 + rand() * 0.2,
    }));
  }, []);
  const sparks = useMemo(() => {
    const rand = mulberry32(0x5eed42);
    return Array.from({ length: 7 }, () => ({
      angle: rand() * Math.PI * 2,
      radius: 160 + rand() * 160,
      color: rand() > 0.5 ? CYAN : BLUE,
    }));
  }, []);

  const hookFade = interpolate(frame, [116, 125], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Resolve progress (cards converge + dissolve).
  const res = interpolate(frame, [USINGAI_AT, USINGAI_AT + 11], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardShrink = interpolate(res, [0, 1], [1, 0.38]);
  const cardFade = interpolate(frame, [USINGAI_AT + 2, USINGAI_AT + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Card A — cinematic, enters first, highlights on "this" ──
  const aEnter = spring({ frame: frame - 6, fps, config: { stiffness: 150, damping: 18, mass: 0.7 }, durationInFrames: 18 });
  const aEnterScale = interpolate(aEnter, [0, 1], [0.7, 1]);
  const aEnterOpacity = interpolate(frame, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aX = interpolate(frame, [ORTHIS_AT, ORTHIS_AT + 8, USINGAI_AT, USINGAI_AT + 9], [0, -290, -290, 0], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thisPulse = interpolate(frame, [THIS_AT - 3, THIS_AT, THIS_AT + 9], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aScale = aEnterScale * cardShrink * (1 + thisPulse * 0.04);
  const aOpacity = aEnterOpacity * cardFade;

  // ── Card B — kinetic, slides in on "or this" ──
  const bEnter = spring({ frame: frame - ORTHIS_AT, fps, config: { stiffness: 160, damping: 19, mass: 0.7 }, durationInFrames: 16 });
  const bEnterScale = interpolate(bEnter, [0, 1], [0.7, 1]);
  const bX = interpolate(frame, [ORTHIS_AT, ORTHIS_AT + 8, USINGAI_AT, USINGAI_AT + 9], [780, 290, 290, 0], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bOpacity =
    interpolate(frame, [ORTHIS_AT, ORTHIS_AT + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * cardFade;
  const bScale = bEnterScale * cardShrink;

  // ── "USING AI" payoff ──
  const aiEnter = spring({ frame: frame - (USINGAI_AT + 3), fps, config: { stiffness: 230, damping: 16, mass: 0.8 }, durationInFrames: 18 });
  const aiScale = interpolate(aiEnter, [0, 1], [0.5, 1]);
  const aiOpacity =
    interpolate(frame, [USINGAI_AT + 3, USINGAI_AT + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * hookFade;
  const sparkProg = interpolate(frame, [USINGAI_AT, USINGAI_AT + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: hookFade }}>
      {/* Card A — cinematic title reveal */}
      <div
        style={{
          position: "absolute",
          transform: `translateX(${aX}px) scale(${aScale})`,
          opacity: aOpacity,
        }}
      >
        <CardShell glow={0.3 + thisPulse * 0.7} caption="like this">
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            {/* soft radial glow */}
            <AbsoluteFill
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(193,95,60,0.30), transparent 65%)" }}
            />
            {/* mini title */}
            <div style={{ position: "relative", textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 4, color: WHITE, textShadow: `0 0 26px ${BLUE}` }}>
                CINEMATIC
              </div>
              <div style={{ margin: "12px auto 0", width: 200, height: 4, borderRadius: 3, background: `linear-gradient(90deg, ${BLUE}, ${CYAN})` }} />
            </div>
            {/* sweeping shine */}
            <div
              style={{
                position: "absolute",
                top: -40,
                bottom: -40,
                width: 120,
                left: ((frame * 9) % (CARD_W + 260)) - 180,
                transform: "skewX(-18deg)",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
              }}
            />
          </AbsoluteFill>
        </CardShell>
      </div>

      {/* Card B — kinetic equalizer */}
      <div
        style={{
          position: "absolute",
          transform: `translateX(${bX}px) scale(${bScale})`,
          opacity: bOpacity,
        }}
      >
        <CardShell glow={0.3} caption="or this">
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 18 }}>
            <AbsoluteFill
              style={{ background: "radial-gradient(circle at 50% 60%, rgba(217,119,87,0.30), transparent 65%)" }}
            />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 12, height: 150 }}>
              {bars.map((b, i) => {
                const h = 34 + 92 * (0.5 + 0.5 * Math.sin(frame * b.speed + b.phase));
                return (
                  <div
                    key={i}
                    style={{
                      width: 18,
                      height: h,
                      borderRadius: 6,
                      background: `linear-gradient(180deg, ${CYAN}, ${BLUE})`,
                      boxShadow: `0 0 14px rgba(217,119,87,0.55)`,
                    }}
                  />
                );
              })}
            </div>
            <span style={{ position: "relative", fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: CYAN }}>KINETIC</span>
          </AbsoluteFill>
        </CardShell>
      </div>

      {/* Converging sparks */}
      {res > 0 &&
        sparks.map((s, i) => {
          const r = s.radius * (1 - sparkProg);
          const x = Math.cos(s.angle) * r;
          const y = Math.sin(s.angle) * r;
          const op = interpolate(sparkProg, [0, 0.4, 1], [0, 1, 0]) * hookFade;
          return (
            <div
              key={`spark${i}`}
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: s.color,
                transform: `translate(${x}px, ${y}px)`,
                opacity: op,
                boxShadow: `0 0 12px ${s.color}`,
              }}
            />
          );
        })}

      {/* "USING AI" payoff */}
      <div
        style={{
          position: "absolute",
          opacity: aiOpacity,
          transform: `scale(${aiScale})`,
          display: "flex",
          alignItems: "baseline",
          gap: 22,
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 52, letterSpacing: 8, color: WHITE, filter: DROP_SHADOW }}>
          USING
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 118,
            letterSpacing: 4,
            color: CYAN,
            textShadow: `0 0 50px rgba(217,119,87,0.9), 0 0 90px rgba(193,95,60,0.6)`,
          }}
        >
          AI
        </span>
      </div>
    </AbsoluteFill>
  );
};
