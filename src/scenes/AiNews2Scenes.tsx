import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { glassCard } from "../motion/subjects";
import { FONT, SERIF } from "../components/overlayUI";
import { PALETTE } from "../motion/editkit";

// AiNews2Scenes — the logo-driven scene library for the AI-news roundup
// (DeepSeek V4 Flash / OpenAI price cuts + Mew3 / Qwen Kinsley / the 3-level
// evidence rule). Kris's brief: "use as many company logos as possible". Every
// lab rides a white "print sticker" tile on the ivory paper (§8/§13); claim
// cards are the dark-glass house sticker. Everything is frame-driven and pins
// to the VO via per-element `at` props (no hardcoded staggers).

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const INK = "#1F1E1D";
const GREEN = PALETTE.win;
const AMBER = PALETTE.cost;
const RED = PALETTE.danger;
const OPUS = PALETTE.opus;

const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

// ── LOGO REGISTRY ────────────────────────────────────────────────────────────
const LG = "assets/external/logos";
export type LogoKey = "deepseek" | "openai" | "qwen" | "glm" | "minimax" | "google" | "dreamina" | "claude";
const LOGOS: Record<LogoKey, { src: string; aspect: number; glow: string; bg: "light" | "dark" }> = {
  deepseek: { src: `${LG}/deepseek.svg`, aspect: 4.76, glow: "rgba(77,107,254,0.45)", bg: "light" },
  openai: { src: `${LG}/openai.svg`, aspect: 1, glow: "rgba(16,163,127,0.4)", bg: "light" },
  qwen: { src: `${LG}/qwen.svg`, aspect: 3.4, glow: "rgba(97,92,237,0.42)", bg: "light" },
  glm: { src: `${LG}/glm-zai.svg`, aspect: 1, glow: "rgba(31,99,236,0.42)", bg: "light" },
  minimax: { src: `${LG}/minimax.svg`, aspect: 1.19, glow: "rgba(228,23,127,0.4)", bg: "light" },
  google: { src: `${LG}/google.svg`, aspect: 1, glow: "rgba(66,133,244,0.4)", bg: "light" },
  dreamina: { src: `${LG}/dreamina.png`, aspect: 3.75, glow: "rgba(120,90,220,0.45)", bg: "dark" },
  claude: { src: `${LG}/anthropic-claude.png`, aspect: 1, glow: "rgba(217,119,87,0.5)", bg: "light" },
};

// A lab logo on a rounded "print sticker" tile — white for most, dark for
// Dreamina (its wordmark is white). Springs in, then holds still (§13.17).
export const LabTile: React.FC<{ logo: LogoKey; h?: number; at?: number; tilt?: number; label?: string; labelColor?: string; labelSize?: number }>
  = ({ logo, h = 150, at = 0, tilt = 0, label, labelColor, labelSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = LOGOS[logo];
  const e = spr(frame, fps, at, 26);
  const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  const asp = Math.min(Math.max(L.aspect, 1), 3.4);
  const logoH = h * 0.54;
  const tileW = Math.min(h * 3.6, logoH * asp + h * 0.55);
  const dark = L.bg === "dark";
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2, tilt], CLAMP)}deg) scale(${interpolate(e, [0, 1], [0.82, 1])})`,
      opacity: op,
    }}>
      <div style={{
        width: tileW, height: h, borderRadius: h * 0.18,
        background: dark ? "#201E1C" : "#FFFFFF",
        border: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(31,30,29,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 14px 34px rgba(31,30,29,0.16), 0 0 ${h * 0.2}px ${L.glow}`,
      }}>
        <Img src={staticFile(L.src)} style={{ height: logoH, width: "auto", maxWidth: tileW - h * 0.4, objectFit: "contain" }} />
      </div>
      {label && <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: labelSize ?? h * 0.15, letterSpacing: 1, color: labelColor ?? INK, whiteSpace: "nowrap", transform: "translateZ(0)" }}>{label}</span>}
    </div>
  );
};

// small drawn tick / cross (avoids inconsistent unicode glyph rendering)
const Tick: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = GREEN }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="11" fill={color} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = RED }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="11" fill={color} />
    <path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
  </svg>
);

