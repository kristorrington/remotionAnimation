import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { SceneCameraPush } from "../motion/primitives";
import { useImpactShake } from "../motion/cinematics";

// AiNews2Scenes — the logo-driven scene library for the AI-news roundup, in the
// BOLD NEWSROOM style (Kris, Aug 2026): crisp near-white stage, ONE strong
// brand colour used decisively, black CONDENSED-IMPACT type (Anton headlines /
// Oswald numbers+labels), dark news blocks, saturated data. Scoped to AiNews2 —
// the shared paper/cinematic themes stay untouched. Every lab rides its real
// logo; everything is frame-driven and pins to the VO via per-element `at`.

const { fontFamily: OSWALD } = loadOswald("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const { fontFamily: ANTON } = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
export const DISPLAY = OSWALD; // condensed workhorse — numbers, labels, kickers
export const HERO = ANTON; // ultra-condensed impact — scene headlines
export const NEWS = {
  bg: "#FBFAF7", ink: "#141210", inkDim: "rgba(20,18,16,0.56)",
  brand: "#D9502E", dark: "#17150F",
  green: "#1E9E57", amber: "#E0A016", red: "#D8392B", blue: "#2C6BD4",
};
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

// A dark newsroom "block" (white text) with a coloured top accent — the house card.
const block = (accent: string): React.CSSProperties => ({
  background: NEWS.dark, borderRadius: 12,
  borderTop: `4px solid ${accent}`,
  border: `1px solid rgba(20,18,16,0.10)`,
  boxShadow: "0 14px 34px rgba(20,18,16,0.16)",
});

// Near-white newsroom stage: faint dot grid + light brand-tint corner wash,
// impact shake + a slow push. Flat (no aurora/particles). `header` (the
// headline) sits pinned at the TOP; `children` (the image / b-roll) sit in the
// centred area below it (Kris: text above the visual).
export const NewsShell: React.FC<{ durationInFrames: number; children: React.ReactNode; header?: React.ReactNode; tint?: string; impacts?: number[] }>
  = ({ children, header, tint = NEWS.brand, impacts }) => {
  const shake = useImpactShake(impacts ?? []);
  return (
    <AbsoluteFill style={{ backgroundColor: NEWS.bg, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(20,18,16,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.7 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 116%, ${tint}14, transparent 70%)`, pointerEvents: "none" }} />
      <SceneCameraPush>
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: header ? "flex-start" : "center", padding: header ? "96px 80px 92px" : 0, transform: `translate(${shake.x}px, ${shake.y}px)` }}>
          {header}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>{children}</div>
        </AbsoluteFill>
      </SceneCameraPush>
    </AbsoluteFill>
  );
};

// Condensed-impact headline: Oswald tracked kicker (brand) + Anton title (ink)
// + a thick brand underline. Auto-fits so it never wraps.
export const NewsHeadline: React.FC<{ kicker?: string; title: string; titleSize?: number; accent?: string }>
  = ({ kicker, title, titleSize = 96, accent = NEWS.brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fitted = React.useMemo(
    () => Math.min(titleSize, fitText({ text: title, withinWidth: 1600, fontFamily: HERO, fontWeight: 400, letterSpacing: "1px" }).fontSize),
    [title, titleSize],
  );
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  const titleScale = interpolate(slam, [0, 1], [1.22, 1]);
  const titleOp = interpolate(frame, [6, 20], [0, 1], CLAMP);
  const kickerOp = interpolate(frame, [0, 14], [0, 1], CLAMP);
  const uw = interpolate(slam, [0, 1], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
      {kicker ? <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 5, textTransform: "uppercase", color: accent, opacity: kickerOp }}>{kicker}</span> : null}
      <div style={{ opacity: titleOp, transform: `scale(${titleScale})`, fontFamily: HERO, fontWeight: 400, fontSize: fitted, letterSpacing: 1, color: NEWS.ink, lineHeight: 0.98, textTransform: "uppercase", whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ width: interpolate(uw, [0, 1], [40, 190]), height: 6, background: accent, borderRadius: 3, marginTop: 4 }} />
    </div>
  );
};

// ── NewsKinetic — a big condensed line with ONE word boxed in the brand colour
// (replaces the paper KineticText for transition punches). ────────────────────
export const NewsKinetic: React.FC<{ durationInFrames: number; tint?: string; text: string; highlight?: string; size?: number }>
  = ({ tint = NEWS.brand, text, highlight, size = 118 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: frame - 4, fps, config: { stiffness: 190, damping: 22, mass: 0.9 }, durationInFrames: 28 });
  const words = text.split(" ");
  const hnorm = (highlight ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return (
    <NewsShell durationInFrames={0} tint={tint}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: Math.round(size * 0.26), maxWidth: 1560, transform: `scale(${interpolate(slam, [0, 1], [1.18, 1])})`, opacity: interpolate(frame, [4, 16], [0, 1], CLAMP) }}>
        {words.map((w, i) => {
          const hot = !!hnorm && w.replace(/[^A-Za-z0-9]/g, "").toUpperCase() === hnorm;
          return (
            <span key={i} style={{ fontFamily: HERO, fontWeight: 400, fontSize: size, lineHeight: 1.02, letterSpacing: 1, textTransform: "uppercase", color: hot ? "#fff" : NEWS.ink, background: hot ? NEWS.brand : "transparent", padding: hot ? "2px 0.2em" : 0, borderRadius: hot ? 8 : 0 }}>{w}</span>
          );
        })}
      </div>
    </NewsShell>
  );
};

// ── NewsTakeaway — kicker + condensed headline + a dark stamp (verdict beats) ──
export const NewsTakeaway: React.FC<{ durationInFrames: number; tint?: string; kicker: string; title: string; stamp?: string; stampAt?: number; titleSize?: number }>
  = ({ durationInFrames, tint = NEWS.brand, kicker, title, stamp, stampAt = 60, titleSize = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampS = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} impacts={stamp ? [stampAt] : undefined}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <NewsHeadline kicker={kicker} title={title} titleSize={titleSize} accent={NEWS.brand} />
        {stamp ? (
          <div style={{ padding: "12px 30px", borderRadius: 10, background: NEWS.dark, transform: `rotate(-1.5deg) scale(${interpolate(stampS, [0, 1], [1.5, 1])})`, opacity: interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP), boxShadow: "0 14px 36px rgba(20,18,16,0.24)" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 42, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{stamp}</span>
          </div>
        ) : null}
      </div>
    </NewsShell>
  );
};

// ── ClipCard — a play-framed film card for muted official-footage montages ────
export const NewsClipCard: React.FC<{ durationInFrames: number; tint?: string; kicker: string; title: string; clip: string; source: string }>
  = ({ durationInFrames, tint = NEWS.brand, kicker, title, clip, source }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, 4, 26);
  const cardW = 1180, cardH = 620;
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={66} accent={NEWS.brand} />}>
      <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 14, overflow: "hidden", background: NEWS.dark, border: `1px solid rgba(20,18,16,0.14)`, boxShadow: "0 22px 54px rgba(20,18,16,0.28)", transform: `scale(${interpolate(e, [0, 1], [0.92, 1])})`, opacity: interpolate(frame, [4, 16], [0, 1], CLAMP) }}>
        <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", borderRadius: 8, background: "rgba(10,9,8,0.66)", border: `1px solid ${NEWS.brand}` }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: NEWS.red }} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>· Official film</span>
        </div>
        <div style={{ position: "absolute", bottom: 12, right: 16, fontFamily: DISPLAY, fontWeight: 500, fontSize: 17, color: "rgba(255,255,255,0.7)" }}>{source}</div>
      </div>
    </NewsShell>
  );
};

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
// Dreamina (its wordmark is white). Springs in, then holds still.
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
        width: tileW, height: h, borderRadius: h * 0.16,
        background: dark ? "#17150F" : "#FFFFFF",
        border: dark ? "1px solid rgba(255,255,255,0.14)" : "1.5px solid rgba(20,18,16,0.16)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 12px 26px rgba(20,18,16,0.18)`,
      }}>
        <Img src={staticFile(L.src)} style={{ height: logoH, width: "auto", maxWidth: tileW - h * 0.4, objectFit: "contain" }} />
      </div>
      {label && <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: labelSize ?? h * 0.16, letterSpacing: 1, textTransform: "uppercase", color: labelColor ?? NEWS.ink, whiteSpace: "nowrap", transform: "translateZ(0)" }}>{label}</span>}
    </div>
  );
};

