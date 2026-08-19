import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NEWS, DISPLAY, HERO } from "./AiNews2Scenes";

// WatermarkScenes — conceptual explainer kit for "Claude's Invisible Watermark"
// (Aug 2026). Premium-minimal per Kris's brief: clean cards, thin lines, one
// Claude burnt-orange accent (NEWS.brand), NO fake product UI — every detector
// visual is explicitly conceptual (ILLUSTRATION chip). Every element pins to a
// whisper `at`.

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ORANGE = NEWS.brand;
const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

const Stage: React.FC<{ tint?: string; children: React.ReactNode; header?: React.ReactNode }> = ({ tint = ORANGE, children, header }) => (
  <AbsoluteFill style={{ backgroundColor: NEWS.bg }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(20,18,16,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.7 }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 116%, ${tint}12, transparent 70%)` }} />
    {header}
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: header ? 120 : 0 }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

const Head: React.FC<{ kicker?: string; title: string; size?: number; accent?: string }> = ({ kicker, title, size = 60, accent = ORANGE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  return (
    <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", zIndex: 5 }}>
      {kicker ? <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: 5, textTransform: "uppercase", color: accent, opacity: interpolate(frame, [0, 14], [0, 1], CLAMP) }}>{kicker}</span> : null}
      <div style={{ fontFamily: HERO, fontWeight: 400, fontSize: size, letterSpacing: 1, color: NEWS.ink, lineHeight: 0.98, textTransform: "uppercase", whiteSpace: "nowrap", transform: `scale(${interpolate(slam, [0, 1], [1.14, 1])})`, opacity: interpolate(frame, [6, 20], [0, 1], CLAMP) }}>{title}</div>
      <div style={{ width: interpolate(slam, [0, 1], [40, 190], CLAMP), height: 6, background: accent, borderRadius: 3 }} />
    </div>
  );
};

const Chip: React.FC<{ at: number; text: string; color?: string; dark?: boolean; size?: number; rotate?: number; style?: React.CSSProperties }> = ({ at, text, color = ORANGE, dark, size = 38, rotate = -2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, at, 22);
  return (
    <div style={{ transform: `rotate(${rotate}deg) scale(${interpolate(e, [0, 1], [1.5, 1], CLAMP)})`, padding: "10px 28px", borderRadius: 10, background: dark ? NEWS.dark : color, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP), boxShadow: "0 14px 36px rgba(20,18,16,0.24)", ...style }}>
      <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: size, letterSpacing: 2, textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};

const IllustrationTag: React.FC = () => (
  <div style={{ position: "absolute", bottom: 26, right: 34, padding: "6px 16px", borderRadius: 7, border: `1.5px solid ${NEWS.inkDim}`, opacity: 0.75 }}>
    <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: NEWS.inkDim }}>Illustration</span>
  </div>
);

// sample paragraph used across the inspect/normal-text beats (neutral content)
const PARA = "The weather shifted overnight. By morning the sky looked overcast, and the streets were quiet. Most people stayed inside, waiting for the cold to pass before heading out again.";

const ParagraphCard: React.FC<{ w?: number; highlight?: boolean; dimAfter?: number }> = ({ w = 980, highlight }) => (
  <div style={{ width: w, padding: "40px 46px", borderRadius: 16, background: "#fff", border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 18px 44px rgba(20,18,16,0.14)" }}>
    <span style={{ fontFamily: "Georgia, serif", fontSize: 30, lineHeight: 1.65, color: NEWS.ink }}>
      {PARA.split(" ").map((word, i) => (
        <span key={i} style={{ background: highlight && (word === "overcast," || word === "cold") ? `${ORANGE}33` : "transparent", borderRadius: 4 }}>{word} </span>
      ))}
    </span>
  </div>
);

// ── 1. DetectionCardScene — clearly-conceptual detector result (hook) ─────────
export const DetectionCardScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spr(frame, fps, ats[0], 24);
  const stamp = spring({ frame: frame - ats[2], fps, config: { stiffness: 200, damping: 13 }, durationInFrames: 22 });
  return (
    <Stage tint={NEWS.red}>
      <div style={{ position: "relative", width: 1060, padding: "54px 60px", borderRadius: 18, background: NEWS.dark, borderTop: `6px solid ${NEWS.red}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, boxShadow: "0 26px 64px rgba(20,18,16,0.28)", transform: `scale(${interpolate(card, [0, 1], [0.9, 1])})`, opacity: interpolate(frame, [ats[0], ats[0] + 8], [0, 1], CLAMP) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: NEWS.red, boxShadow: `0 0 24px ${NEWS.red}` }} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 62, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Claude watermark detected</span>
        </div>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 40, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.85)", opacity: interpolate(frame, [ats[1], ats[1] + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, ats[1], 20), [0, 1], [1.25, 1])})` }}>Claude wrote this?</span>
        {frame >= ats[2] && (
          <div style={{ position: "absolute", bottom: -34, right: 60, transform: `rotate(-7deg) scale(${interpolate(stamp, [0, 1], [1.8, 1], CLAMP)})`, padding: "10px 30px", border: `5px solid ${NEWS.red}`, borderRadius: 12, background: NEWS.bg, opacity: interpolate(frame, [ats[2], ats[2] + 6], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 54, letterSpacing: 3, color: NEWS.red, textTransform: "uppercase" }}>Case closed</span>
          </div>
        )}
      </div>
      <IllustrationTag />
    </Stage>
  );
};

