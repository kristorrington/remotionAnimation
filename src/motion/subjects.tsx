import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";

// ============================================================================
// CARTOON SUBJECT LIBRARY — simple, expressive SVG characters & FX, all frame-
// driven. These are the "animated subjects" every non-receipt scene needs: a
// character or object DOING something (waiting, breaking, celebrating, …).
// Style: rounded shapes, expressive eyes, squash & stretch, dark-tech palette.
// ============================================================================

const CYAN = "#D97757";
const BLUE = "#C15F3C";
const WHITE = "#FFFFFF";
const RED = "#EF4444";
const AMBER = "#F59E0B";
const GREEN = "#34D399";
const PANEL = "#101826";

export type RobotPose =
  | "idle" | "waiting" | "sleepy" | "alarmed" | "shrug" | "celebrate" | "worried"
  | "walking" | "thinking" | "confused" | "facepalm" | "pointing";

// Pick the active pose from a sorted [frame, pose] timeline — one-line reaction
// beats: poseTimeline(frame, [[0,"idle"],[wakeAt,"alarmed"]]).
// PREMIUM finish shared by every card-like element (CLAUDE.md §12): glass
// gradient + thin alpha border + inner highlight — never flat PANEL fills
// with thick solid borders. Hex colors get an alpha edge + soft glow; rgba
// colors pass through untouched.
export const GLASS = "linear-gradient(180deg, rgba(41,33,27,0.95), rgba(20,16,13,0.88))";
export const glassCard = (color: string, borderW = 2): React.CSSProperties => {
  const hex = color.startsWith("#");
  return {
    background: GLASS,
    border: `${borderW}px solid ${hex ? `${color}AA` : color}`,
    boxShadow: `0 10px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)${hex ? `, 0 0 16px ${color}22` : ""}`,
  };
};

export const poseTimeline = (frame: number, steps: [number, RobotPose][]): RobotPose => {
  let pose: RobotPose = steps[0]?.[1] ?? "idle";
  for (const [at, p] of steps) if (frame >= at) pose = p;
  return pose;
};

// Decaying impact oscillation (for nudges/shakes synced to a hit).
export const impulse = (frame: number, at: number, strength = 6, decay = 14) => {
  const t = frame - at;
  if (t < 0) return 0;
  return Math.sin(t * 0.9) * strength * Math.max(0, 1 - t / decay);
};

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

// Floating "?" marks for the confused pose.
const QMarks: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {[0, 1].map((i) => {
      const t = (frame * 0.018 + i * 0.5) % 1;
      return (
        <text key={i} x={140 + i * 20 + Math.sin(t * 6) * 6} y={38 - t * 30} fontSize={20 + i * 6} fill={AMBER} opacity={(1 - t) * 0.9} fontFamily="sans-serif" fontWeight="bold">
          ?
        </text>
      );
    })}
  </>
);

