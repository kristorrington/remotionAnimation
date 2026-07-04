import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";

// Small frame-animated "cartoon" icons that illustrate each idea. Each uses its
// own useCurrentFrame (local to the card's Sequence) so it animates while shown.

const CYAN = "#06B6D4";
const BLUE = "#3B82F6";
const WHITE = "#FFFFFF";
const RED = "#EF4444";
const AMBER = "#F59E0B";
const GREEN = "#34D399";

const Svg: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// The Claude spark logo — slow spin + gentle pulse + terracotta glow.
export const ClaudeMark: React.FC<{ size?: number }> = ({ size = 130 }) => {
  const frame = useCurrentFrame();
  const rot = frame * 0.5;
  const pulse = 1 + 0.06 * Math.sin(frame * 0.14);
  return (
    <Img
      src={staticFile("claude-logo.png")}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        transform: `rotate(${rot}deg) scale(${pulse})`,
        filter: `drop-shadow(0 0 ${size * 0.18}px rgba(217,119,87,0.7))`,
      }}
    />
  );
};

// Blocked request — no-entry sign, pulsing.
export const IconBlock: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.55 + 0.45 * Math.sin(frame * 0.25);
  return (
    <Svg size={size}>
      <circle cx="50" cy="50" r="36" stroke={RED} strokeWidth="8" opacity={0.55 + 0.45 * p} />
      <line x1="27" y1="27" x2="73" y2="73" stroke={RED} strokeWidth="8" />
    </Svg>
  );
};

// Reliability gauge — needle wobbles between good and bad (uncertain).
export const IconGauge: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const deg = 20 * Math.sin(frame * 0.12); // -20..20 from vertical
  return (
    <Svg size={size}>
      <path d="M18 66 A34 34 0 0 1 82 66" stroke={BLUE} strokeWidth="8" />
      <path d="M18 66 A34 34 0 0 1 40 36" stroke={GREEN} strokeWidth="8" />
      <path d="M60 36 A34 34 0 0 1 82 66" stroke={AMBER} strokeWidth="8" />
      <line x1="50" y1="66" x2="50" y2="34" stroke={WHITE} strokeWidth="6" transform={`rotate(${deg} 50 66)`} />
      <circle cx="50" cy="66" r="6" fill={CYAN} />
    </Svg>
  );
};

// Guardrail / safety shield with a check that draws in.
export const IconGuard: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const draw = Math.max(0, Math.min(1, (frame - 10) / 16));
  const len = 70;
  return (
    <Svg size={size}>
      <path d="M50 12 L82 24 V50 C82 71 68 84 50 90 C32 84 18 71 18 50 V24 Z" stroke={CYAN} strokeWidth="6" fill="rgba(6,182,212,0.12)" />
      <path d="M35 50 L46 62 L67 38" stroke={GREEN} strokeWidth="7" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
    </Svg>
  );
};

// Large context window — a document whose lines fill in (staggered).
export const IconContext: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const rows = [22, 34, 46, 58, 70];
  return (
    <Svg size={size}>
      <rect x="22" y="12" width="56" height="76" rx="7" stroke={BLUE} strokeWidth="6" />
      {rows.map((y, i) => {
        const w = 20 + 30 * Math.max(0, Math.min(1, (frame - i * 6) / 14));
        return <line key={y} x1="32" y1={y} x2={32 + w} y2={y} stroke={i % 2 ? CYAN : "rgba(255,255,255,0.85)"} strokeWidth="5" />;
      })}
    </Svg>
  );
};

// Cost — a coin with $, gently bobbing.
export const IconPrice: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const y = 2 * Math.sin(frame * 0.14);
  return (
    <Svg size={size}>
      <g transform={`translate(0 ${y})`}>
        <circle cx="42" cy="52" r="30" stroke={AMBER} strokeWidth="6" fill="rgba(245,158,11,0.12)" />
        <circle cx="58" cy="46" r="30" stroke={AMBER} strokeWidth="6" fill="rgba(245,158,11,0.16)" />
        <text x="58" y="58" textAnchor="middle" fontSize="34" fontWeight="800" fill={WHITE} fontFamily="sans-serif">$</text>
      </g>
    </Svg>
  );
};

