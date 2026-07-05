import React from "react";
import { useCurrentFrame } from "remotion";

// ============================================================================
// CARTOON SUBJECT LIBRARY — simple, expressive SVG characters & FX, all frame-
// driven. These are the "animated subjects" every non-receipt scene needs: a
// character or object DOING something (waiting, breaking, celebrating, …).
// Style: rounded shapes, expressive eyes, squash & stretch, dark-tech palette.
// ============================================================================

const CYAN = "#06B6D4";
const BLUE = "#3B82F6";
const WHITE = "#FFFFFF";
const RED = "#EF4444";
const AMBER = "#F59E0B";
const GREEN = "#34D399";
const PANEL = "#101826";

export type RobotPose = "idle" | "waiting" | "sleepy" | "alarmed" | "shrug" | "celebrate" | "worried";

// Floating "Z z z" for the sleepy pose.
const Zzz: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {[0, 1, 2].map((i) => {
      const t = ((frame * 0.02 + i * 0.33) % 1);
      return (
        <text key={i} x={150 + i * 14 + t * 10} y={40 - t * 34} fontSize={16 + i * 5} fill={CYAN} opacity={(1 - t) * 0.8} fontFamily="sans-serif" fontWeight="bold">
          z
        </text>
      );
    })}
  </>
);

// Radiating alarm lines for the alarmed pose.
const AlarmLines: React.FC<{ frame: number }> = ({ frame }) => {
  const p = 0.5 + 0.5 * Math.sin(frame * 0.5);
  return (
    <>
      {[-40, -20, 0, 20, 40].map((deg) => (
        <line key={deg} x1={100 + 58 * Math.sin((deg * Math.PI) / 180)} y1={26 - 14 * Math.cos((deg * Math.PI) / 180)} x2={100 + 74 * Math.sin((deg * Math.PI) / 180)} y2={26 - 30 * Math.cos((deg * Math.PI) / 180)} stroke={RED} strokeWidth={5} strokeLinecap="round" opacity={0.3 + 0.7 * p} />
      ))}
    </>
  );
};

// A worried sweat drop that slides down.
const Sweat: React.FC<{ frame: number }> = ({ frame }) => {
  const t = (frame * 0.02) % 1;
  return <path d={`M ${148} ${52 + t * 16} q 5 8 0 12 q -5 -4 0 -12`} fill={CYAN} opacity={(1 - t) * 0.9} />;
};

// The workhorse: a little robot with poses. 200×200 viewBox; scale via `size`.
export const CartoonRobot: React.FC<{ pose?: RobotPose; size?: number; accent?: string }> = ({ pose = "idle", size = 200, accent = CYAN }) => {
  const frame = useCurrentFrame();

  // blink every ~2.6s
  const blink = frame % 78 < 4 ? 0.12 : 1;
  // pose-driven motion
  const bob = pose === "sleepy" ? 1.5 * Math.sin(frame * 0.04) : 3 * Math.sin(frame * 0.09);
  const shake = pose === "alarmed" ? 2.4 * Math.sin(frame * 1.1) : pose === "worried" ? 1.2 * Math.sin(frame * 0.7) : 0;
  // celebrate: hop with squash & stretch on landing
  const hop = pose === "celebrate" ? Math.abs(Math.sin(frame * 0.18)) * 18 : 0;
  const squash = pose === "celebrate" ? 1 - 0.12 * Math.max(0, Math.cos(frame * 0.36)) : 1;
  // eyes look around while waiting
  const lookX = pose === "waiting" ? 4 * Math.sin(frame * 0.045) : 0;
  const eyeOpen = pose === "sleepy" ? Math.max(0.08, 0.5 + 0.5 * Math.sin(frame * 0.02)) * 0.4 : pose === "alarmed" ? 1.35 : blink;
  // shrug: arms rotate up
  const armUp = pose === "shrug" ? 40 + 6 * Math.sin(frame * 0.1) : pose === "celebrate" ? 140 : 0;
  const antennaSway = 8 * Math.sin(frame * 0.12);

  const mouth = () => {
    if (pose === "celebrate") return <path d="M86 78 Q100 92 114 78" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" />;
    if (pose === "alarmed") return <ellipse cx={100} cy={80} rx={8} ry={10} fill="#0a0f18" stroke={WHITE} strokeWidth={3} />;
    if (pose === "worried" || pose === "shrug") return <path d="M88 84 Q100 76 112 84" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" />;
    if (pose === "sleepy") return <ellipse cx={100} cy={82} rx={5} ry={6} fill="#0a0f18" stroke={WHITE} strokeWidth={2.5} />;
    return <path d="M90 80 Q100 86 110 80" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" />;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <g transform={`translate(${shake} ${bob - hop}) scale(1 ${squash})`} style={{ transformOrigin: "100px 170px" }}>
        {/* antenna */}
        <line x1={100} y1={30} x2={100 + antennaSway} y2={12} stroke={accent} strokeWidth={4} strokeLinecap="round" />
        <circle cx={100 + antennaSway} cy={10} r={6} fill={pose === "alarmed" ? RED : accent}>
        </circle>
        {/* head */}
        <rect x={62} y={30} width={76} height={62} rx={16} fill={PANEL} stroke={accent} strokeWidth={4} />
        {/* eyes */}
        <g transform={`translate(${lookX} 0)`}>
          <ellipse cx={86} cy={58} rx={8} ry={8 * eyeOpen} fill={WHITE} />
          <ellipse cx={114} cy={58} rx={8} ry={8 * eyeOpen} fill={WHITE} />
        </g>
        {mouth()}
        {/* body */}
        <rect x={70} y={98} width={60} height={52} rx={14} fill={PANEL} stroke={accent} strokeWidth={4} />
        <circle cx={100} cy={122} r={9} fill={pose === "alarmed" ? RED : accent} opacity={0.5 + 0.5 * Math.sin(frame * 0.15)} />
        {/* arms */}
        <line x1={70} y1={110} x2={52} y2={124 - armUp * 0.35} stroke={accent} strokeWidth={5} strokeLinecap="round" transform={`rotate(${-armUp} 70 110)`} />
        <line x1={130} y1={110} x2={148} y2={124 - armUp * 0.35} stroke={accent} strokeWidth={5} strokeLinecap="round" transform={`rotate(${armUp} 130 110)`} />
        {/* legs */}
        <rect x={80} y={150} width={12} height={18} rx={5} fill={PANEL} stroke={accent} strokeWidth={3.5} />
        <rect x={108} y={150} width={12} height={18} rx={5} fill={PANEL} stroke={accent} strokeWidth={3.5} />
      </g>
      {pose === "sleepy" && <Zzz frame={frame} />}
      {pose === "alarmed" && <AlarmLines frame={frame} />}
      {(pose === "worried" || pose === "waiting") && <Sweat frame={frame} />}
    </svg>
  );
};