// ── 2. LaunchVsBlogScene — no keynote, just a technical post ─────────────────
export const LaunchVsBlogScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { at: ats[0], text: "Big product launch", ok: false },
    { at: ats[1], text: "Technical blog post", ok: true },
  ];
  return (
    <Stage tint={ORANGE} header={<Head kicker="How it arrived" title="THE QUIET ROLLOUT" />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {rows.map((r) => (
          <div key={r.text} style={{ display: "flex", alignItems: "center", gap: 26, width: 1000, padding: "30px 40px", borderRadius: 16, background: NEWS.dark, borderTop: `5px solid ${r.ok ? NEWS.green : NEWS.red}`, boxShadow: "0 16px 40px rgba(20,18,16,0.2)", transform: `translateX(${interpolate(spr(frame, fps, r.at, 24), [0, 1], [-44, 0])}px)`, opacity: interpolate(frame, [r.at, r.at + 8], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: HERO, fontSize: 52, color: r.ok ? NEWS.green : NEWS.red }}>{r.ok ? "✓" : "✕"}</span>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 48, letterSpacing: 1, textTransform: "uppercase", color: "#fff", textDecoration: r.ok ? "none" : "line-through", textDecorationColor: NEWS.red }}>{r.text}</span>
          </div>
        ))}
      </div>
    </Stage>
  );
};

// ── 3. InspectParagraphScene — no hidden characters / identical pair / scan ──
export const InspectParagraphScene: React.FC<{ durationInFrames: number; mode: "single" | "pair" | "scan"; ats: number[] }> = ({ mode, ats }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [ats[0], ats[0] + 70], [0, 1], CLAMP);
  return (
    <Stage tint={NEWS.blue} header={<Head kicker={mode === "pair" ? "Human-eye view" : "Look closer"} title={mode === "pair" ? "CAN YOU TELL?" : mode === "scan" ? "JUST NORMAL WRITING" : "NOTHING HIDDEN"} accent={NEWS.blue} />}>
      {mode === "pair" ? (
        <div style={{ display: "flex", gap: 36 }}>
          {["Original", "Watermarked"].map((lab, i) => (
            <div key={lab} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: interpolate(frame, [8 + i * 10, 18 + i * 10], [0, 1], CLAMP) }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: NEWS.inkDim }}>{lab}</span>
              <ParagraphCard w={800} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <ParagraphCard />
          {/* magnifier sweep */}
          <div style={{ position: "absolute", top: -30, left: `${sweep * 82}%`, width: 150, height: 150, borderRadius: "50%", border: `5px solid ${NEWS.blue}`, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(0.5px)", boxShadow: "0 14px 34px rgba(20,18,16,0.2)", opacity: interpolate(frame, [ats[0], ats[0] + 8, ats[0] + 130, ats[0] + 150], [0, 1, 1, 0], CLAMP) }}>
            <div style={{ position: "absolute", bottom: -44, right: -18, width: 12, height: 62, borderRadius: 6, background: NEWS.blue, transform: "rotate(-40deg)" }} />
          </div>
        </div>
      )}
      <div style={{ position: "absolute", bottom: 96, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip at={ats[1] ?? 60} dark text={mode === "pair" ? "YOU CAN'T SEE IT" : mode === "scan" ? "NO WORD LOOKS NUDGED" : "NO HIDDEN TAG"} size={44} rotate={-1.5} />
      </div>
    </Stage>
  );
};

// ── 4. WordForkScene — grey/overcast · cold/wintry ───────────────────────────
export const WordForkScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Fork: React.FC<{ x: number; base: string; a: string; b: string; at: number; small?: boolean }> = ({ x, base, a, b, at, small }) => {
    const e = spr(frame, fps, at, 24);
    const s = small ? 0.72 : 1;
    return (
      <div style={{ position: "absolute", left: x, top: small ? 620 : 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 * s, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP), transform: `scale(${interpolate(e, [0, 1], [0.85, 1])})` }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 40 * s, color: NEWS.ink }}>{base}</span>
        <svg width={340 * s} height={70 * s}>
          <path d={`M ${170 * s} 0 Q ${170 * s} ${34 * s} ${70 * s} ${64 * s}`} stroke={NEWS.inkDim} strokeWidth={3} fill="none" strokeDasharray={200} strokeDashoffset={interpolate(frame, [at + 8, at + 26], [200, 0], CLAMP)} />
          <path d={`M ${170 * s} 0 Q ${170 * s} ${34 * s} ${270 * s} ${64 * s}`} stroke={ORANGE} strokeWidth={4} fill="none" strokeDasharray={200} strokeDashoffset={interpolate(frame, [at + 14, at + 32], [200, 0], CLAMP)} />
        </svg>
        <div style={{ display: "flex", gap: 60 * s }}>
          <div style={{ padding: `${12 * s}px ${30 * s}px`, borderRadius: 12, background: "#fff", border: "1.5px solid rgba(20,18,16,0.2)", opacity: interpolate(frame, [at + 20, at + 28], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 44 * s, color: NEWS.ink }}>{a}</span>
          </div>
          <div style={{ padding: `${12 * s}px ${30 * s}px`, borderRadius: 12, background: NEWS.dark, border: `2.5px solid ${ORANGE}`, boxShadow: `0 0 26px ${ORANGE}44`, opacity: interpolate(frame, [at + 26, at + 34], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, at + 26, 20), [0, 1], [1.2, 1])})` }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 44 * s, color: "#fff" }}>{b}</span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Stage tint={ORANGE} header={<Head kicker="Where the watermark lives" title="THE WORDS CLAUDE CHOOSES" />}>
      <Fork x={520} base="…the sky looked" a="grey" b="overcast" at={ats[0]} />
      <Fork x={1180} base="…the air felt" a="cold" b="wintry" at={ats[1]} small />
      <div style={{ position: "absolute", bottom: 88, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip at={ats[2]} color={NEWS.green} text="BOTH WORK — THAT'S THE POINT" size={38} rotate={1.5} />
      </div>
    </Stage>
  );
};

// ── 5. KeyBarsScene — secret key nudges one valid choice (no fake numbers) ───
export const KeyBarsScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nudge = spr(frame, fps, ats[1], 34);
  const wGrey = interpolate(nudge, [0, 1], [0.5, 0.38]);
  const wOver = interpolate(nudge, [0, 1], [0.5, 0.62]);
  const barIn = interpolate(frame, [ats[0], ats[0] + 20], [0, 1], CLAMP);
  return (
    <Stage tint={ORANGE} header={<Head kicker="A secret key, not a stamp" title="A GENTLE NUDGE" />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, width: 1100 }}>
        {[{ label: "grey", w: wGrey, color: NEWS.inkDim, dark: false }, { label: "overcast", w: wOver, color: ORANGE, dark: true }].map((b) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 30, opacity: barIn }}>
            <span style={{ width: 220, textAlign: "right", fontFamily: "Georgia, serif", fontSize: 46, color: NEWS.ink }}>{b.label}</span>
            <div style={{ flex: 1, height: 64, borderRadius: 12, background: "rgba(20,18,16,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${b.w * 100}%`, height: "100%", borderRadius: 12, background: b.dark ? NEWS.dark : "rgba(20,18,16,0.28)", borderRight: b.dark ? `6px solid ${ORANGE}` : "none", transition: "none" }} />
            </div>
          </div>
        ))}
      </div>
      {/* the key */}
      <div style={{ position: "absolute", right: 260, top: 400, opacity: interpolate(frame, [ats[1] - 14, ats[1] - 4], [0, 1], CLAMP), transform: `translateY(${interpolate(nudge, [0, 1], [-26, 10])}px) rotate(-24deg)` }}>
        <svg width={110} height={110} viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="4.5" stroke={ORANGE} strokeWidth="1.8" /><path d="M11.4 11.4 L20 20 M17 17l2.4-2.4M14.6 14.6l2.2-2.2" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" /></svg>
      </div>
      <div style={{ position: "absolute", bottom: 88, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
        <Chip at={ats[2]} dark text="NOTHING ADDED TO THE TEXT" size={36} rotate={-1.5} />
      </div>
      <IllustrationTag />
    </Stage>
  );
};

