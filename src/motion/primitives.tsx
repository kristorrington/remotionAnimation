import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, BLUE, CYAN, HOT, WHITE, RED } from "../components/overlayUI";

// Reusable, render-safe motion primitives that give scenes cinematic depth
// without new dependencies. All frame-driven. Colors kept on the project palette.
const AMBER = "#F59E0B";
const GREEN = "#34D399";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// A diagonal light streak that sweeps across the frame on a loop.
export const LightSweep: React.FC<{ color?: string; width?: number; speed?: number; opacity?: number }> = ({
  color = CYAN,
  width = 360,
  speed = 1.1,
  opacity = 0.12,
}) => {
  const frame = useCurrentFrame();
  const x = ((frame * speed) % (2200 + width * 2)) - width;
  return (
    <div style={{ position: "absolute", top: -80, bottom: -80, left: x, width, transform: "skewX(-16deg)", background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity, pointerEvents: "none", mixBlendMode: "screen" }} />
  );
};

// A drifting field of glowing particles (deterministic — identical every render).
export const ParticleField: React.FC<{ count?: number; seed?: number; color?: string }> = ({ count = 46, seed = 0x9e77, color }) => {
  const frame = useCurrentFrame();
  const dots = React.useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      x: rand() * 100,
      y: rand() * 110,
      s: 2 + rand() * 4,
      sp: 0.05 + rand() * 0.2,
      o: 0.12 + rand() * 0.28,
      c: rand() > 0.72 ? CYAN : BLUE,
    }));
  }, [count, seed]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {dots.map((d, i) => {
        const y = (((d.y - frame * d.sp) % 110) + 110) % 110;
        return (
          <div key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${y - 5}%`, width: d.s, height: d.s, borderRadius: "50%", background: color ?? d.c, opacity: d.o, boxShadow: `0 0 ${d.s * 2.5}px ${color ?? d.c}` }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Slow camera push-in over a scene — a gentle scale + drift so it's never static.
export const SceneCameraPush: React.FC<{ from?: number; to?: number; children: React.ReactNode }> = ({ from = 1, to = 1.05, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [from, to], CLAMP);
  const y = interpolate(frame, [0, durationInFrames], [0, -14], CLAMP);
  return <AbsoluteFill style={{ transform: `scale(${scale}) translateY(${y}px)`, transformOrigin: "center 46%" }}>{children}</AbsoluteFill>;
};

// A layer that drifts a little on a sine (fake parallax); depth via `depth`.
export const ParallaxLayer: React.FC<{ depth?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ depth = 1, children, style }) => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame * 0.02) * 10 * depth;
  const y = Math.cos(frame * 0.017) * 7 * depth;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)`, ...style }}>{children}</AbsoluteFill>;
};

// Small labeled chip with a colored dot — for "latency", "reasoning" tags etc.
export const StatusChip: React.FC<{ label: string; color?: string; delay?: number; style?: React.CSSProperties }> = ({ label, color = CYAN, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { stiffness: 220, damping: 18, mass: 0.6 }, durationInFrames: 14 });
  const op = interpolate(frame, [delay, delay + 8], [0, 1], CLAMP);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, background: "rgba(20,16,13,0.72)", border: `1px solid ${color}66`, transform: `scale(${interpolate(e, [0, 1], [0.7, 1])})`, opacity: op, ...style }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: WHITE, textTransform: "uppercase" }}>{label}</span>
    </div>
  );
};

// Warning badge — amber/red pill with a pulsing "!".
export const WarningBadge: React.FC<{ label: string; danger?: boolean; delay?: number }> = ({ label, danger, delay = 0 }) => {
  const frame = useCurrentFrame();
  const color = danger ? RED : AMBER;
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.35);
  const op = interpolate(frame, [delay, delay + 8], [0, 1], CLAMP);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 10, background: `${color}22`, border: `2px solid ${color}`, opacity: op, boxShadow: `0 0 ${16 * pulse}px ${color}55` }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color, transform: `scale(${0.9 + 0.2 * pulse})` }}>!</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: WHITE, textTransform: "uppercase" }}>{label}</span>
    </div>
  );
};