// The workhorse: a little robot with poses. 200×200 viewBox; scale via `size`.
// `lookX`/`lookY` override the pose's eye target so the robot can WATCH the
// action (pass the direction of the thing it should track, ±6 max).
export const CartoonRobot: React.FC<{ pose?: RobotPose; size?: number; accent?: string; lookX?: number; lookY?: number }> = ({ pose = "idle", size = 200, accent = CYAN, lookX: lookXProp, lookY: lookYProp }) => {
  const frame = useCurrentFrame();

  // blink every ~2.6s
  const blink = frame % 78 < 4 ? 0.12 : 1;
  // pose-driven motion
  const bob = pose === "sleepy" ? 1.5 * Math.sin(frame * 0.04) : pose === "walking" ? 4 * Math.abs(Math.sin(frame * 0.3)) : 3 * Math.sin(frame * 0.09);
  const shake = pose === "alarmed" ? 2.4 * Math.sin(frame * 1.1) : pose === "worried" ? 1.2 * Math.sin(frame * 0.7) : 0;
  // celebrate: hop with squash & stretch on landing
  const hop = pose === "celebrate" ? Math.abs(Math.sin(frame * 0.18)) * 18 : 0;
  const squash = pose === "celebrate" ? 1 - 0.12 * Math.max(0, Math.cos(frame * 0.36)) : 1;
  // eyes look around while waiting / wander when confused / track a target
  const lookX = lookXProp ?? (pose === "waiting" ? 4 * Math.sin(frame * 0.045) : pose === "confused" ? 5 * Math.sin(frame * 0.09) : pose === "pointing" ? 5 : 0);
  const lookY = lookYProp ?? (pose === "thinking" ? -3 : 0);
  const eyeOpen =
    pose === "sleepy" ? Math.max(0.08, 0.5 + 0.5 * Math.sin(frame * 0.02)) * 0.4 :
    pose === "alarmed" ? 1.35 :
    pose === "facepalm" ? 0.15 :
    blink;
  // arms: per-side rotation (shrug/celebrate = both; thinking/facepalm/pointing = right only)
  const both = pose === "shrug" ? 40 + 6 * Math.sin(frame * 0.1) : pose === "celebrate" ? 140 : 0;
  const walkSwing = pose === "walking" ? 14 * Math.sin(frame * 0.3) : 0;
  const armL = both + walkSwing;
  const armR =
    pose === "thinking" ? 130 + 3 * Math.sin(frame * 0.08) :
    pose === "facepalm" ? 158 :
    pose === "pointing" ? 96 :
    both - walkSwing;
  const antennaSway = 8 * Math.sin(frame * 0.12);
  // legs: swing while walking
  const legL = pose === "walking" ? Math.max(0, Math.sin(frame * 0.3)) * 7 : 0;
  const legR = pose === "walking" ? Math.max(0, -Math.sin(frame * 0.3)) * 7 : 0;

  const mouth = () => {
    if (pose === "celebrate") return <path d="M86 78 Q100 92 114 78" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" />;
    if (pose === "alarmed") return <ellipse cx={100} cy={80} rx={8} ry={10} fill="#14100c" stroke={WHITE} strokeWidth={3} />;
    if (pose === "worried" || pose === "shrug" || pose === "facepalm") return <path d="M88 84 Q100 76 112 84" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" />;
    if (pose === "sleepy") return <ellipse cx={100} cy={82} rx={5} ry={6} fill="#14100c" stroke={WHITE} strokeWidth={2.5} />;
    if (pose === "thinking") return <ellipse cx={100} cy={81} rx={4} ry={5} fill="#14100c" stroke={WHITE} strokeWidth={2.5} />;
    if (pose === "confused") return <path d="M88 82 q6 -7 12 0 q6 7 12 0" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" />;
    return <path d="M90 80 Q100 86 110 80" stroke={WHITE} strokeWidth={4} fill="none" strokeLinecap="round" />;
  };

  // PREMIUM finish (CLAUDE.md §12): glass-gradient shells, dark visor with
  // glowing LED eyes, bezelled core, mitten hands, grounded contact shadow —
  // never the flat-outline toy look. Gradient id is per-accent so multiple
  // robots with different accents can share a frame.
  const gid = `robo-${accent.replace(/[^a-zA-Z0-9]/g, "")}`;
  const glowColor = pose === "alarmed" ? RED : accent;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b2219" />
          <stop offset="100%" stopColor="#16110d" />
        </linearGradient>
      </defs>
      {/* grounded contact shadow — stays down while the body hops */}
      <ellipse cx={100 + shake} cy={173} rx={Math.max(20, 34 - hop * 0.6)} ry={6} fill="#000" opacity={Math.max(0.16, 0.32 - hop * 0.006)} />
      <g transform={`translate(${shake} ${bob - hop}) scale(1 ${squash})`} style={{ transformOrigin: "100px 170px" }}>
        {/* antenna with a glowing tip */}
        <line x1={100} y1={30} x2={100 + antennaSway} y2={12} stroke={accent} strokeWidth={4} strokeLinecap="round" />
        <circle cx={100 + antennaSway} cy={10} r={9} fill={glowColor} opacity={0.18 + 0.14 * Math.sin(frame * 0.2)} />
        <circle cx={100 + antennaSway} cy={10} r={5} fill={glowColor} />
        {/* head: glass shell + dark visor screen */}
        <rect x={62} y={30} width={76} height={62} rx={18} fill={`url(#${gid})`} stroke={accent} strokeWidth={3} />
        <rect x={67} y={34} width={66} height={7} rx={3.5} fill="rgba(255,255,255,0.07)" />
        <rect x={70} y={40} width={60} height={44} rx={11} fill="#060b14" stroke="rgba(255,255,255,0.09)" strokeWidth={2} />
        {/* LED eyes inside the visor */}
        <g transform={`translate(${lookX} ${lookY})`} style={{ filter: `drop-shadow(0 0 5px ${glowColor})` }}>
          <rect x={80} y={58 - 8 * eyeOpen} width={11} height={16 * eyeOpen} rx={4.5} fill={glowColor} />
          <rect x={109} y={58 - 8 * eyeOpen} width={11} height={16 * eyeOpen} rx={4.5} fill={glowColor} />
        </g>
        {mouth()}
        {/* body: glass shell + bezelled glowing core */}
        <rect x={70} y={98} width={60} height={52} rx={15} fill={`url(#${gid})`} stroke={accent} strokeWidth={3} />
        <rect x={74} y={101.5} width={52} height={6} rx={3} fill="rgba(255,255,255,0.06)" />
        <circle cx={100} cy={122} r={12.5} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={2.5} />
        <circle cx={100} cy={122} r={8} fill={glowColor} opacity={0.55 + 0.45 * Math.sin(frame * 0.15)} style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }} />
        {/* arms with mitten hands */}
        <g transform={`rotate(${-armL} 70 110)`}>
          <line x1={70} y1={110} x2={52} y2={124 - armL * 0.35} stroke={accent} strokeWidth={6.5} strokeLinecap="round" />
          <circle cx={52} cy={124 - armL * 0.35} r={5} fill={accent} />
        </g>
        <g transform={`rotate(${armR} 130 110)`}>
          <line x1={130} y1={110} x2={148} y2={124 - armR * 0.35} stroke={accent} strokeWidth={6.5} strokeLinecap="round" />
          <circle cx={148} cy={124 - armR * 0.35} r={5} fill={accent} />
        </g>
        {/* legs */}
        <rect x={79} y={150 - legL} width={14} height={18 + legL} rx={6} fill={`url(#${gid})`} stroke={accent} strokeWidth={3} />
        <rect x={107} y={150 - legR} width={14} height={18 + legR} rx={6} fill={`url(#${gid})`} stroke={accent} strokeWidth={3} />
      </g>
      {pose === "sleepy" && <Zzz frame={frame} />}
      {pose === "alarmed" && <AlarmLines frame={frame} />}
      {(pose === "worried" || pose === "waiting") && <Sweat frame={frame} />}
      {pose === "confused" && <QMarks frame={frame} />}
    </svg>
  );
};