// small drawn tick / cross (avoids inconsistent unicode glyph rendering)
const Tick: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = NEWS.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="11" fill={color} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = NEWS.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="11" fill={color} />
    <path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
  </svg>
);

// ── LogoGrid — the hook lineup + "also this week" (many logos at once) ─────────
export const LogoGrid: React.FC<{
  durationInFrames: number; particleSeed?: number; tint?: string; kicker: string; title: string;
  titleSize?: number; tileH?: number; maxW?: number;
  items: { logo: LogoKey; at: number; label?: string; tilt?: number }[];
}> = ({ durationInFrames, tint = NEWS.brand, kicker, title, titleSize = 92, tileH = 150, maxW = 1560, items }) => (
  <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={titleSize} accent={NEWS.brand} />}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 34, maxWidth: maxW, justifyContent: "center", alignItems: "flex-start" }}>
      {items.map((it) => (
        <LabTile key={it.logo + it.at} logo={it.logo} h={tileH} at={it.at} label={it.label} tilt={it.tilt ?? 0} />
      ))}
    </div>
  </NewsShell>
);

// ── LogoTitle — a section opener: one big lab tile + kicker/title ──────────────
export const LogoTitle: React.FC<{
  durationInFrames: number; particleSeed?: number; tint?: string; logo: LogoKey; kicker: string; title: string; titleSize?: number;
}> = ({ durationInFrames, tint = NEWS.brand, logo, kicker, title, titleSize = 84 }) => (
  <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={titleSize} accent={NEWS.brand} />}>
    <LabTile logo={logo} h={220} at={6} />
  </NewsShell>
);