// A thought bubble with animated dots ("the model is thinking").
export const ThoughtBubble: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" style={{ overflow: "visible" }}>
      <circle cx={18} cy={86} r={5} fill="rgba(255,255,255,0.35)" />
      <circle cx={30} cy={72} r={8} fill="rgba(255,255,255,0.4)" />
      <ellipse cx={68} cy={40} rx={44} ry={30} fill="rgba(16,24,38,0.95)" stroke={CYAN} strokeWidth={3} />
      {[0, 1, 2].map((i) => {
        const p = 0.4 + 0.6 * Math.max(0, Math.sin(frame * 0.16 - i * 0.9));
        return <circle key={i} cx={50 + i * 18} cy={40} r={5} fill={CYAN} opacity={p} />;
      })}
    </svg>
  );
};

// One-shot spark burst (impact FX). Fires at `at`, lasts ~16 frames.
export const Sparks: React.FC<{ at: number; x?: number; y?: number; color?: string; size?: number }> = ({ at, x = 0, y = 0, color = AMBER, size = 90 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 16;
  if (t < 0 || t > 1) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible", pointerEvents: "none" }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r1 = 10 + 32 * t;
        const r2 = r1 + 12 * (1 - t);
        const rad = (deg * Math.PI) / 180;
        return <line key={deg} x1={50 + r1 * Math.cos(rad)} y1={50 + r1 * Math.sin(rad)} x2={50 + r2 * Math.cos(rad)} y2={50 + r2 * Math.sin(rad)} stroke={color} strokeWidth={4 * (1 - t)} strokeLinecap="round" opacity={1 - t} />;
      })}
    </svg>
  );
};

// A little dust/smoke puff (for landings & collapses). Fires at `at`.
export const Puff: React.FC<{ at: number; x?: number; y?: number; size?: number }> = ({ at, x = 0, y = 0, size = 110 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 22;
  if (t < 0 || t > 1) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible", pointerEvents: "none" }}>
      {[-26, -8, 10, 28].map((dx, i) => (
        <circle key={i} cx={50 + dx * (1 + t)} cy={70 - 18 * t} r={(8 + i * 2) * (1 - t * 0.5)} fill="rgba(255,255,255,0.25)" opacity={(1 - t) * 0.8} />
      ))}
    </svg>
  );
};

// Speed trail lines behind a fast-moving object.
export const SpeedTrails: React.FC<{ width?: number; color?: string; opacity?: number }> = ({ width = 160, color = CYAN, opacity = 0.8 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={width} height={70} viewBox={`0 0 ${width} 70`} style={{ overflow: "visible" }}>
      {[10, 30, 50].map((y, i) => {
        const dash = 26 + 10 * Math.sin(frame * 0.5 + i);
        const off = (frame * (10 + i * 4)) % (width + 60);
        return <line key={y} x1={width - off} y1={y} x2={width - off - dash} y2={y} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={opacity * (1 - i * 0.22)} />;
      })}
    </svg>
  );
};

export { CYAN, BLUE, WHITE, RED, AMBER, GREEN, PANEL };