// Moves its child along the ground from `fromX` to `toX` between `start` and
// `end` frames — auto-flips to face the travel direction and kicks up step
// puffs while moving. The child should usually be a walking-pose subject.
export const MoveAlong: React.FC<{
  start: number; end: number; fromX: number; toX: number; bottom?: number;
  flip?: boolean; puffs?: boolean; children: React.ReactNode;
}> = ({ start, end, fromX, toX, bottom = 0, flip = true, puffs = true, children }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [start, end], [fromX, toX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const facing = flip && toX < fromX ? -1 : 1;
  const moving = frame >= start && frame <= end;
  const stepFrames = puffs ? Array.from({ length: Math.max(0, Math.floor((end - start) / 16)) }, (_, i) => start + 8 + i * 16) : [];
  return (
    <div style={{ position: "absolute", left: x, bottom }}>
      <div style={{ transform: `scaleX(${facing})` }}>{children}</div>
      {moving && stepFrames.map((f) => <Puff key={f} at={f} x={30} y={190} size={70} />)}
    </div>
  );
};

// One-shot cartoon entrance with squash & stretch on landing. Returns transform
// pieces so every impact shares the same physics.
export const useCartoonSpring = (at: number, opts?: { stiffness?: number; damping?: number; dur?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { stiffness: opts?.stiffness ?? 200, damping: opts?.damping ?? 14, mass: 0.8 }, durationInFrames: opts?.dur ?? 20 });
  const t = frame - at;
  const landed = t >= (opts?.dur ?? 20) * 0.6;
  const s = landed ? Math.max(0, Math.sin(((t - (opts?.dur ?? 20) * 0.6) / 10) * Math.PI)) * Math.max(0, 1 - t / 40) : 0;
  return { progress: p, landed, scaleX: 1 + 0.14 * s, scaleY: 1 - 0.18 * s, opacity: Math.min(1, Math.max(0, t / 6)) };
};