// ── CostFaceoff — two labs, same bug fixed, wildly different cost ──────────────
export const CostFaceoff: React.FC<{
  durationInFrames: number; tint?: string;
  leftLogo: LogoKey; leftCost: string; rightLogo: LogoKey; rightCost: string;
  fixedAt: number; gapAt: number; stampText: string; stampAt: number; kicker: string; title: string;
}> = ({ durationInFrames, leftLogo, leftCost, rightLogo, rightCost, fixedAt, stampText, stampAt, kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Card: React.FC<{ logo: LogoKey; cost: string; col: string; at: number }> = ({ logo, cost, col, at }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 430, padding: "30px 30px 34px", ...block(col), display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${interpolate(e, [0, 1], [44, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <LabTile logo={logo} h={122} at={at + 4} />
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 108, lineHeight: 0.9, color: "#fff", transform: "translateZ(0)" }}>{cost}</span>
      </div>
    );
  };
  const fx = spr(frame, fps, fixedAt, 22);
  const stampS = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  return (
    <NewsShell durationInFrames={durationInFrames} tint={NEWS.brand} impacts={[stampAt]} header={<NewsHeadline kicker={kicker} title={title} titleSize={78} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: NEWS.green, opacity: interpolate(frame, [fixedAt, fixedAt + 8], [0, 1], CLAMP), transform: `scale(${interpolate(fx, [0, 1], [0.8, 1])})` }}>
          <Tick size={28} color={NEWS.dark} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>Same bug · both fixed</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <Card logo={leftLogo} cost={leftCost} col={NEWS.green} at={12} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 48, color: NEWS.inkDim, transform: "translateZ(0)" }}>VS</span>
          <Card logo={rightLogo} cost={rightCost} col={NEWS.red} at={30} />
        </div>
        <div style={{ marginTop: 2, padding: "12px 30px", borderRadius: 10, background: NEWS.brand, transform: `rotate(-2deg) scale(${interpolate(stampS, [0, 1], [1.5, 1])})`, opacity: interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP), boxShadow: `0 14px 36px ${NEWS.brand}55` }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 46, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{stampText}</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── VerdictSplit — CONFIRMED vs NOT CONFIRMED (reused for section verdicts) ────