// Deadline — calendar with a pulsing circled date.
export const IconCalendar: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.5 + 0.5 * Math.sin(frame * 0.22);
  return (
    <Svg size={size}>
      <rect x="18" y="20" width="64" height="62" rx="8" stroke={CYAN} strokeWidth="6" />
      <rect x="18" y="20" width="64" height="18" rx="8" fill={CYAN} opacity="0.85" />
      <line x1="34" y1="14" x2="34" y2="26" stroke={WHITE} strokeWidth="6" />
      <line x1="66" y1="14" x2="66" y2="26" stroke={WHITE} strokeWidth="6" />
      <circle cx="60" cy="60" r="13" stroke={AMBER} strokeWidth="5" opacity={0.5 + 0.5 * p} />
    </Svg>
  );
};

// National-security alert — shield with a pulsing "!".
export const IconShieldAlert: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.5 + 0.5 * Math.sin(frame * 0.24);
  return (
    <Svg size={size}>
      <path d="M50 12 L82 24 V50 C82 71 68 84 50 90 C32 84 18 71 18 50 V24 Z" stroke={AMBER} strokeWidth="6" fill="rgba(245,158,11,0.12)" opacity={0.7 + 0.3 * p} />
      <line x1="50" y1="36" x2="50" y2="58" stroke={AMBER} strokeWidth="7" />
      <circle cx="50" cy="69" r="4" fill={AMBER} />
    </Svg>
  );
};

// Exploit / bug — a little bug that jitters.
export const IconBug: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const j = 1.5 * Math.sin(frame * 0.5);
  return (
    <Svg size={size}>
      <g transform={`translate(${j} 0)`}>
        <ellipse cx="50" cy="56" rx="17" ry="22" stroke={RED} strokeWidth="6" fill="rgba(239,68,68,0.12)" />
        <circle cx="50" cy="32" r="8" stroke={RED} strokeWidth="6" />
        <line x1="45" y1="26" x2="40" y2="18" stroke={RED} strokeWidth="5" />
        <line x1="55" y1="26" x2="60" y2="18" stroke={RED} strokeWidth="5" />
        <line x1="33" y1="48" x2="20" y2="42" stroke={RED} strokeWidth="5" />
        <line x1="33" y1="58" x2="18" y2="58" stroke={RED} strokeWidth="5" />
        <line x1="33" y1="68" x2="20" y2="74" stroke={RED} strokeWidth="5" />
        <line x1="67" y1="48" x2="80" y2="42" stroke={RED} strokeWidth="5" />
        <line x1="67" y1="58" x2="82" y2="58" stroke={RED} strokeWidth="5" />
        <line x1="67" y1="68" x2="80" y2="74" stroke={RED} strokeWidth="5" />
      </g>
    </Svg>
  );
};

// Strategic technology — a microchip with a pulsing core.
export const IconChip: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.5 + 0.5 * Math.sin(frame * 0.2);
  const pins = [30, 50, 70];
  return (
    <Svg size={size}>
      <rect x="30" y="30" width="40" height="40" rx="6" stroke={CYAN} strokeWidth="6" />
      <rect x="43" y="43" width="14" height="14" rx="3" fill={CYAN} opacity={0.5 + 0.5 * p} />
      {pins.map((c) => (
        <g key={c}>
          <line x1={c} y1="20" x2={c} y2="30" stroke={BLUE} strokeWidth="5" />
          <line x1={c} y1="70" x2={c} y2="80" stroke={BLUE} strokeWidth="5" />
          <line x1="20" y1={c} x2="30" y2={c} stroke={BLUE} strokeWidth="5" />
          <line x1="70" y1={c} x2="80" y2={c} stroke={BLUE} strokeWidth="5" />
        </g>
      ))}
    </Svg>
  );
};