// Comic speech bubble that pops in at `at`. The single shared implementation —
// scenes must NOT re-implement this. `shout` adds an angry shake + red default.
export const SpeechBubble: React.FC<{ text: string; at?: number; color?: string; flip?: boolean; shout?: boolean; fontSize?: number }> = ({ text, at = 0, color, flip, shout, fontSize = 42 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = color ?? (shout ? RED : CYAN);
  const e = spring({ frame: frame - at, fps, config: { stiffness: 260, damping: 13, mass: 0.6 }, durationInFrames: 14 });
  const op = interpolate(frame, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rage = shout ? Math.sin(frame * 1.1) * 1.6 : 0;
  return (
    <div style={{ opacity: op, transform: `translate(${rage}px, 0) scale(${interpolate(e, [0, 1], [0.3, 1])}) rotate(${flip ? 3 : -3}deg)`, position: "relative", padding: shout ? "18px 28px" : "14px 24px", borderRadius: 18, ...glassCard(c, 2.5) }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize, color: WHITE, whiteSpace: "nowrap" }}>{text}</span>
      <div style={{ position: "absolute", bottom: -16, [flip ? "right" : "left"]: 44, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: `18px solid ${c}` }} />
    </div>
  );
};

// The antagonist: a little bug that crawls, attacks, or gets squashed. Use it
// wherever the narration blames "bugs / failures / hallucinations".
export type BugState = "crawl" | "attack" | "squashed";
export const BugCharacter: React.FC<{ state?: BugState; size?: number }> = ({ state = "crawl", size = 130 }) => {
  const frame = useCurrentFrame();
  const wiggle = state === "squashed" ? 0 : Math.sin(frame * 0.5);
  const lunge = state === "attack" ? Math.abs(Math.sin(frame * 0.22)) * 12 : 0;
  const crawlX = state === "crawl" ? Math.sin(frame * 0.08) * 6 : 0;
  const squashScale = state === "squashed" ? "scale(1.35, 0.28)" : "scale(1,1)";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <g transform={`translate(${crawlX - lunge} ${state === "squashed" ? 26 : 0}) ${squashScale}`} style={{ transformOrigin: "50px 78px" }}>
        {/* legs */}
        {[-1, 0, 1].map((i) => (
          <React.Fragment key={i}>
            <line x1={38} y1={62 + i * 9} x2={20} y2={58 + i * 11 + wiggle * 3} stroke={RED} strokeWidth={4} strokeLinecap="round" />
            <line x1={62} y1={62 + i * 9} x2={80} y2={58 + i * 11 - wiggle * 3} stroke={RED} strokeWidth={4} strokeLinecap="round" />
          </React.Fragment>
        ))}
        {/* body + head */}
        <ellipse cx={50} cy={62} rx={20} ry={16} fill="#2A1216" stroke={RED} strokeWidth={4} />
        <line x1={50} y1={48} x2={50} y2={76} stroke={RED} strokeWidth={2.5} opacity={0.6} />
        <circle cx={50} cy={36} r={11} fill="#2A1216" stroke={RED} strokeWidth={4} />
        {/* antennae */}
        <line x1={45} y1={27} x2={38 + wiggle * 2} y2={16} stroke={RED} strokeWidth={3} strokeLinecap="round" />
        <line x1={55} y1={27} x2={62 - wiggle * 2} y2={16} stroke={RED} strokeWidth={3} strokeLinecap="round" />
        {/* eyes: angry, or X-ed out when squashed */}
        {state === "squashed" ? (
          <>
            <path d="M42 33 l5 5 M47 33 l-5 5" stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" />
            <path d="M53 33 l5 5 M58 33 l-5 5" stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" />
          </>
        ) : (
          <>
            <line x1={41} y1={30} x2={47} y2={33} stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" />
            <line x1={59} y1={30} x2={53} y2={33} stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={45} cy={37} r={2.4} fill={WHITE} />
            <circle cx={55} cy={37} r={2.4} fill={WHITE} />
          </>
        )}
        {/* mandibles when attacking */}
        {state === "attack" && (
          <>
            <path d={`M42 44 q-5 ${4 + wiggle * 2} 0 8`} stroke={WHITE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            <path d={`M58 44 q5 ${4 - wiggle * 2} 0 8`} stroke={WHITE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
};

// The human proxy: a tiny developer. `typing` hammers a laptop, `panic` throws
// the arms up, `happy` hops. Pair with CartoonRobot for human-vs-agent beats.
export const TinyDev: React.FC<{ pose?: "typing" | "panic" | "happy"; size?: number; accent?: string }> = ({ pose = "typing", size = 200, accent = CYAN }) => {
  const frame = useCurrentFrame();
  const blink = frame % 84 < 4 ? 0.15 : 1;
  const hop = pose === "happy" ? Math.abs(Math.sin(frame * 0.18)) * 14 : 0;
  const shake = pose === "panic" ? 2.2 * Math.sin(frame * 1.05) : 0;
  const type = pose === "typing" ? Math.sin(frame * 0.9) * 3 : 0;
  const armsUp = pose !== "typing";
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <g transform={`translate(${shake} ${-hop})`}>
        {/* head + hair */}
        <circle cx={100} cy={58} r={26} fill="#E8B98B" stroke="#14100c" strokeWidth={3} />
        <path d="M74 52 A26 26 0 0 1 126 52 L120 40 L108 46 L96 38 L84 46 Z" fill="#3B2B20" />
        {/* eyes + mouth */}
        <ellipse cx={91} cy={58} rx={3.4} ry={3.4 * (pose === "panic" ? 1.5 : blink)} fill="#14100c" />
        <ellipse cx={109} cy={58} rx={3.4} ry={3.4 * (pose === "panic" ? 1.5 : blink)} fill="#14100c" />
        {pose === "panic" ? (
          <ellipse cx={100} cy={72} rx={6} ry={7} fill="#14100c" />
        ) : pose === "happy" ? (
          <path d="M90 70 Q100 80 110 70" stroke="#14100c" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : (
          <path d="M92 72 Q100 75 108 72" stroke="#14100c" strokeWidth={3} fill="none" strokeLinecap="round" />
        )}
        {/* hoodie body */}
        <rect x={72} y={84} width={56} height={58} rx={16} fill={PANEL} stroke={accent} strokeWidth={4} />
        <path d="M84 84 Q100 96 116 84" stroke={accent} strokeWidth={3} fill="none" />
        {/* arms */}
        {armsUp ? (
          <>
            <line x1={74} y1={96} x2={56} y2={72 - hop * 0.4} stroke={accent} strokeWidth={5} strokeLinecap="round" />
            <line x1={126} y1={96} x2={144} y2={72 - hop * 0.4} stroke={accent} strokeWidth={5} strokeLinecap="round" />
          </>
        ) : (
          <>
            <line x1={76} y1={100} x2={62} y2={126 + type} stroke={accent} strokeWidth={5} strokeLinecap="round" />
            <line x1={124} y1={100} x2={138} y2={126 - type} stroke={accent} strokeWidth={5} strokeLinecap="round" />
          </>
        )}
        {/* laptop when typing */}
        {pose === "typing" && (
          <g>
            <rect x={62} y={128} width={76} height={8} rx={3} fill="#443627" stroke={CYAN} strokeWidth={2.5} />
            <rect x={70} y={102} width={60} height={26} rx={4} fill="#0E1522" stroke={CYAN} strokeWidth={2.5} />
            <rect x={76} y={107 + (frame % 18 < 9 ? 0 : 2)} width={30} height={3} rx={1.5} fill={GREEN} opacity={0.8} />
            <rect x={76} y={114} width={44} height={3} rx={1.5} fill={CYAN} opacity={0.5} />
          </g>
        )}
        {/* legs */}
        <rect x={82} y={142} width={13} height={20} rx={5} fill="#2b221a" stroke={accent} strokeWidth={3} />
        <rect x={105} y={142} width={13} height={20} rx={5} fill="#2b221a" stroke={accent} strokeWidth={3} />
      </g>
      {pose === "panic" && <AlarmLines frame={frame} />}
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