export const VerdictSplit: React.FC<{
  durationInFrames: number; particleSeed?: number; tint?: string; kicker: string; title: string;
  leftAt: number; rightAt: number; leftLabel: string; leftSub: string; rightLabel: string; rightSub: string;
}> = ({ durationInFrames, tint = NEWS.brand, kicker, title, leftAt, rightAt, leftLabel, leftSub, rightLabel, rightSub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Chip: React.FC<{ at: number; col: string; ok: boolean; tag: string; sub: string }> = ({ at, col, ok, tag, sub }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 500, padding: "34px 34px", ...block(col), display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `translateY(${interpolate(e, [0, 1], [44, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {ok ? <Tick size={38} color={col} /> : <Cross size={38} color={col} />}
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", transform: "translateZ(0)" }}>{tag}</span>
        </div>
        <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 27, color: "rgba(255,255,255,0.8)", transform: "translateZ(0)" }}>{sub}</span>
      </div>
    );
  };
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={78} accent={NEWS.brand} />}>
      <div style={{ display: "flex", gap: 34 }}>
        <Chip at={leftAt} col={NEWS.green} ok tag={leftLabel} sub={leftSub} />
        <Chip at={rightAt} col={NEWS.red} ok={false} tag={rightLabel} sub={rightSub} />
      </div>
    </NewsShell>
  );
};

// ── PriceCutsScene — OpenAI's two official cuts (Luna −80% / Terra −20%) ───────
export const PriceCutsScene: React.FC<{ durationInFrames: number; tint?: string; at1: number; at2: number }>
  = ({ durationInFrames, tint = NEWS.brand, at1, at2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Row: React.FC<{ at: number; name: string; pct: string; big: boolean }> = ({ at, name, pct, big }) => {
    const e = spr(frame, fps, at, 26);
    const count = Math.round(interpolate(frame, [at + 4, at + 28], [0, parseInt(pct)], CLAMP));
    return (
      <div style={{ width: 860, padding: big ? "26px 40px" : "22px 40px", ...block(NEWS.green), display: "flex", alignItems: "center", gap: 26, transform: `translateX(${interpolate(e, [0, 1], [-46, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 600, fontSize: big ? 42 : 36, letterSpacing: 1, textTransform: "uppercase", color: "#fff", transform: "translateZ(0)" }}>{name}</span>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: big ? 90 : 66, lineHeight: 1, color: NEWS.green, transform: "translateZ(0)" }}>−{count}%</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", width: 120, textAlign: "right" }}>Cheaper</span>
      </div>
    );
  };
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="OpenAI · Official" title="TWO PRICE CUTS" titleSize={70} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <LabTile logo="openai" h={116} at={4} />
        <Row at={at1} name="GPT-5.6 Luna" pct="80" big />
        <Row at={at2} name="GPT-5.6 Terra" pct="20" big={false} />
      </div>
    </NewsShell>
  );
};