// ── LogoGrid — the hook lineup + "also this week" (many logos at once) ─────────
export const LogoGrid: React.FC<{
  durationInFrames: number; particleSeed: number; tint: string; kicker: string; title: string;
  titleSize?: number; tileH?: number; maxW?: number;
  items: { logo: LogoKey; at: number; label?: string; tilt?: number }[];
}> = ({ durationInFrames, particleSeed, tint, kicker, title, titleSize = 58, tileH = 132, maxW = 1560, items }) => (
  <SceneShell durationInFrames={durationInFrames} particleSeed={particleSeed} tint={tint}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 30, maxWidth: maxW, justifyContent: "center", alignItems: "flex-start" }}>
        {items.map((it) => (
          <LabTile key={it.logo + it.at} logo={it.logo} h={tileH} at={it.at} label={it.label} tilt={it.tilt ?? 0} />
        ))}
      </div>
      <SceneHeadline kicker={kicker} title={title} titleSize={titleSize} accent={tint} />
    </div>
  </SceneShell>
);

// ── LogoTitle — a section opener: one big lab tile + kicker/title ──────────────
export const LogoTitle: React.FC<{
  durationInFrames: number; particleSeed: number; tint: string; logo: LogoKey; kicker: string; title: string; titleSize?: number;
}> = ({ durationInFrames, particleSeed, tint, logo, kicker, title, titleSize = 62 }) => (
  <SceneShell durationInFrames={durationInFrames} particleSeed={particleSeed} tint={tint}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      <LabTile logo={logo} h={208} at={6} />
      <SceneHeadline kicker={kicker} title={title} titleSize={titleSize} accent={tint} />
    </div>
  </SceneShell>
);

// ── CostFaceoff — two labs, same bug fixed, wildly different cost ──────────────
export const CostFaceoff: React.FC<{
  durationInFrames: number; tint: string;
  leftLogo: LogoKey; leftCost: string; rightLogo: LogoKey; rightCost: string;
  fixedAt: number; gapAt: number; stampText: string; stampAt: number; kicker: string; title: string;
}> = ({ durationInFrames, tint, leftLogo, leftCost, rightLogo, rightCost, fixedAt, gapAt, stampText, stampAt, kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Card: React.FC<{ logo: LogoKey; cost: string; col: string; at: number }> = ({ logo, cost, col, at }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 420, padding: "34px 30px 40px", borderRadius: 18, ...glassCard(col + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", gap: 22, transform: `translateY(${interpolate(e, [0, 1], [44, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <LabTile logo={logo} h={128} at={at + 4} />
        <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 92, lineHeight: 1, color: col === RED ? "#fff" : "#fff", transform: "translateZ(0)" }}>{cost}</span>
      </div>
    );
  };
  const fx = spr(frame, fps, fixedAt, 22);
  const stampS = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x51} tint={tint} impacts={[stampAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {/* same bug fixed */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 24px", borderRadius: 999, ...glassCard(GREEN + "cc", 2), opacity: interpolate(frame, [fixedAt, fixedAt + 8], [0, 1], CLAMP), transform: `scale(${interpolate(fx, [0, 1], [0.8, 1])})` }}>
          <Tick size={30} color={GREEN} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: "#fff" }}>SAME BUG · BOTH FIXED</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <Card logo={leftLogo} cost={leftCost} col={GREEN} at={12} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "rgba(31,30,29,0.4)", transform: "translateZ(0)" }}>vs</span>
          <Card logo={rightLogo} cost={rightCost} col={RED} at={30} />
        </div>
        {/* gap stamp */}
        <div style={{ marginTop: 4, padding: "12px 30px", borderRadius: 12, background: OPUS, transform: `rotate(-2deg) scale(${interpolate(stampS, [0, 1], [1.6, 1])})`, opacity: interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP), boxShadow: `0 14px 40px ${OPUS}66` }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 1, color: "#fff" }}>{stampText}</span>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={52} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── VerdictSplit — CONFIRMED vs NOT CONFIRMED (reused for section verdicts) ────