// Stamped emphasis — slams in with overshoot + a slight tilt (e.g. "IF IT WORKS").
// Stamps are ATTENTION moments — HOT by default (colour research: the hot
// orange is reserved for scroll-stopper beats, call sites keep semantic colours)
export const ImpactStamp: React.FC<{ text: string; at?: number; color?: string }> = ({ text, at = 0, color = HOT }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 240, damping: 12, mass: 0.9 }, durationInFrames: 18 });
  const op = interpolate(frame, [at, at + 5], [0, 1], CLAMP);
  const scale = interpolate(e, [0, 1], [1.8, 1]);
  return (
    <div style={{ transform: `scale(${scale}) rotate(-3deg)`, opacity: op, display: "inline-block", padding: "12px 34px", border: `4px solid ${color}`, borderRadius: 10, background: "rgba(6,9,16,0.35)", boxShadow: `0 0 30px ${color}55` }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 3, color: WHITE, textTransform: "uppercase" }}>{text}</span>
    </div>
  );
};

// A larger loading ring for scenes (arc sweeps around a faint track).
export const LoadingRing: React.FC<{ size?: number; color?: string; stroke?: number }> = ({ size = 220, color = CYAN, stroke = 12 }) => {
  const frame = useCurrentFrame();
  const r = 50 - stroke / 2;
  const dash = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 18px ${color}66)` }}>
      <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
      <circle cx="50" cy="50" r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${dash * 0.3} ${dash}`} transform={`rotate(${frame * 5} 50 50)`} />
    </svg>
  );
};