// ── PriceWarScene — DeepSeek vs OpenAI, price dropping, "PRICE WAR" ────────────
export const PriceWarScene: React.FC<{ durationInFrames: number; tint?: string; dropAt: number; stampAt: number }>
  = ({ durationInFrames, tint = NEWS.amber, dropAt, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spr(frame, fps, dropAt, 40);
  const stampS = spring({ frame: frame - stampAt, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
  const barH = interpolate(drop, [0, 1], [280, 70]);
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} impacts={[stampAt]} header={<NewsHeadline kicker="Timing is no accident" title="THE RACE TO THE BOTTOM" titleSize={72} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          <LabTile logo="deepseek" h={140} at={8} label="Low-cost model" labelSize={22} />
          {/* falling price bar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: 300, justifyContent: "flex-end" }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: NEWS.red }}>Price</span>
            <div style={{ width: 74, height: barH, borderRadius: 10, background: `linear-gradient(180deg, ${NEWS.amber}, ${NEWS.red})`, boxShadow: `0 0 22px ${NEWS.red}55` }} />
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 48, color: NEWS.red, transform: "translateZ(0)" }}>↓</span>
          </div>
          <LabTile logo="openai" h={140} at={22} label="Cuts to match" labelSize={22} />
        </div>
        <div style={{ padding: "12px 34px", borderRadius: 10, background: NEWS.red, transform: `rotate(-2deg) scale(${interpolate(stampS, [0, 1], [1.6, 1])})`, opacity: interpolate(frame, [stampAt, stampAt + 8], [0, 1], CLAMP), boxShadow: `0 14px 40px ${NEWS.red}55` }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 50, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Price War</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── TokenPriceScene — one model's per-token price (Terra $2 / $12) ─────────────
export const TokenPriceScene: React.FC<{
  durationInFrames: number; tint?: string; logo: LogoKey; model: string; inCost: string; outCost: string; at: number; kicker: string; title: string;
}> = ({ durationInFrames, tint = NEWS.brand, logo, model, inCost, outCost, at, kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Chip: React.FC<{ label: string; val: string; a: number }> = ({ label, val, a }) => {
    const e = spr(frame, fps, a, 24);
    return (
      <div style={{ width: 340, padding: "26px 30px", ...block(NEWS.brand), display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [a, a + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>{label}</span>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 84, lineHeight: 1, color: "#fff", transform: "translateZ(0)" }}>{val}</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 18, color: "rgba(255,255,255,0.5)" }}>/ 1M tokens</span>
      </div>
    );
  };
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={72} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <LabTile logo={logo} h={116} at={4} label={model} labelSize={24} />
        <div style={{ display: "flex", gap: 34 }}>
          <Chip label="Input" val={inCost} a={at} />
          <Chip label="Output" val={outCost} a={at + 12} />
        </div>
      </div>
    </NewsShell>
  );
};

// ── TypoScene — $120 struck out, corrected to $1.20 ("treat it as a typo") ─────
export const TypoScene: React.FC<{ durationInFrames: number; tint?: string; strikeAt: number; fixAt: number }>
  = ({ durationInFrames, tint = NEWS.amber, strikeAt, fixAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(frame, [strikeAt, strikeAt + 16], [0, 1], CLAMP);
  const fixE = spr(frame, fps, fixAt, 24);
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="A number going round that looks wrong" title="IT'S A TYPO" titleSize={82} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <LabTile logo="openai" h={100} at={4} label="GPT-5.6 Luna · Output" labelSize={20} />
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 132, lineHeight: 1, color: NEWS.inkDim, transform: "translateZ(0)" }}>$120</span>
            <div style={{ position: "absolute", top: "52%", left: -6, width: `${strike * 112}%`, height: 8, background: NEWS.red, borderRadius: 4 }} />
          </div>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 56, color: NEWS.inkDim, opacity: interpolate(frame, [fixAt - 6, fixAt + 4], [0, 1], CLAMP) }}>→</span>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 150, lineHeight: 1, color: NEWS.green, transform: `scale(${interpolate(fixE, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [fixAt, fixAt + 6], [0, 1], CLAMP) }}>$1.20</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── MysteryModelScene — a name that appeared in a promo, then vanished ─────────
export const MysteryModelScene: React.FC<{ durationInFrames: number; tint?: string; name: string; showAt: number; vanishAt: number; kicker: string; title: string; logo: LogoKey }>
  = ({ durationInFrames, tint = NEWS.red, name, showAt, vanishAt, kicker, title, logo }) => {
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
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={74} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <LabTile logo={logo} h={116} at={4} label="In a promotional video" labelSize={22} />
        <div style={{ position: "relative", width: 640, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* the name card */}
          <div style={{ position: "absolute", padding: "26px 60px", ...block(NEWS.brand), transform: `translateX(${jitter}px) scale(${interpolate(appear, [0, 1], [0.7, 1])})`, opacity: Math.min(interpolate(frame, [showAt, showAt + 8], [0, 1], CLAMP), gone) * flick }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 100, letterSpacing: 2, textTransform: "uppercase", color: "#fff", transform: "translateZ(0)", textShadow: g > 0 ? `${jitter}px 0 ${NEWS.red}, ${-jitter}px 0 ${NEWS.blue}` : "none" }}>{name}</span>
          </div>
          {/* the "?" that remains */}
          <span style={{ position: "absolute", fontFamily: HERO, fontWeight: 400, fontSize: 160, color: NEWS.inkDim, opacity: qOp, transform: "translateZ(0)" }}>?</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── LeaderboardLeakScene — an anonymous entry that "beats Fable 5" ─────────────
export const LeaderboardLeakScene: React.FC<{ durationInFrames: number; tint?: string; rowsAt: number; claimAt: number }>
  = ({ durationInFrames, tint = NEWS.blue, rowsAt, claimAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { rank: "1", name: "Kinsley", tag: "??? anonymous", hot: true },
    { rank: "2", name: "Fable 5", tag: "Anthropic", hot: false },
    { rank: "3", name: "GPT-5.6 Sol", tag: "OpenAI", hot: false },
  ];
  const claim = spr(frame, fps, claimAt, 22);
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="Qwen's mystery model" title="AN ANONYMOUS ENTRY" titleSize={76} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: NEWS.inkDim, opacity: interpolate(frame, [rowsAt - 6, rowsAt + 6], [0, 1], CLAMP) }}>Anonymous AI leaderboard</span>
        <div style={{ width: 860, display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r, i) => {
            const at = rowsAt + i * 10;
            const e = spr(frame, fps, at, 24);
            return (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 26px", ...block(r.hot ? NEWS.brand : "#8A857C"), transform: `translateX(${interpolate(e, [0, 1], [-40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP), boxShadow: r.hot ? `0 18px 46px rgba(20,18,16,0.2), 0 0 30px ${NEWS.brand}44` : "0 12px 30px rgba(20,18,16,0.14)" }}>
                <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 44, color: "#fff", width: 46, transform: "translateZ(0)" }}>{r.rank}</span>
                <span style={{ flex: 1, fontFamily: HERO, fontWeight: 400, fontSize: 38, letterSpacing: 1, textTransform: "uppercase", color: "#fff", transform: "translateZ(0)" }}>{r.name}</span>
                {r.name === "Kinsley" && <LabTile logo="qwen" h={52} at={at + 6} />}
                {r.name === "Fable 5" && <LabTile logo="claude" h={52} at={at + 6} />}
                <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.75)", width: 200, textAlign: "right" }}>{r.tag}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: 999, background: NEWS.red, transform: `scale(${interpolate(claim, [0, 1], [0.8, 1])})`, opacity: interpolate(frame, [claimAt, claimAt + 8], [0, 1], CLAMP) }}>
          <Cross size={26} color={NEWS.dark} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>Qwen hasn't confirmed it</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── LevelCard — one rung of the 3-level evidence rule (used ×3) ────────────────
export const LevelCard: React.FC<{
  durationInFrames: number; particleSeed?: number; tint?: string; accent: string;
  n: number; label: string; chips: string[]; chipAts: number[]; tagline: string; tagAt: number;
  logos?: LogoKey[];
}> = ({ durationInFrames, tint, accent, n, label, chips, chipAts, tagline, tagAt, logos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nE = spr(frame, fps, 4, 26);
  const tagE = spr(frame, fps, tagAt, 22);
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint ?? accent}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(nE, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [4, 12], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: accent }}>Level</span>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 160, lineHeight: 0.82, color: accent, transform: "translateZ(0)" }}>{n}</span>
          </div>
          <div style={{ width: 5, height: 150, background: accent, borderRadius: 2, opacity: 0.4 }} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 66, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink, transform: "translateZ(0)" }}>{label}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 1140, justifyContent: "center" }}>
          {chips.map((c, i) => {
            const at = chipAts[i] ?? 20 + i * 10;
            const e = spr(frame, fps, at, 22);
            const tilt = [-2, 2, -1.5, 1.5][i % 4];
            return (
              <div key={c} style={{ padding: "14px 26px", borderRadius: 10, background: accent, transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP), boxShadow: `0 10px 24px ${accent}44` }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 30, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap", transform: "translateZ(0)" }}>{c}</span>
              </div>
            );
          })}
        </div>
        {logos && (
          <div style={{ display: "flex", gap: 22, alignItems: "center", opacity: interpolate(frame, [tagAt - 8, tagAt], [0, 1], CLAMP) }}>
            {logos.map((lg, i) => (
              <div key={lg} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LabTile logo={lg} h={66} at={tagAt - 6 + i * 6} />
                <Tick size={26} color={accent} />
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: "12px 30px", borderRadius: 10, background: NEWS.dark, transform: `rotate(-1.5deg) scale(${interpolate(tagE, [0, 1], [1.4, 1])})`, opacity: interpolate(frame, [tagAt, tagAt + 8], [0, 1], CLAMP), boxShadow: `0 14px 36px rgba(20,18,16,0.24)` }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{tagline}</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── EvidenceRecap — the payoff: the week's claims sorted by evidence level ─────
type RecapItem = { logo: LogoKey; label: string; at: number };
export const EvidenceRecap: React.FC<{
  durationInFrames: number; tint?: string; title: string;
  level1: RecapItem[]; level2: RecapItem[]; level3: RecapItem[];
}> = ({ durationInFrames, tint = NEWS.brand, title, level1, level2, level3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Col: React.FC<{ n: number; head: string; col: string; items: RecapItem[]; ok: boolean }> = ({ n, head, col, items, ok }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: 450 }}>
      <div style={{ padding: "9px 22px", borderRadius: 8, background: col, boxShadow: `0 10px 26px ${col}44` }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>Level {n} · {head}</span>
      </div>
      {items.map((it) => {
        const e = spr(frame, fps, it.at, 24);
        return (
          <div key={it.label} style={{ width: "100%", padding: "14px 20px", ...block(col), display: "flex", alignItems: "center", gap: 16, transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
            <LabTile logo={it.logo} h={58} at={it.at + 3} />
            <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", transform: "translateZ(0)" }}>{it.label}</span>
            {ok ? <Tick size={30} color={col} /> : <Cross size={30} color={col} />}
          </div>
        );
      })}
    </div>
  );
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="This week, sorted by evidence" title={title} titleSize={76} accent={NEWS.brand} />}>
      <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
        <Col n={1} head="Official" col={NEWS.green} items={level1} ok />
        <Col n={2} head="Reported" col={NEWS.amber} items={level2} ok={false} />
        <Col n={3} head="Rumour" col={NEWS.red} items={level3} ok={false} />
      </div>
    </NewsShell>
  );
};

// ── Watchlist — what would change the ranking (checklist with logos) ───────────
export const Watchlist: React.FC<{ durationInFrames: number; tint?: string; items: { logo: LogoKey; text: string; at: number }[] }>
  = ({ durationInFrames, tint = NEWS.brand, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="The next official post changes everything" title="WHAT I'M WATCHING NEXT" titleSize={72} accent={NEWS.brand} />}>
      <div style={{ width: 920, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it) => {
          const e = spr(frame, fps, it.at, 24);
          return (
            <div key={it.text} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 26px", ...block(NEWS.brand), transform: `translateX(${interpolate(e, [0, 1], [-42, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, border: "2.5px solid rgba(255,255,255,0.7)" }} />
              <LabTile logo={it.logo} h={58} at={it.at + 4} />
              <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 600, fontSize: 32, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", transform: "translateZ(0)" }}>{it.text}</span>
            </div>
          );
        })}
      </div>
    </NewsShell>
  );
};

// ── DontChips — three "X isn't Y" cautions ────────────────────────────────────
export const DontChips: React.FC<{ durationInFrames: number; tint?: string; items: { a: string; b: string; at: number }[] }>
  = ({ durationInFrames, tint = NEWS.red, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="Until something stronger appears" title="DON'T CONFUSE THESE" titleSize={72} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((it) => {
          const e = spr(frame, fps, it.at, 24);
          return (
            <div key={it.a} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 34px", ...block(NEWS.red), transform: `translateX(${interpolate(e, [0, 1], [-44, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", width: 420, textAlign: "right", transform: "translateZ(0)" }}>{it.a}</span>
              <Cross size={40} color={NEWS.red} />
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", width: 320, transform: "translateZ(0)" }}>{it.b}</span>
            </div>
          );
        })}
      </div>
    </NewsShell>
  );
};