export const VerdictSplit: React.FC<{
  durationInFrames: number; particleSeed: number; tint: string; kicker: string; title: string;
  leftAt: number; rightAt: number; leftLabel: string; leftSub: string; rightLabel: string; rightSub: string;
}> = ({ durationInFrames, particleSeed, tint, kicker, title, leftAt, rightAt, leftLabel, leftSub, rightLabel, rightSub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Chip: React.FC<{ at: number; col: string; ok: boolean; tag: string; sub: string }> = ({ at, col, ok, tag, sub }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 500, padding: "34px 34px", borderRadius: 18, ...glassCard(col + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transform: `translateY(${interpolate(e, [0, 1], [44, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {ok ? <Tick size={40} color={col} /> : <Cross size={40} color={col} />}
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 1, color: "#fff", transform: "translateZ(0)" }}>{tag}</span>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, color: col, transform: "translateZ(0)" }}>{sub}</span>
      </div>
    );
  };
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={particleSeed} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", gap: 34 }}>
          <Chip at={leftAt} col={GREEN} ok tag={leftLabel} sub={leftSub} />
          <Chip at={rightAt} col={RED} ok={false} tag={rightLabel} sub={rightSub} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── PriceCutsScene — OpenAI's two official cuts (Luna −80% / Terra −20%) ───────
export const PriceCutsScene: React.FC<{ durationInFrames: number; tint: string; at1: number; at2: number }>
  = ({ durationInFrames, tint, at1, at2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Row: React.FC<{ at: number; name: string; pct: string; big: boolean }> = ({ at, name, pct, big }) => {
    const e = spr(frame, fps, at, 26);
    const count = Math.round(interpolate(frame, [at + 4, at + 28], [0, parseInt(pct)], CLAMP));
    return (
      <div style={{ width: 840, padding: big ? "30px 40px" : "24px 40px", borderRadius: 16, ...glassCard(GREEN + "cc", big ? 3 : 2), display: "flex", alignItems: "center", gap: 26, transform: `translateX(${interpolate(e, [0, 1], [-46, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ flex: 1, fontFamily: FONT, fontWeight: 900, fontSize: big ? 40 : 34, color: "#fff", transform: "translateZ(0)" }}>{name}</span>
        <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: big ? 84 : 60, lineHeight: 1, color: GREEN, transform: "translateZ(0)" }}>−{count}%</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: "rgba(255,255,255,0.65)", width: 120, textAlign: "right" }}>CHEAPER</span>
      </div>
    );
  };
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x52} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <LabTile logo="openai" h={128} at={4} label="OFFICIAL PRICE CUTS" labelColor={INK} labelSize={24} />
        <Row at={at1} name="GPT-5.6 LUNA" pct="80" big />
        <Row at={at2} name="GPT-5.6 TERRA" pct="20" big={false} />
      </div>
    </SceneShell>
  );
};

