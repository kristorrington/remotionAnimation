import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";

// Small frame-animated "cartoon" icons that illustrate each idea. Each uses its
// own useCurrentFrame (local to the card's Sequence) so it animates while shown.

const CYAN = "#D97757";
const BLUE = "#C15F3C";
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

// The standard treatment for ANY logo asset from the manifest: gentle float +
// tilt + pulse with a brand-colored glow. `mode: "tile"` frames it on a white
// rounded app-tile (for logos with a baked white background — record which in
// the asset manifest); `mode: "transparent"` shows the raw image.
export const LogoBadge: React.FC<{ src: string; size?: number; mode?: "tile" | "transparent"; glow?: string; float?: boolean }> = ({ src, size = 140, mode = "transparent", glow = "rgba(217,119,87,0.55)", float = true }) => {
  const frame = useCurrentFrame();
  const y = float ? 6 * Math.sin(frame * 0.06) : 0;
  const tilt = float ? 4 * Math.sin(frame * 0.05) : 0;
  const pulse = float ? 1 + 0.04 * Math.sin(frame * 0.12) : 1;
  if (mode === "tile") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.24,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transform: `translateY(${y}px) rotate(${tilt}deg) scale(${pulse})`,
          boxShadow: `0 0 ${size * 0.22}px ${glow}, 0 14px 34px rgba(0,0,0,0.45)`,
        }}
      >
        <Img src={src} style={{ width: size * 0.9, height: size * 0.9, objectFit: "contain" }} />
      </div>
    );
  }
  return (
    <Img
      src={src}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        transform: `translateY(${y}px) rotate(${tilt}deg) scale(${pulse})`,
        filter: `drop-shadow(0 0 ${size * 0.18}px ${glow})`,
      }}
    />
  );
};

// The DeepSeek whale — gently "swims" in a rounded app-tile (the source PNG has
// a white background) with a blue glow. No full spin (a spinning whale looks silly).
export const DeepSeekMark: React.FC<{ size?: number }> = ({ size = 140 }) => (
  <LogoBadge src={staticFile("deepseek-logo.png")} size={size} mode="tile" glow="rgba(77,107,254,0.6)" />
);

// The ChatGPT app icon — Kris's supplied official asset (white blossom on the
// teal tile, transparent corners). THE mark for ChatGPT in scenes/shorts;
// `maxWidth:none` dodges the Tailwind preflight img squish (AGENTS §9).
export const ChatGptMark: React.FC<{ size?: number; glow?: boolean }> = ({ size = 140, glow = false }) => (
  <Img
    src={staticFile("chatgpt-logo.png")}
    style={{ width: size, height: size, objectFit: "contain", maxWidth: "none", display: "block", filter: glow ? "drop-shadow(0 0 18px rgba(116,170,156,0.6))" : undefined }}
  />
);

// The OpenAI/ChatGPT blossom — native SVG recreation of the official mark
// (§10.8: OpenAI's domains bot-wall direct asset downloads, so the logomark
// is drawn from its canonical path instead of a fetched file). Vector-crisp
// at any size; gentle pulse; pass `color` for dark-on-light paper scenes.
export const OpenAiMark: React.FC<{ size?: number; color?: string; pulse?: boolean }> = ({ size = 140, color = "#1F1E1D", pulse = true }) => {
  const frame = useCurrentFrame();
  const s = pulse ? 1 + 0.05 * Math.sin(frame * 0.12) : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 320.1 320.1" style={{ transform: `scale(${s})` }}>
      <path
        fill={color}
        d="M297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.49zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89l.01-.01zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1h.02zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.35.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"
      />
    </svg>
  );
};

// Model "thinking" spinner — an arc sweeps around a faint track.
export const IconThinking: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const dash = 2 * Math.PI * 30;
  return (
    <Svg size={size}>
      <circle cx="50" cy="50" r="30" stroke="rgba(217,119,87,0.2)" strokeWidth="8" />
      <circle cx="50" cy="50" r="30" stroke={CYAN} strokeWidth="8" strokeDasharray={`${dash * 0.28} ${dash}`} transform={`rotate(${frame * 6} 50 50)`} />
    </Svg>
  );
};

// Clock — minute hand sweeps fast, hour hand slow (time passing / latency).
export const IconClock: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  return (
    <Svg size={size}>
      <circle cx="50" cy="50" r="34" stroke={BLUE} strokeWidth="6" />
      <line x1="50" y1="50" x2="50" y2="28" stroke={WHITE} strokeWidth="5" transform={`rotate(${frame * 6} 50 50)`} />
      <line x1="50" y1="50" x2="66" y2="50" stroke={CYAN} strokeWidth="5" transform={`rotate(${frame * 0.5} 50 50)`} />
      <circle cx="50" cy="50" r="4" fill={CYAN} />
    </Svg>
  );
};