// ── 6. ParisScene — no fork, nothing to nudge ────────────────────────────────
export const ParisScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = "Paris is the capital of";
  const shown = typed.slice(0, Math.round(interpolate(frame, [ats[0], ats[0] + 40], [0, typed.length], CLAMP)));
  const fr = spr(frame, fps, ats[1], 22);
  const collapse = spr(frame, fps, ats[3], 30);
  return (
    <Stage tint={NEWS.blue} header={<Head kicker="Where there's no choice" title="NO FORK, NO WATERMARK" accent={NEWS.blue} />}>
      <div style={{ width: 1080, padding: "48px 56px", borderRadius: 18, background: "#fff", border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 18px 44px rgba(20,18,16,0.14)", display: "flex", flexDirection: "column", gap: 30 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 54, color: NEWS.ink }}>
          {shown}<span style={{ opacity: frame % 20 < 10 ? 1 : 0 }}>|</span>{" "}
          <span style={{ display: "inline-block", minWidth: 240, borderBottom: `4px solid ${NEWS.blue}`, textAlign: "center", color: NEWS.blue, fontFamily: HERO, fontSize: 54, transform: `scale(${interpolate(fr, [0, 1], [1.3, 1])})`, opacity: interpolate(frame, [ats[1], ats[1] + 6], [0, 1], CLAMP) }}>France</span>
        </span>
        {/* the single path — branches collapse into one line */}
        <svg width={960} height={110} style={{ opacity: interpolate(frame, [ats[2], ats[2] + 10], [0, 1], CLAMP) }}>
          <path d={`M 480 6 Q 480 40 ${interpolate(collapse, [0, 1], [300, 470])} 96`} stroke={NEWS.inkDim} strokeWidth={3} fill="none" opacity={interpolate(collapse, [0, 1], [0.8, 0.15])} />
          <path d={`M 480 6 Q 480 40 ${interpolate(collapse, [0, 1], [660, 490])} 96`} stroke={NEWS.inkDim} strokeWidth={3} fill="none" opacity={interpolate(collapse, [0, 1], [0.8, 0.15])} />
          <path d="M 480 6 L 480 100" stroke={NEWS.blue} strokeWidth={5} strokeLinecap="round" opacity={interpolate(collapse, [0, 1], [0, 1])} />
          <circle cx={480} cy={6} r={8} fill={NEWS.blue} opacity={interpolate(collapse, [0, 1], [0, 1])} />
          <circle cx={480} cy={100} r={8} fill={NEWS.blue} opacity={interpolate(collapse, [0, 1], [0, 1])} />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip at={ats[2]} dark text="ONE RIGHT ANSWER — NOTHING TO NUDGE" size={36} rotate={1.2} />
      </div>
    </Stage>
  );
};

// ── 7. EcosystemScene — CLAUDE hub, surfaces build on as named ───────────────
export const EcosystemScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hub = spr(frame, fps, 8, 26);
  const items = [
    { label: "API", x: 430, y: 330 }, { label: "App", x: 430, y: 560 }, { label: "Claude Code", x: 560, y: 780 },
    { label: "Cowork", x: 1240, y: 780 }, { label: "AWS", x: 1420, y: 330 }, { label: "Google Cloud", x: 1420, y: 560 },
    { label: "Microsoft Foundry", x: 1130, y: 250 },
  ];
  return (
    <Stage tint={ORANGE} header={<Head kicker="Where it runs" title="EVERY SURFACE, BY DEFAULT" />}>
      <svg width={1920} height={960} style={{ position: "absolute", inset: 0 }}>
        {items.map((it, i) => (
          <line key={it.label} x1={960} y1={520} x2={it.x + 90} y2={it.y + 34} stroke={NEWS.inkDim} strokeWidth={2.5} opacity={interpolate(frame, [ats[i], ats[i] + 10], [0, 0.55], CLAMP)} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 960 - 170, top: 520 - 74, width: 340, height: 148, borderRadius: 20, background: NEWS.dark, border: `3px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${ORANGE}33, 0 18px 44px rgba(20,18,16,0.25)`, transform: `scale(${interpolate(hub, [0, 1], [0.7, 1])})` }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 62, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Claude</span>
      </div>
      {items.map((it, i) => (
        <div key={it.label} style={{ position: "absolute", left: it.x, top: it.y, padding: "16px 30px", borderRadius: 13, background: "#fff", border: "1.5px solid rgba(20,18,16,0.18)", boxShadow: "0 12px 30px rgba(20,18,16,0.14)", opacity: interpolate(frame, [ats[i], ats[i] + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, ats[i], 20), [0, 1], [1.3, 1])})` }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink }}>{it.label}</span>
        </div>
      ))}
    </Stage>
  );
};

// ── 8. WorldwideScene — same mark everywhere, no off switch ──────────────────
export const WorldwideScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pins = [{ x: 500, y: 400, label: "US" }, { x: 940, y: 340, label: "EU" }, { x: 1420, y: 470, label: "APAC" }];
  return (
    <Stage tint={NEWS.green} header={<Head kicker="Aug 2 onwards, by default" title="WORLDWIDE" accent={NEWS.green} />}>
      {/* abstract dotted world band */}
      <div style={{ position: "absolute", left: 240, right: 240, top: 300, bottom: 300, borderRadius: 40, background: "repeating-radial-gradient(circle at 50% 45%, rgba(20,18,16,0.10) 0 2px, transparent 2px 22px)", border: "1.5px solid rgba(20,18,16,0.14)", opacity: interpolate(frame, [4, 18], [0, 1], CLAMP) }} />
      {pins.map((p, i) => (
        <div key={p.label} style={{ position: "absolute", left: p.x, top: p.y, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: interpolate(frame, [ats[0] + i * 12, ats[0] + i * 12 + 8], [0, 1], CLAMP), transform: `translateY(${interpolate(spr(frame, fps, ats[0] + i * 12, 20), [0, 1], [-30, 0])}px)` }}>
          <svg width={54} height={66} viewBox="0 0 24 30"><path d="M12 1C6 1 2 5.5 2 11c0 7 10 17 10 17s10-10 10-17c0-5.5-4-10-10-10z" fill={NEWS.green} /><circle cx="12" cy="11" r="4.4" fill="#fff" /></svg>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: NEWS.ink }}>{p.label}</span>
        </div>
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M 540 430 Q 730 300 960 372" stroke={NEWS.green} strokeWidth={3} fill="none" strokeDasharray="9 9" opacity={interpolate(frame, [ats[1], ats[1] + 14], [0, 0.8], CLAMP)} />
        <path d="M 990 372 Q 1230 330 1450 500" stroke={NEWS.green} strokeWidth={3} fill="none" strokeDasharray="9 9" opacity={interpolate(frame, [ats[1] + 8, ats[1] + 22], [0, 0.8], CLAMP)} />
      </svg>
      <div style={{ position: "absolute", bottom: 96, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        <Chip at={ats[1]} color={NEWS.green} text="SAME MARK, SAME REPLY" size={36} rotate={-1.5} />
        <Chip at={ats[2]} color={NEWS.red} text="NO OFF SWITCH" size={36} rotate={1.5} />
      </div>
    </Stage>
  );
};

// ── 9. SplitLayerScene — text watermark vs C2PA metadata (real footage left) ─
export const SplitLayerScene: React.FC<{ durationInFrames: number; clip: string; shot: string; shotW: number; shotH: number; slamAt: number }> = ({ clip, shot, shotW, shotH, slamAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spr(frame, fps, slamAt, 22);
  const Panel: React.FC<{ x: number; label: string; color: string; children: React.ReactNode; at: number }> = ({ x, label, color, children, at }) => (
    <div style={{ position: "absolute", left: x, top: 250, width: 800, display: "flex", flexDirection: "column", gap: 16, opacity: interpolate(frame, [at, at + 10], [0, 1], CLAMP) }}>
      <div style={{ alignSelf: "flex-start", padding: "8px 22px", borderRadius: 9, background: color }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>{label}</span>
      </div>
      <div style={{ width: 800, height: 460, borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(20,18,16,0.2)", boxShadow: "0 18px 44px rgba(20,18,16,0.2)", background: NEWS.dark }}>{children}</div>
    </div>
  );
  return (
    <Stage tint={ORANGE} header={<Head kicker="Don't mix these up" title="TWO DIFFERENT LAYERS" />}>
      <Panel x={120} label="Text watermark · in the words" color={ORANGE} at={8}>
        <OffthreadVideo src={staticFile(clip)} muted playbackRate={1.05} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Panel>
      <Panel x={1000} label="C2PA · file metadata" color={NEWS.blue} at={26}>
        <Img src={staticFile(shot)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "0 0" }} />
      </Panel>
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${interpolate(slam, [0, 1], [1.5, 1], CLAMP)})`, opacity: interpolate(frame, [slamAt, slamAt + 8], [0, 1], CLAMP) }}>
        <div style={{ padding: "14px 38px", borderRadius: 12, background: NEWS.dark, boxShadow: "0 18px 44px rgba(20,18,16,0.28)" }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 52, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>Not the same thing</span>
        </div>
      </div>
    </Stage>
  );
};

// ── 10. SixLabsScene — one clause, six signatures → one global system ────────
export const SixLabsScene: React.FC<{ durationInFrames: number; labAts: number[]; globalAt: number }> = ({ labAts, globalAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labs = ["Anthropic", "OpenAI", "Google", "Meta", "Microsoft", "Mistral"];
  const shift = spr(frame, fps, globalAt, 28);
  return (
    <Stage tint={NEWS.blue} header={<Head kicker="EU Code of Practice · transparency" title="SIX LABS, ONE CLAUSE" accent={NEWS.blue} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, transform: `translateX(${interpolate(shift, [0, 1], [0, -380])}px)` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 320px)", gap: 22 }}>
          {labs.map((l, i) => (
            <div key={l} style={{ padding: "24px 0", borderRadius: 14, background: NEWS.dark, textAlign: "center", borderTop: `4px solid ${NEWS.blue}`, boxShadow: "0 14px 34px rgba(20,18,16,0.2)", opacity: interpolate(frame, [labAts[i] ?? labAts[labAts.length - 1], (labAts[i] ?? 0) + 8], [0, 1], CLAMP), transform: `translateY(${interpolate(spr(frame, fps, labAts[i] ?? 0, 20), [0, 1], [30, 0])}px)` }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{l}</span>
            </div>
          ))}
        </div>
        <Chip at={labAts[5] + 16} dark text="SAME SIGNATURE, SAME CLAUSE" size={34} rotate={-1.2} />
      </div>
      {frame >= globalAt && (
        <div style={{ position: "absolute", right: 150, top: 380, display: "flex", flexDirection: "column", gap: 22, opacity: interpolate(frame, [globalAt + 6, globalAt + 16], [0, 1], CLAMP) }}>
          <div style={{ padding: "18px 34px", borderRadius: 13, background: "#fff", border: "1.5px solid rgba(20,18,16,0.2)", opacity: 0.5, textDecoration: "line-through" }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, textTransform: "uppercase", color: NEWS.inkDim }}>EU version + global version</span>
          </div>
          <div style={{ padding: "20px 34px", borderRadius: 13, background: NEWS.dark, border: `2.5px solid ${NEWS.green}`, boxShadow: `0 0 30px ${NEWS.green}33`, transform: `scale(${interpolate(spr(frame, fps, globalAt + 14, 22), [0, 1], [1.2, 1])})` }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>One global system</span>
          </div>
        </div>
      )}
    </Stage>
  );
};

// ── 11. ContactFlowScene — the video's key graphic ───────────────────────────
const Fingerprint: React.FC<{ size?: number; color?: string }> = ({ size = 46, color = ORANGE }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round">
    <path d="M12 3a8 8 0 0 0-8 8c0 3.5 1 6 2.5 8.5" /><path d="M12 7a4 4 0 0 0-4 4c0 3 .8 5.4 2 7.6" /><path d="M12 11c0 3.2.9 5.9 2.2 8" /><path d="M16 11a4 4 0 0 0-1.2-2.9" /><path d="M20 11a8 8 0 0 0-3-6.2" /><path d="M16.5 15.5c.6 1.7 1.4 3 2.3 4.1" />
  </svg>
);
export const ContactFlowScene: React.FC<{ durationInFrames: number; mode: "flow" | "verbs"; ats: number[] }> = ({ mode, ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (mode === "flow") {
    const nodes = [
      { label: "TEXT", at: ats[0], x: 330 },
      { label: "CLAUDE", at: ats[0] + 14, x: 810, dark: true },
      { label: "TEXT", at: ats[1], x: 1290, mark: true },
    ];
    return (
      <Stage tint={ORANGE} header={<Head kicker="What a positive hit shows" title="CLAUDE TOUCHED IT" />}>
        <svg width={1920} height={960} style={{ position: "absolute", inset: 0 }}>
          <line x1={640} y1={500} x2={790} y2={500} stroke={NEWS.inkDim} strokeWidth={4} opacity={interpolate(frame, [ats[0] + 16, ats[0] + 28], [0, 0.7], CLAMP)} />
          <line x1={1130} y1={500} x2={1280} y2={500} stroke={NEWS.inkDim} strokeWidth={4} opacity={interpolate(frame, [ats[1] - 8, ats[1] + 4], [0, 0.7], CLAMP)} />
        </svg>
        {nodes.map((n, i) => (
          <div key={i} style={{ position: "absolute", left: n.x, top: 430, width: 300, height: 140, borderRadius: 16, background: n.dark ? NEWS.dark : "#fff", border: n.dark ? `3px solid ${ORANGE}` : "1.5px solid rgba(20,18,16,0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: "0 16px 40px rgba(20,18,16,0.18)", opacity: interpolate(frame, [n.at, n.at + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, n.at, 22), [0, 1], [0.82, 1])})` }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 48, letterSpacing: 2, textTransform: "uppercase", color: n.dark ? "#fff" : NEWS.ink }}>{n.label}</span>
            {n.mark && <div style={{ opacity: interpolate(frame, [ats[1] + 10, ats[1] + 20], [0, 1], CLAMP) }}><Fingerprint /></div>}
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 96, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28, alignItems: "center" }}>
          <Chip at={ats[2]} dark text="CONTACT" size={40} rotate={-1.5} />
          <span style={{ fontFamily: HERO, fontSize: 56, color: NEWS.red, opacity: interpolate(frame, [ats[2] + 8, ats[2] + 16], [0, 1], CLAMP) }}>≠</span>
          <Chip at={ats[2] + 12} color={NEWS.red} text="WROTE ALL OF IT" size={40} rotate={1.5} />
        </div>
      </Stage>
    );
  }
  const verbs = ["Write", "Proofread", "Translate", "Summarise / edit"];
  return (
    <Stage tint={NEWS.red} header={<Head kicker="Four different uses" title="ONE IDENTICAL FLAG" accent={NEWS.red} />}>
      <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 360px)", gap: 20 }}>
          {verbs.map((v, i) => (
            <div key={v} style={{ padding: "26px 0", borderRadius: 14, background: "#fff", border: "1.5px solid rgba(20,18,16,0.18)", textAlign: "center", boxShadow: "0 12px 30px rgba(20,18,16,0.12)", opacity: interpolate(frame, [ats[i], ats[i] + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, ats[i], 20), [0, 1], [1.2, 1])})` }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 42, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink }}>{v}</span>
            </div>
          ))}
        </div>
        <svg width={120} height={80} style={{ opacity: interpolate(frame, [ats[4] - 10, ats[4]], [0, 1], CLAMP) }}><path d="M10 40 L96 40 M78 20 L100 40 L78 60" stroke={NEWS.ink} strokeWidth={5} fill="none" strokeLinecap="round" /></svg>
        <div style={{ width: 420, padding: "40px 30px", borderRadius: 16, background: NEWS.dark, borderTop: `6px solid ${NEWS.red}`, textAlign: "center", boxShadow: "0 20px 50px rgba(20,18,16,0.25)", opacity: interpolate(frame, [ats[4], ats[4] + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, ats[4], 22), [0, 1], [1.25, 1])})` }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 52, letterSpacing: 1, textTransform: "uppercase", color: "#fff", lineHeight: 1.1 }}>Same detection signal</span>
        </div>
      </div>
    </Stage>
  );
};

// ── 12. EssayScene — student essay → grammar fix → detected → NO ─────────────
export const EssayScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { label: "Student writes essay", color: NEWS.green, at: ats[0] },
    { label: "Claude fixes grammar", color: ORANGE, at: ats[1] },
    { label: "Watermark detected", color: NEWS.red, at: ats[2] },
  ];
  return (
    <Stage tint={NEWS.red} header={<Head kicker="The scenario that matters" title="THE STUDENT ESSAY" accent={NEWS.red} />}>
      <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ width: 420, padding: "34px 26px", borderRadius: 16, background: NEWS.dark, borderTop: `5px solid ${s.color}`, textAlign: "center", boxShadow: "0 16px 40px rgba(20,18,16,0.22)", opacity: interpolate(frame, [s.at, s.at + 8], [0, 1], CLAMP), transform: `translateY(${interpolate(spr(frame, fps, s.at, 22), [0, 1], [36, 0])}px)` }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", lineHeight: 1.15 }}>{s.label}</span>
            </div>
            {i < 2 && <svg width={70} height={60} style={{ opacity: interpolate(frame, [steps[i + 1].at - 8, steps[i + 1].at], [0, 1], CLAMP) }}><path d="M6 30 L52 30 M38 14 L56 30 L38 46" stroke={NEWS.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" /></svg>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 84, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink, opacity: interpolate(frame, [ats[3], ats[3] + 8], [0, 1], CLAMP) }}>Does that mean Claude wrote it?</span>
        <Chip at={ats[3] + 14} color={NEWS.red} text="NO." size={52} rotate={-3} />
      </div>
    </Stage>
  );
};

// ── 13. RewriteBreakScene — rewrite through another model kills the signal ───
export const RewriteBreakScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { label: "Claude output", mark: true, at: ats[0] },
    { label: "Second model rewrites", mid: true, at: ats[1] },
    { label: "Rewritten text", broken: true, at: ats[2] },
  ];
  return (
    <Stage tint={NEWS.red} header={<Head kicker="The easy break" title="REWRITE = SIGNAL GONE" accent={NEWS.red} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
        {rows.map((r, i) => (
          <React.Fragment key={r.label}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, width: 900, padding: "24px 38px", borderRadius: 15, background: r.mid ? "#fff" : NEWS.dark, border: r.mid ? "1.5px solid rgba(20,18,16,0.2)" : "none", justifyContent: "space-between", boxShadow: "0 14px 34px rgba(20,18,16,0.18)", opacity: interpolate(frame, [r.at, r.at + 8], [0, 1], CLAMP), transform: `translateY(${interpolate(spr(frame, fps, r.at, 20), [0, 1], [26, 0])}px)` }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 42, letterSpacing: 1, textTransform: "uppercase", color: r.mid ? NEWS.ink : "#fff" }}>{r.label}</span>
              {r.mark && <Fingerprint color={ORANGE} />}
              {r.broken && (
                <div style={{ position: "relative" }}>
                  <Fingerprint color="rgba(255,255,255,0.35)" />
                  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [ats[3], ats[3] + 8], [0, 1], CLAMP), transform: `scale(${interpolate(spr(frame, fps, ats[3], 18), [0, 1], [1.6, 1])})` }}><path d="M5 5l14 14M19 5L5 19" stroke={NEWS.red} strokeWidth={3.4} strokeLinecap="round" /></svg>
                </div>
              )}
            </div>
            {i < 2 && <svg width={40} height={46} style={{ opacity: interpolate(frame, [rows[i + 1].at - 8, rows[i + 1].at], [0, 1], CLAMP) }}><path d="M20 4 L20 34 M8 24 L20 40 L32 24" stroke={NEWS.ink} strokeWidth={4} fill="none" strokeLinecap="round" /></svg>}
          </React.Fragment>
        ))}
      </div>
    </Stage>
  );
};

// ── 14. LifecycleFadeScene — detectable at generation; fades downstream ──────
export const LifecycleFadeScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stages = ["Generated", "Edited", "Rewritten", "Translated", "Another model"];
  return (
    <Stage tint={ORANGE} header={<Head kicker="What Article 50(2) actually asks" title="DETECTABLE WHEN PRODUCED" />}>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {stages.map((s, i) => {
          const sig = 1 - i * 0.24;
          return (
            <React.Fragment key={s}>
              <div style={{ width: 300, padding: "26px 12px", borderRadius: 14, background: NEWS.dark, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, boxShadow: "0 14px 34px rgba(20,18,16,0.18)", opacity: interpolate(frame, [ats[i], ats[i] + 8], [0, 1], CLAMP), transform: `translateY(${interpolate(spr(frame, fps, ats[i], 20), [0, 1], [30, 0])}px)` }}>
                <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 32, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{s}</span>
                <div style={{ opacity: Math.max(sig, 0.08) }}><Fingerprint color={i === 0 ? NEWS.green : ORANGE} size={40} /></div>
                {i === 0 && <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 1, color: NEWS.green, textTransform: "uppercase" }}>✓ detectable</span>}
              </div>
              {i < 4 && <svg width={34} height={40} style={{ opacity: interpolate(frame, [ats[i + 1] - 6, ats[i + 1] + 2], [0, 0.7], CLAMP) }}><path d="M4 20 L26 20 M16 8 L28 20 L16 32" stroke={NEWS.inkDim} strokeWidth={3.5} fill="none" strokeLinecap="round" /></svg>}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip at={ats[4] + 14} dark text="DURABILITY ≠ THE REQUIREMENT" size={40} rotate={-1.5} />
      </div>
    </Stage>
  );
};

// ── 15. ContextTripleScene — school · hiring · legal (tasteful, minimal) ─────
export const ContextTripleScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const docs = [
    { title: "Essay", lines: 7, badge: "GRADE", at: ats[0], color: NEWS.blue },
    { title: "CV", lines: 6, badge: "JOB", at: ats[1], color: "#C9913D" },
    { title: "Contract", lines: 8, badge: "LEGAL", at: ats[2], color: NEWS.red },
  ];
  return (
    <Stage tint={NEWS.red} header={<Head kicker="Where the stakes get real" title="GRADE · JOB · LEGAL" accent={NEWS.red} />}>
      <div style={{ display: "flex", gap: 44 }}>
        {docs.map((d) => (
          <div key={d.title} style={{ width: 380, padding: "30px 34px", borderRadius: 14, background: "#fff", border: "1px solid rgba(20,18,16,0.16)", boxShadow: "0 16px 40px rgba(20,18,16,0.16)", display: "flex", flexDirection: "column", gap: 12, opacity: interpolate(frame, [d.at, d.at + 8], [0, 1], CLAMP), transform: `translateY(${interpolate(spr(frame, fps, d.at, 22), [0, 1], [40, 0])}px) rotate(${[-1.6, 0.8, -0.9][docs.indexOf(d)]}deg)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 36, textTransform: "uppercase", color: NEWS.ink }}>{d.title}</span>
              <span style={{ padding: "5px 14px", borderRadius: 7, background: d.color, fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "#fff" }}>{d.badge}</span>
            </div>
            {Array.from({ length: d.lines }).map((_, i) => (
              <div key={i} style={{ height: 11, borderRadius: 6, background: "rgba(20,18,16,0.12)", width: `${88 - (i % 3) * 14}%` }} />
            ))}
          </div>
        ))}
      </div>
    </Stage>
  );
};

// ── 16. EvidenceStackScene — one signal vs a corroborated case ───────────────
export const EvidenceStackScene: React.FC<{ durationInFrames: number; ats: number[]; compareAt: number }> = ({ ats, compareAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cards = ["Watermark hit", "Draft history", "Account records", "Another source"];
  const shift = spr(frame, fps, compareAt, 28);
  return (
    <Stage tint={NEWS.green} header={<Head kicker="How to actually use it" title="ONE SIGNAL, NOT THE CASE" accent={NEWS.green} />}>
      {/* lone hit — appears at compareAt, reads weak */}
      <div style={{ position: "absolute", left: 300, top: 430, opacity: interpolate(frame, [compareAt, compareAt + 8], [0, 1], CLAMP), transform: `translateX(${interpolate(shift, [0, 1], [-40, 0])}px)` }}>
        <div style={{ width: 380, padding: "24px 0", borderRadius: 14, background: NEWS.dark, borderTop: `5px solid ${ORANGE}`, textAlign: "center", boxShadow: "0 14px 34px rgba(20,18,16,0.2)" }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 36, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{cards[0]}</span>
        </div>
        <div style={{ textAlign: "center", marginTop: 14, opacity: interpolate(frame, [compareAt + 12, compareAt + 22], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 2, textTransform: "uppercase", color: NEWS.red }}>Alone = weak</span>
        </div>
      </div>
      {/* corroborated stack — builds card by card as spoken */}
      <div style={{ position: "absolute", left: 1000, top: 290, display: "flex", flexDirection: "column", gap: 16 }}>
        {cards.map((c, i) => (
          <div key={c} style={{ width: 500, padding: "18px 26px", borderRadius: 13, background: i === 0 ? NEWS.dark : "#fff", border: i === 0 ? "none" : "1.5px solid rgba(20,18,16,0.18)", borderLeft: `6px solid ${i === 0 ? ORANGE : NEWS.green}`, boxShadow: "0 12px 30px rgba(20,18,16,0.14)", opacity: interpolate(frame, [ats[i], ats[i] + 8], [0, 1], CLAMP), transform: `translateX(${interpolate(spr(frame, fps, ats[i], 20), [0, 1], [40, 0])}px)` }}>
            <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 32, letterSpacing: 1, textTransform: "uppercase", color: i === 0 ? "#fff" : NEWS.ink }}>{c}</span>
          </div>
        ))}
        <div style={{ marginTop: 6 }}>
          <Chip at={compareAt + 12} color={NEWS.green} text="CORROBORATING EVIDENCE" size={34} rotate={-1.5} />
        </div>
      </div>
    </Stage>
  );
};

// ── 17. FinalFlowScene — tiny closing visual ─────────────────────────────────
export const FinalFlowScene: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, 6, 26);
  return (
    <Stage tint={ORANGE}>
      <div style={{ display: "flex", alignItems: "center", gap: 34, transform: `scale(${interpolate(e, [0, 1], [0.9, 1])})`, opacity: interpolate(frame, [4, 14], [0, 1], CLAMP) }}>
        {["Human text", "Claude", "Text"].map((l, i) => (
          <React.Fragment key={l}>
            <div style={{ padding: "26px 44px", borderRadius: 16, background: i === 1 ? NEWS.dark : "#fff", border: i === 1 ? `3px solid ${ORANGE}` : "1.5px solid rgba(20,18,16,0.2)", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 16px 40px rgba(20,18,16,0.18)" }}>
              <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 50, letterSpacing: 1, textTransform: "uppercase", color: i === 1 ? "#fff" : NEWS.ink }}>{l}</span>
              {i === 2 && <div style={{ opacity: interpolate(frame, [34, 46], [0, 1], CLAMP) }}><Fingerprint /></div>}
            </div>
            {i < 2 && <svg width={64} height={50}><path d="M6 25 L46 25 M32 10 L50 25 L32 40" stroke={NEWS.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" /></svg>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip at={40} dark text="TOUCHED ≠ WROTE" size={44} rotate={-1.5} />
      </div>
    </Stage>
  );
};