// ── PriceWarScene — DeepSeek vs OpenAI, price dropping, "PRICE WAR" ────────────
export const PriceWarScene: React.FC<{ durationInFrames: number; tint: string; dropAt: number; stampAt: number }>
  = ({ durationInFrames, tint, dropAt, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spr(frame, fps, dropAt, 40);
  const stampS = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  const barH = interpolate(drop, [0, 1], [280, 70]);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x53} tint={tint} impacts={[stampAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          <LabTile logo="deepseek" h={140} at={8} label="LOW-COST MODEL" labelColor={INK} labelSize={22} />
          {/* falling price bar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: 300, justifyContent: "flex-end" }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: RED }}>PRICE</span>
            <div style={{ width: 70, height: barH, borderRadius: 10, background: `linear-gradient(180deg, ${AMBER}, ${RED})`, boxShadow: `0 0 22px ${RED}66` }} />
            <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 44, color: RED, transform: "translateZ(0)" }}>↓</span>
          </div>
          <LabTile logo="openai" h={140} at={22} label="CUTS TO MATCH" labelColor={INK} labelSize={22} />
        </div>
        <div style={{ padding: "12px 32px", borderRadius: 12, background: RED, transform: `rotate(-2deg) scale(${interpolate(stampS, [0, 1], [1.6, 1])})`, opacity: interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP), boxShadow: `0 14px 40px ${RED}66` }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 2, color: "#fff" }}>PRICE WAR</span>
        </div>
        <SceneHeadline kicker="TIMING IS NO ACCIDENT" title="THE RACE TO THE BOTTOM" titleSize={52} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── TokenPriceScene — one model's per-token price (Terra $2 / $12) ─────────────
export const TokenPriceScene: React.FC<{
  durationInFrames: number; tint: string; logo: LogoKey; model: string; inCost: string; outCost: string; at: number; kicker: string; title: string;
}> = ({ durationInFrames, tint, logo, model, inCost, outCost, at, kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Chip: React.FC<{ label: string; val: string; a: number }> = ({ label, val, a }) => {
    const e = spr(frame, fps, a, 24);
    return (
      <div style={{ width: 320, padding: "26px 30px", borderRadius: 16, ...glassCard(OPUS + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [a, a + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: "rgba(255,255,255,0.7)" }}>{label}</span>
        <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 70, lineHeight: 1, color: "#fff", transform: "translateZ(0)" }}>{val}</span>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,0.55)" }}>/ 1M tokens</span>
      </div>
    );
  };
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x54} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <LabTile logo={logo} h={120} at={4} label={model} labelColor={INK} labelSize={24} />
        <div style={{ display: "flex", gap: 34 }}>
          <Chip label="INPUT" val={inCost} a={at} />
          <Chip label="OUTPUT" val={outCost} a={at + 12} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={52} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── TypoScene — $120 struck out, corrected to $1.20 ("treat it as a typo") ─────
export const TypoScene: React.FC<{ durationInFrames: number; tint: string; strikeAt: number; fixAt: number }>
  = ({ durationInFrames, tint, strikeAt, fixAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(frame, [strikeAt, strikeAt + 16], [0, 1], CLAMP);
  const fixE = spr(frame, fps, fixAt, 24);
  const stampS = spring({ frame: frame - fixAt - 6, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x55} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <LabTile logo="openai" h={116} at={4} label="GPT-5.6 LUNA · OUTPUT" labelColor={INK} labelSize={22} />
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 120, lineHeight: 1, color: "rgba(31,30,29,0.35)", transform: "translateZ(0)" }}>$120</span>
            <div style={{ position: "absolute", top: "52%", left: -6, width: `${strike * 112}%`, height: 7, background: RED, borderRadius: 4 }} />
          </div>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 54, color: "rgba(31,30,29,0.4)", opacity: interpolate(frame, [fixAt - 6, fixAt + 4], [0, 1], CLAMP) }}>→</span>
          <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 132, lineHeight: 1, color: GREEN, transform: `scale(${interpolate(fixE, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [fixAt, fixAt + 6], [0, 1], CLAMP) }}>$1.20</span>
        </div>
        <div style={{ padding: "10px 26px", borderRadius: 10, background: RED, transform: `rotate(-2deg) scale(${interpolate(stampS, [0, 1], [1.5, 1])})`, opacity: interpolate(frame, [fixAt + 6, fixAt + 14], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 2, color: "#fff" }}>ALMOST CERTAINLY A TYPO</span>
        </div>
        <SceneHeadline kicker="A NUMBER GOING ROUND THAT LOOKS WRONG" title="$120? IT'S $1.20" titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── MysteryModelScene — a name that appeared in a promo, then vanished ─────────
export const MysteryModelScene: React.FC<{ durationInFrames: number; tint: string; name: string; showAt: number; vanishAt: number; kicker: string; title: string; logo: LogoKey }>
  = ({ durationInFrames, tint, name, showAt, vanishAt, kicker, title, logo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spr(frame, fps, showAt, 24);
  // deterministic "glitch out": flicker + rgb-split jitter as it's removed
  const g = frame >= vanishAt ? Math.min(1, (frame - vanishAt) / 20) : 0;
  const jitter = g > 0 ? Math.sin(frame * 1.7) * 8 * g : 0;
  const flick = g > 0 ? 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.9)) : 1;
  const gone = interpolate(frame, [vanishAt + 20, vanishAt + 34], [1, 0], CLAMP);
  const qOp = interpolate(frame, [vanishAt + 24, vanishAt + 40], [0, 1], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x56} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <LabTile logo={logo} h={120} at={4} label="IN A PROMOTIONAL VIDEO" labelColor={INK} labelSize={22} />
        <div style={{ position: "relative", width: 620, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* the name card */}
          <div style={{ position: "absolute", padding: "30px 60px", borderRadius: 18, ...glassCard(OPUS + "cc", 2.5), transform: `translateX(${jitter}px) scale(${interpolate(appear, [0, 1], [0.7, 1])})`, opacity: Math.min(interpolate(frame, [showAt, showAt + 8], [0, 1], CLAMP), gone) * flick }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, letterSpacing: 2, color: "#fff", transform: "translateZ(0)", textShadow: g > 0 ? `${jitter}px 0 ${RED}, ${-jitter}px 0 ${PALETTE.sonnet}` : "none" }}>{name}</span>
          </div>
          {/* the "?" that remains */}
          <span style={{ position: "absolute", fontFamily: SERIF, fontWeight: 800, fontSize: 150, color: "rgba(31,30,29,0.45)", opacity: qOp, transform: "translateZ(0)" }}>?</span>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── LeaderboardLeakScene — an anonymous entry that "beats Fable 5" ─────────────
export const LeaderboardLeakScene: React.FC<{ durationInFrames: number; tint: string; rowsAt: number; claimAt: number }>
  = ({ durationInFrames, tint, rowsAt, claimAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { rank: "1", name: "Kinsley", tag: "??? anonymous", hot: true },
    { rank: "2", name: "Fable 5", tag: "Anthropic", hot: false },
    { rank: "3", name: "GPT-5.6 Sol", tag: "OpenAI", hot: false },
  ];
  const claim = spr(frame, fps, claimAt, 22);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x57} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: interpolate(frame, [rowsAt - 6, rowsAt + 6], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: "rgba(31,30,29,0.55)" }}>ANONYMOUS AI LEADERBOARD</span>
        </div>
        <div style={{ width: 820, display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r, i) => {
            const at = rowsAt + i * 10;
            const e = spr(frame, fps, at, 24);
            return (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 26px", borderRadius: 14, ...glassCard((r.hot ? OPUS : "#4a463f") + "cc", r.hot ? 3 : 2), transform: `translateX(${interpolate(e, [0, 1], [-40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP), boxShadow: r.hot ? `0 18px 46px rgba(31,30,29,0.2), 0 0 34px ${OPUS}55` : "0 12px 30px rgba(31,30,29,0.14)" }}>
                <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: "#fff", width: 44, transform: "translateZ(0)" }}>{r.rank}</span>
                <span style={{ flex: 1, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", transform: "translateZ(0)" }}>{r.name}</span>
                {r.name === "Kinsley" && <LabTile logo="qwen" h={52} at={at + 6} />}
                {r.name === "Fable 5" && <LabTile logo="claude" h={52} at={at + 6} />}
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: r.hot ? "#fff" : "rgba(255,255,255,0.7)", width: 190, textAlign: "right" }}>{r.tag}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: 999, ...glassCard(RED + "cc", 2), transform: `scale(${interpolate(claim, [0, 1], [0.8, 1])})`, opacity: interpolate(frame, [claimAt, claimAt + 8], [0, 1], CLAMP) }}>
          <Cross size={28} color={RED} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: "#fff" }}>QWEN HASN'T CONFIRMED IT</span>
        </div>
      </div>
    </SceneShell>
  );
};