// Lightning bolt — pulses (speed / energy).
export const IconBolt: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.6 + 0.4 * Math.sin(frame * 0.3);
  return (
    <Svg size={size}>
      <path d="M54 12 L28 54 H46 L42 88 L74 42 H52 Z" fill={AMBER} stroke={AMBER} strokeWidth="4" opacity={p} style={{ filter: `drop-shadow(0 0 ${10 * p}px ${AMBER})` }} />
    </Svg>
  );
};

// Rocket — bobs, flame flickers (faster).
export const IconRocket: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const y = -3 * Math.sin(frame * 0.3);
  const flame = 6 + 5 * Math.abs(Math.sin(frame * 0.6));
  return (
    <Svg size={size}>
      <g transform={`translate(0 ${y})`}>
        <path d="M50 16 C64 26 66 44 62 60 H38 C34 44 36 26 50 16 Z" fill={WHITE} stroke={BLUE} strokeWidth="4" />
        <circle cx="50" cy="38" r="6" fill={CYAN} />
        <path d="M38 60 L30 74 L42 66 Z" fill={BLUE} />
        <path d="M62 60 L70 74 L58 66 Z" fill={BLUE} />
        <path d={`M44 62 L50 ${68 + flame} L56 62 Z`} fill={AMBER} />
      </g>
    </Svg>
  );
};

// Cost dropping — a coin with a descending arrow.
export const IconCoinDown: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const dy = 3 * Math.sin(frame * 0.2);
  return (
    <Svg size={size}>
      <circle cx="50" cy="44" r="28" stroke={GREEN} strokeWidth="6" fill="rgba(52,211,153,0.12)" />
      <g transform={`translate(0 ${dy})`}>
        <line x1="50" y1="30" x2="50" y2="54" stroke={GREEN} strokeWidth="7" />
        <path d="M38 44 L50 58 L62 44" stroke={GREEN} strokeWidth="7" />
      </g>
    </Svg>
  );
};

// Padlock springing open (unlocked / now usable).
export const IconUnlock: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const open = Math.max(0, Math.min(1, (frame - 8) / 16));
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.2);
  return (
    <Svg size={size}>
      <rect x="30" y="48" width="40" height="34" rx="6" stroke={GREEN} strokeWidth="6" fill="rgba(52,211,153,0.1)" />
      <path d="M38 48 V38 A12 12 0 0 1 62 38 V44" stroke={GREEN} strokeWidth="6" transform={`rotate(${-34 * open} 38 48)`} />
      <circle cx="50" cy="63" r="5" fill={GREEN} opacity={glow} />
    </Svg>
  );
};

// Two-lobe brain with a pulsing core (intelligence / reasoning).
export const IconBrain: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.55 + 0.45 * Math.sin(frame * 0.2);
  return (
    <Svg size={size}>
      <path d="M40 24 C28 24 22 34 26 42 C18 46 18 58 28 62 C28 72 40 78 47 70 V30 C47 26 44 24 40 24 Z" stroke={BLUE} strokeWidth="5" fill="rgba(193,95,60,0.1)" />
      <path d="M60 24 C72 24 78 34 74 42 C82 46 82 58 72 62 C72 72 60 78 53 70 V30 C53 26 56 24 60 24 Z" stroke={CYAN} strokeWidth="5" fill="rgba(217,119,87,0.1)" />
      <circle cx="50" cy="48" r="5" fill={WHITE} opacity={p} style={{ filter: `drop-shadow(0 0 ${8 * p}px ${CYAN})` }} />
    </Svg>
  );
};

// Error triangle — pulses and shakes (something broke).
export const IconError: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  const p = 0.55 + 0.45 * Math.sin(frame * 0.4);
  const shake = 1.6 * Math.sin(frame * 0.9);
  return (
    <Svg size={size}>
      <g transform={`translate(${shake} 0)`}>
        <path d="M50 16 L86 80 H14 Z" stroke={RED} strokeWidth="6" fill="rgba(239,68,68,0.12)" opacity={0.6 + 0.4 * p} />
        <line x1="50" y1="40" x2="50" y2="62" stroke={RED} strokeWidth="7" />
        <circle cx="50" cy="72" r="3.5" fill={RED} />
      </g>
    </Svg>
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
      <path d="M50 12 L82 24 V50 C82 71 68 84 50 90 C32 84 18 71 18 50 V24 Z" stroke={CYAN} strokeWidth="6" fill="rgba(217,119,87,0.12)" />
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