// A stalled / crawling progress bar (fills slowly then hangs) — the "buffering" feel.
export const StalledBar: React.FC<{ width?: number; color?: string }> = ({ width = 520, color = CYAN }) => {
  const frame = useCurrentFrame();
  // crawls to ~62% then stalls with a tiny jitter — feels stuck.
  const base = interpolate(frame, [0, 40, 90], [0, 0.55, 0.62], CLAMP);
  const jitter = frame > 90 ? 0.01 * Math.sin(frame * 0.4) : 0;
  const pct = base + jitter;
  return (
    <div style={{ width, height: 14, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)" }}>
      <div style={{ width: `${pct * 100}%`, height: "100%", background: `linear-gradient(90deg, ${BLUE}, ${color})`, boxShadow: `0 0 14px ${color}`, borderRadius: 999 }} />
    </div>
  );
};

// Animated glowing divider that draws out from the centre.
export const GlowDivider: React.FC<{ width?: number; at?: number; color?: string }> = ({ width = 320, at = 6, color = CYAN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 180, damping: 20 }, durationInFrames: 18 });
  return <div style={{ width, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${BLUE}, ${color})`, transform: `scaleX(${e})`, boxShadow: `0 0 16px ${color}` }} />;
};

// Counts up to a value (with optional prefix/suffix) — for stats/pricing.
export const AnimatedCounter: React.FC<{ to: number; from?: number; at?: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; color?: string; size?: number }> = ({
  to,
  from = 0,
  at = 0,
  dur = 34,
  decimals = 0,
  prefix = "",
  suffix = "",
  color = WHITE,
  size = 88,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 90, damping: 22 }, durationInFrames: dur });
  const v = from + (to - from) * e;
  return (
    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -1, color, lineHeight: 1, textShadow: `0 0 24px ${color}55` }}>
      {prefix}{v.toFixed(decimals)}{suffix}
    </span>
  );
};

// Odometer-style counter: each digit column ROLLS continuously (carries and
// all), with comma grouping. Use for money/scale numbers; AnimatedCounter
// remains for simple percentages.
export const Odometer: React.FC<{ to: number; at?: number; dur?: number; size?: number; color?: string; prefix?: string; suffix?: string }> = ({ to, at = 0, dur = 44, size = 88, color = WHITE, prefix = "", suffix = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 70, damping: 24 }, durationInFrames: dur });
  const v = to * e;
  const digitCount = Math.max(1, Math.floor(Math.log10(Math.max(1, to))) + 1);
  const h = size * 1.08;
  const cell = (k: number) => {
    // continuous roll: offset of this power-of-ten column (handles carries)
    const off = (v / Math.pow(10, k)) % 10;
    return (
      <span key={k} style={{ display: "inline-block", height: h, overflow: "hidden", verticalAlign: "bottom" }}>
        <span style={{ display: "inline-block", transform: `translateY(${-off * h}px)` }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
            <span key={i} style={{ display: "block", height: h, lineHeight: `${h}px` }}>{d}</span>
          ))}
        </span>
      </span>
    );
  };
  const cells: React.ReactNode[] = [];
  for (let k = digitCount - 1; k >= 0; k--) {
    cells.push(cell(k));
    if (k > 0 && k % 3 === 0) cells.push(<span key={`c-${k}`} style={{ display: "inline-block" }}>,</span>);
  }
  return (
    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -1, color, textShadow: `0 0 24px ${color}55`, transform: "translateZ(0)", display: "inline-flex", alignItems: "flex-end" }}>
      {prefix}{cells}{suffix}
    </span>
  );
};

// A callout arrow that DRAWS ON toward a target, then its 1–2 word label pops.
// For annotating screenshots/charts instead of adding more static text.
export const LabelArrow: React.FC<{ label: string; at?: number; angle?: number; length?: number; color?: string }> = ({ label, at = 0, angle = 35, length = 150, color = CYAN }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + 16], [0, 1], CLAMP);
  const labelOp = interpolate(frame, [at + 12, at + 20], [0, 1], CLAMP);
  const rad = (angle * Math.PI) / 180;
  const x2 = Math.cos(rad) * length;
  const y2 = Math.sin(rad) * length;
  const hx = x2 * draw;
  const hy = y2 * draw;
  return (
    <div style={{ position: "relative", width: 0, height: 0 }}>
      <svg width={Math.abs(x2) + 40} height={Math.abs(y2) + 40} viewBox={`0 0 ${Math.abs(x2) + 40} ${Math.abs(y2) + 40}`} style={{ position: "absolute", left: Math.min(0, x2) - 20, top: Math.min(0, y2) - 20, overflow: "visible" }}>
        <line x1={20 - Math.min(0, x2)} y1={20 - Math.min(0, y2)} x2={20 - Math.min(0, x2) + hx} y2={20 - Math.min(0, y2) + hy} stroke={color} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        {draw > 0.85 && (
          <path d={`M ${20 - Math.min(0, x2) + hx} ${20 - Math.min(0, y2) + hy} l ${-14 * Math.cos(rad - 0.5)} ${-14 * Math.sin(rad - 0.5)} M ${20 - Math.min(0, x2) + hx} ${20 - Math.min(0, y2) + hy} l ${-14 * Math.cos(rad + 0.5)} ${-14 * Math.sin(rad + 0.5)}`} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
        )}
      </svg>
      <div style={{ position: "absolute", left: x2 > 0 ? -30 : 10, top: y2 > 0 ? -46 : 10, opacity: labelOp, padding: "6px 16px", borderRadius: 10, background: "rgba(20,16,13,0.85)", border: `2px solid ${color}`, whiteSpace: "nowrap", transform: "translateZ(0)" }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: WHITE }}>{label}</span>
      </div>
    </div>
  );
};

// A floating glass UI panel that bobs gently (depth + life behind content).
export const FloatingPanel: React.FC<{ children: React.ReactNode; delay?: number; depth?: number; accent?: string; style?: React.CSSProperties }> = ({ children, delay = 0, depth = 1, accent = CYAN, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { stiffness: 200, damping: 18, mass: 0.8 }, durationInFrames: 18 });
  const op = interpolate(frame, [delay, delay + 10], [0, 1], CLAMP);
  const bob = Math.sin(frame * 0.05) * 5 * depth;
  return (
    <div style={{ opacity: op, transform: `translateY(${bob + interpolate(e, [0, 1], [40, 0])}px) scale(${interpolate(e, [0, 1], [0.9, 1])})`, padding: "26px 30px", borderRadius: 18, background: "linear-gradient(180deg, rgba(16,22,34,0.9), rgba(20,16,13,0.9))", border: `1px solid ${accent}44`, boxShadow: `0 24px 60px rgba(0,0,0,0.5), inset 0 0 40px ${accent}10`, ...style }}>
      {children}
    </div>
  );
};

// A bright highlight bar that sweeps across a target once (e.g. over a source line).
export const HighlightSweep: React.FC<{ at?: number; dur?: number; color?: string }> = ({ at = 0, dur = 22, color = CYAN }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], CLAMP);
  const op = interpolate(frame, [at, at + 4, at + dur - 6, at + dur], [0, 0.6, 0.6, 0], CLAMP);
  return <div style={{ position: "absolute", top: 0, bottom: 0, left: `${t * 100 - 20}%`, width: "22%", background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: op, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

export { AMBER, GREEN };