// ── LevelCard — one rung of the 3-level evidence rule (used ×3) ────────────────
export const LevelCard: React.FC<{
  durationInFrames: number; particleSeed: number; tint: string; accent: string;
  n: number; label: string; chips: string[]; chipAts: number[]; tagline: string; tagAt: number;
  logos?: LogoKey[];
}> = ({ durationInFrames, particleSeed, tint, accent, n, label, chips, chipAts, tagline, tagAt, logos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nE = spr(frame, fps, 4, 26);
  const tagE = spr(frame, fps, tagAt, 22);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={particleSeed} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(nE, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [4, 12], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: accent }}>LEVEL</span>
            <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 150, lineHeight: 0.9, color: accent, transform: "translateZ(0)" }}>{n}</span>
          </div>
          <div style={{ width: 4, height: 150, background: accent, borderRadius: 2, opacity: 0.5 }} />
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: 1, color: INK, transform: "translateZ(0)" }}>{label}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 1100, justifyContent: "center" }}>
          {chips.map((c, i) => {
            const at = chipAts[i] ?? 20 + i * 10;
            const e = spr(frame, fps, at, 22);
            const tilt = [-2, 2, -1.5, 1.5][i % 4];
            return (
              <div key={c} style={{ padding: "16px 26px", borderRadius: 12, ...glassCard(accent + "cc", 2.5), transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#fff", whiteSpace: "nowrap", transform: "translateZ(0)" }}>{c}</span>
              </div>
            );
          })}
        </div>
        {logos && (
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {logos.map((lg, i) => (
              <div key={lg} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LabTile logo={lg} h={66} at={tagAt - 6 + i * 6} />
                <Tick size={26} color={accent} />
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: "12px 30px", borderRadius: 12, background: accent, transform: `rotate(-1.5deg) scale(${interpolate(tagE, [0, 1], [1.4, 1])})`, opacity: interpolate(frame, [tagAt, tagAt + 8], [0, 1], CLAMP), boxShadow: `0 14px 40px ${accent}55` }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, letterSpacing: 1, color: "#fff" }}>{tagline}</span>
        </div>
      </div>
    </SceneShell>
  );
};

// ── EvidenceRecap — the payoff: the week's claims sorted by evidence level ─────
type RecapItem = { logo: LogoKey; label: string; at: number };
export const EvidenceRecap: React.FC<{
  durationInFrames: number; tint: string; title: string;
  level1: RecapItem[]; level2: RecapItem[]; level3: RecapItem[];
}> = ({ durationInFrames, tint, title, level1, level2, level3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Col: React.FC<{ n: number; head: string; col: string; items: RecapItem[]; ok: boolean }> = ({ n, head, col, items, ok }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: 440 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: col, boxShadow: `0 10px 26px ${col}55` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 1, color: "#fff" }}>LEVEL {n} · {head}</span>
      </div>
      {items.map((it) => {
        const e = spr(frame, fps, it.at, 24);
        return (
          <div key={it.label} style={{ width: "100%", padding: "16px 20px", borderRadius: 14, ...glassCard(col + "cc", 2.5), display: "flex", alignItems: "center", gap: 16, transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
            <LabTile logo={it.logo} h={58} at={it.at + 3} />
            <span style={{ flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 25, color: "#fff", transform: "translateZ(0)" }}>{it.label}</span>
            {ok ? <Tick size={30} color={col} /> : <Cross size={30} color={col} />}
          </div>
        );
      })}
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x58} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
          <Col n={1} head="OFFICIAL" col={GREEN} items={level1} ok />
          <Col n={2} head="REPORTED" col={AMBER} items={level2} ok={false} />
          <Col n={3} head="RUMOUR" col={RED} items={level3} ok={false} />
        </div>
        <SceneHeadline kicker="THIS WEEK, SORTED BY EVIDENCE" title={title} titleSize={52} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── Watchlist — what would change the ranking (checklist with logos) ───────────
export const Watchlist: React.FC<{ durationInFrames: number; tint: string; items: { logo: LogoKey; text: string; at: number }[] }>
  = ({ durationInFrames, tint, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x59} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it) => {
            const e = spr(frame, fps, it.at, 24);
            return (
              <div key={it.text} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", borderRadius: 14, ...glassCard(OPUS + "cc", 2.5), transform: `translateX(${interpolate(e, [0, 1], [-42, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, border: "2.5px solid rgba(255,255,255,0.7)" }} />
                <LabTile logo={it.logo} h={58} at={it.at + 4} />
                <span style={{ flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#fff", transform: "translateZ(0)" }}>{it.text}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="THE NEXT OFFICIAL POST CHANGES EVERYTHING" title="WHAT I'M WATCHING NEXT" titleSize={52} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── DontChips — three "X isn't Y" cautions ────────────────────────────────────
export const DontChips: React.FC<{ durationInFrames: number; tint: string; items: { a: string; b: string; at: number }[] }>
  = ({ durationInFrames, tint, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x5a} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((it) => {
            const e = spr(frame, fps, it.at, 24);
            return (
              <div key={it.a} style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 30px", borderRadius: 14, ...glassCard(RED + "cc", 2.5), transform: `translateX(${interpolate(e, [0, 1], [-44, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#fff", width: 380, textAlign: "right", transform: "translateZ(0)" }}>{it.a}</span>
                <Cross size={38} color={RED} />
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#fff", width: 300, transform: "translateZ(0)" }}>{it.b}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="UNTIL SOMETHING STRONGER APPEARS" title="DON'T CONFUSE THESE" titleSize={52} accent={tint} />
      </div>
    </SceneShell>
  );
};
