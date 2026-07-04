import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, FONT, RED, WHITE } from "./overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FALL_AT = 167; // local frame "they fall apart" lands (global f230)

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Kind = "button" | "form" | "browser";
const CHIPS: { kind: Kind; label: string; enter: number; from: "top" | "left" | "bottom" }[] = [
  { kind: "button", label: "click a button", enter: 4, from: "top" }, // f67
  { kind: "form", label: "fill a form", enter: 79, from: "left" }, // f142
  { kind: "browser", label: "a real website", enter: 110, from: "bottom" }, // f173
];

const Widget: React.FC<{ kind: Kind }> = ({ kind }) => {
  if (kind === "button") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ padding: "12px 28px", borderRadius: 10, background: BLUE, color: WHITE, fontWeight: 700, fontSize: 24, fontFamily: FONT }}>
          Submit
        </div>
        <span style={{ fontSize: 28 }}>🖱</span>
      </div>
    );
  }
  if (kind === "form") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 200 }}>
        <div style={{ height: 26, borderRadius: 6, border: "2px solid rgba(255,255,255,0.45)" }} />
        <div style={{ height: 26, borderRadius: 6, border: "2px solid rgba(255,255,255,0.45)" }} />
      </div>
    );
  }
  return (
    <div style={{ width: 200 }}>
      <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
      </div>
      <div style={{ height: 22, borderRadius: 999, background: "rgba(255,255,255,0.15)" }} />
    </div>
  );
};

// BEAT 2 (f63–274) — "...click a button, fill a form, or use a real website — they fall apart"
// Three UI chips burst in (attempting the actions), then glitch and fall apart in red.
export const FallApartBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fallSeeds = useMemo(() => {
    const rand = mulberry32(0xfa11);
    return CHIPS.map(() => ({ rot: (rand() - 0.5) * 90, drift: (rand() - 0.5) * 180 }));
  }, []);

  // Failure overlay (dark + red) fades in on "fall apart".
  const failOverlay = interpolate(frame, [FALL_AT, FALL_AT + 14], [0, 0.62], CLAMP);
  const redFlash = interpolate(frame, [FALL_AT, FALL_AT + 2, FALL_AT + 8], [0, 0.45, 0], CLAMP);

  // Red "THEY FALL APART" stamp.
  const stamp = spring({ frame: frame - (FALL_AT + 4), fps, config: { stiffness: 320, damping: 15, mass: 0.8 }, durationInFrames: 16 });
  const stampScale = interpolate(stamp, [0, 1], [1.7, 1]);
  const stampOpacity = interpolate(frame, [FALL_AT + 4, FALL_AT + 10], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Bright attempt-energy gradient */}
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${CYAN} 0%, ${BLUE} 55%, #FFFFFF 100%)` }} />

      {/* Chips row */}
      <div style={{ display: "flex", gap: 44, alignItems: "center" }}>
        {CHIPS.map((c, i) => {
          const enter = spring({ frame: frame - c.enter, fps, config: { stiffness: 320, damping: 20, mass: 0.6 }, durationInFrames: 14 });
          const inX = c.from === "left" ? interpolate(enter, [0, 1], [-640, 0]) : 0;
          const inY = c.from === "top" ? interpolate(enter, [0, 1], [-380, 0]) : c.from === "bottom" ? interpolate(enter, [0, 1], [380, 0]) : 0;
          const enterOpacity = interpolate(frame, [c.enter, c.enter + 6], [0, 1], CLAMP);

          // Glitch + fall on "fall apart".
          const shakeAmp = interpolate(frame, [FALL_AT, FALL_AT + 10], [0, 9], CLAMP);
          const shake = Math.sin(frame * 1.7 + i) * shakeAmp;
          const split = interpolate(frame, [FALL_AT, FALL_AT + 10], [0, 9], CLAMP);
          const fall = interpolate(frame, [FALL_AT + 8, FALL_AT + 46], [0, 1], { ...CLAMP, easing: undefined });
          const fallY = fall * 560;
          const rot = fall * fallSeeds[i].rot;
          const opacity = enterOpacity * (1 - fall);

          return (
            <div
              key={c.label}
              style={{
                transform: `translate(${inX + shake + fall * fallSeeds[i].drift}px, ${inY + fallY}px) rotate(${rot}deg)`,
                opacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                padding: "26px 28px",
                borderRadius: 18,
                background: "#0E1422",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: `${-split}px 0 0 rgba(239,68,68,0.7), ${split}px 0 0 rgba(6,182,212,0.7), 0 18px 44px rgba(0,0,0,0.45)`,
                minWidth: 240,
              }}
            >
              <Widget kind={c.kind} />
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: 1, color: "rgba(255,255,255,0.78)" }}>{c.label}</span>
            </div>
          );
        })}
      </div>

      {/* Failure overlay + red flash */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(120,10,10,0.5), rgba(2,2,2,0.85))", opacity: failOverlay }} />
      <AbsoluteFill style={{ backgroundColor: RED, opacity: redFlash }} />

      {/* Stamp */}
      <div
        style={{
          position: "absolute",
          opacity: stampOpacity,
          transform: `scale(${stampScale}) rotate(-6deg)`,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: 4,
          color: RED,
          textShadow: "0 0 40px rgba(239,68,68,0.7)",
        }}
      >
        THEY FALL APART
      </div>
    </AbsoluteFill>
  );
};