// Jurisdiction / regions — a slowly rotating globe.
export const IconGlobe: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const rx = 12 + 10 * Math.abs(Math.sin(frame * 0.03)); // meridian "rotates"
  return (
    <Svg size={size}>
      <circle cx="50" cy="50" r="32" stroke={BLUE} strokeWidth="6" />
      <line x1="18" y1="50" x2="82" y2="50" stroke={CYAN} strokeWidth="5" />
      <ellipse cx="50" cy="50" rx={rx} ry="32" stroke={CYAN} strokeWidth="5" />
    </Svg>
  );
};

// Your stack / single point of failure — server layers, bottom one flickering red.
export const IconStack: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const flick = Math.max(0, Math.sin(frame * 0.28));
  return (
    <Svg size={size}>
      {[26, 48, 70].map((y, i) => (
        <g key={y}>
          <rect x="24" y={y} width="52" height="16" rx="4" stroke={i === 2 ? RED : CYAN} strokeWidth="5" fill={i === 2 ? `rgba(239,68,68,${0.15 * flick})` : "transparent"} />
          <circle cx="66" cy={y + 8} r="3" fill={i === 2 ? RED : GREEN} opacity={i === 2 ? 0.5 + 0.5 * flick : 1} />
        </g>
      ))}
    </Svg>
  );
};

// Access gate — a padlock, pulsing (restricted / gated access).
export const IconGate: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.5 + 0.5 * Math.sin(frame * 0.2);
  return (
    <Svg size={size}>
      <rect x="28" y="46" width="44" height="36" rx="6" stroke={AMBER} strokeWidth="6" fill="rgba(245,158,11,0.12)" />
      <path d="M38 46 V38 a12 12 0 0 1 24 0 V46" stroke={AMBER} strokeWidth="6" />
      <circle cx="50" cy="60" r="4" fill={WHITE} opacity={0.7 + 0.3 * p} />
      <line x1="50" y1="62" x2="50" y2="70" stroke={WHITE} strokeWidth="4" />
    </Svg>
  );
};

// Route around failure — a blocked path (red X) and a green reroute that draws.
export const IconRoute: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const draw = Math.max(0, Math.min(1, (frame - 8) / 22));
  const len = 120;
  return (
    <Svg size={size}>
      <circle cx="20" cy="70" r="6" fill={CYAN} />
      <line x1="26" y1="70" x2="56" y2="70" stroke={RED} strokeWidth="6" opacity="0.55" />
      <line x1="58" y1="64" x2="70" y2="76" stroke={RED} strokeWidth="5" />
      <line x1="70" y1="64" x2="58" y2="76" stroke={RED} strokeWidth="5" />
      <path d="M26 70 C30 30 62 30 80 58" stroke={GREEN} strokeWidth="6" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
      <path d="M80 58 l-2 -12 M80 58 l-12 1" stroke={GREEN} strokeWidth="6" opacity={draw} />
    </Svg>
  );
};

// Silent failure — a dashboard that reads green but flickers red underneath.
export const IconSilent: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const flick = Math.max(0, Math.sin(frame * 0.3));
  return (
    <Svg size={size}>
      <rect x="16" y="22" width="68" height="46" rx="6" stroke={CYAN} strokeWidth="6" />
      <line x1="50" y1="68" x2="50" y2="80" stroke={CYAN} strokeWidth="6" />
      <line x1="34" y1="80" x2="66" y2="80" stroke={CYAN} strokeWidth="6" />
      <circle cx="50" cy="45" r="11" fill={GREEN} />
      <circle cx="50" cy="45" r="11" fill={RED} opacity={0.55 * flick} />
    </Svg>
  );
};

// Change — two refresh arrows rotating.
export const IconChange: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const rot = frame * 1.2;
  return (
    <Svg size={size}>
      <g transform={`rotate(${rot} 50 50)`}>
        <path d="M50 22 A28 28 0 0 1 78 50" stroke={CYAN} strokeWidth="7" />
        <path d="M78 50 l0 -14 M78 50 l-13 3" stroke={CYAN} strokeWidth="7" />
        <path d="M50 78 A28 28 0 0 1 22 50" stroke={BLUE} strokeWidth="7" />
        <path d="M22 50 l0 14 M22 50 l13 -3" stroke={BLUE} strokeWidth="7" />
      </g>
    </Svg>
  );
};
