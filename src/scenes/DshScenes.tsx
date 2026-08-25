import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// DshScenes — DeepSeek Harness tutorial kit. Premium AI-tech, cool-dark
// charcoal + DeepSeek periwinkle accent. Real demo footage is the hero
// (DemoClip); graphics only clarify what footage can't. Motion is controlled:
// scale/depth/parallax/mask, no bounce. Every element pins to a narration frame.

const { fontFamily: INTER } = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const DSH = {
  bg: "#0A0C10",
  surface: "#12151C",
  surface2: "#171B24",
  text: "#F4F6FB",
  dim: "#8B93A7",
  accent: "#4D6BFE", // DeepSeek periwinkle
  accentSoft: "#6E86FF",
  green: "#3FB950", // real success (tests pass) — matches terminal green
  line: "rgba(244,246,251,0.12)",
  faint: "rgba(244,246,251,0.06)",
};
export const DSH_FONT = INTER;
export const DSH_MONO = MONO;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.33, 0, 0.2, 1);
const rise = (frame: number, at: number, dist = 16, dur = 16) => ({
  opacity: interpolate(frame, [at, at + Math.min(9, dur)], [0, 1], CLAMP),
  transform: `translateY(${interpolate(frame, [at, at + dur], [dist, 0], { ...CLAMP, easing: EASE })}px)`,
});

// ── Stage: cool-dark bg, subtle blue aurora + dot grid + vignette ────────────
export const DshStage: React.FC<{ children: React.ReactNode; push?: boolean }> = ({ children, push = true }) => {
  const frame = useCurrentFrame();
  const drift = push ? interpolate(frame, [0, 260], [1, 1.03], CLAMP) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: DSH.bg }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 32%, rgba(77,107,254,0.16), transparent 70%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(244,246,251,0.05) 1px, transparent 1px)", backgroundSize: "36px 36px", opacity: 0.55 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ transform: `scale(${drift})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const DshHead: React.FC<{ eyebrow?: string; title?: string; x?: number; y?: number; center?: boolean; at?: number }> = ({ eyebrow, title, x = 150, y = 100, center, at = 4 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: center ? 0 : x, right: center ? 0 : undefined, top: y, display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start", gap: 12, zIndex: 5, ...rise(frame, at, 10) }}>
      {eyebrow ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: DSH.accent }} />
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 21, letterSpacing: 4, textTransform: "uppercase", color: DSH.dim }}>{eyebrow}</span>
        </div>
      ) : null}
      {title ? <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 52, letterSpacing: -0.5, color: DSH.text }}>{title}</span> : null}
    </div>
  );
};

const Underline: React.FC<{ at: number; w: number }> = ({ at, w }) => {
  const frame = useCurrentFrame();
  return <div style={{ height: 3, borderRadius: 2, background: DSH.accent, width: interpolate(frame, [at, at + 16], [0, w], { ...CLAMP, easing: EASE }) }} />;
};

// ── DemoClip — the hero: real screen recording, reframed with a punch-in ─────
// startAt = seconds into the clip; scale/originX/originY frame the punch;
// rate compresses idle stretches; note draws a highlight box (image-space %).
export const DemoClip: React.FC<{
  durationInFrames: number; src: string; startAt: number; scale?: number; originX?: number; originY?: number;
  rate?: number; kenBurns?: number; note?: { at: number; x: number; y: number; w: number; h: number };
  label?: string;
}> = ({ durationInFrames, src, startAt, scale = 1, originX = 50, originY = 50, rate = 1, kenBurns = 0, note, label }) => {
  const frame = useCurrentFrame();
  const kb = kenBurns ? interpolate(frame, [0, durationInFrames], [1, 1 + kenBurns], CLAMP) : 1;
  const s = scale * kb;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${originX}% ${originY}%` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(startAt * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {note && frame >= note.at ? (
        <div style={{ position: "absolute", left: `${note.x}%`, top: `${note.y}%`, width: `${note.w}%`, height: `${note.h}%`, border: `3px solid ${DSH.accent}`, borderRadius: 8, boxShadow: `0 0 24px ${DSH.accent}66`, opacity: interpolate(frame, [note.at, note.at + 10], [0, 1], CLAMP) }} />
      ) : null}
      {label ? (
        <div style={{ position: "absolute", left: 54, bottom: 54, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 9, background: "rgba(10,12,16,0.82)", border: `1px solid ${DSH.line}`, backdropFilter: "blur(6px)", opacity: interpolate(frame, [4, 14], [0, 1], CLAMP) }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: DSH.accent }} />
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 24, letterSpacing: 1, color: DSH.text }}>{label}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── FlyingLogo — enters from depth with soft blur, holds, drifts ─────────────
export const FlyingLogo: React.FC<{ durationInFrames: number; src: string; w?: number; sub?: string }> = ({ durationInFrames, src, w = 560, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { stiffness: 90, damping: 20 }, durationInFrames: 30 });
  const blur = interpolate(e, [0, 0.7, 1], [16, 3, 0], CLAMP);
  const scale = interpolate(e, [0, 1], [0.6, 1]);
  const drift = interpolate(frame, [0, durationInFrames], [0, -14], CLAMP);
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, transform: `scale(${scale}) translateY(${drift}px)`, filter: `blur(${blur}px)`, opacity: Math.min(interpolate(frame, [0, 8], [0, 1], CLAMP), out) }}>
        <Img src={staticFile(src)} style={{ width: w, filter: `drop-shadow(0 24px 60px ${DSH.accent}55)` }} />
        {sub ? <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, letterSpacing: 6, textTransform: "uppercase", color: DSH.text }}>{sub}</span> : null}
      </div>
    </AbsoluteFill>
  );
};

// ── KeywordFlash — cold-open keyword, condensed bold, quick in/out ───────────
export const KeywordFlash: React.FC<{ durationInFrames: number; text: string; icon?: "files" | "code" | "steps" | "web" }> = ({ durationInFrames, text, icon }) => {
  const frame = useCurrentFrame();
  const op = Math.min(interpolate(frame, [0, 4], [0, 1], CLAMP), interpolate(frame, [durationInFrames - 5, durationInFrames - 1], [1, 0], CLAMP));
  const y = interpolate(frame, [0, 8], [16, 0], { ...CLAMP, easing: EASE });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 130, pointerEvents: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, transform: `translateY(${y}px)`, opacity: op }}>
        {icon ? <MiniIcon kind={icon} /> : null}
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 62, letterSpacing: 2, textTransform: "uppercase", color: DSH.text, textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

const MiniIcon: React.FC<{ kind: "files" | "code" | "steps" | "web"; size?: number; color?: string }> = ({ kind, size = 52, color = DSH.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {kind === "files" && <><path d="M4 5a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></>}
    {kind === "code" && <><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></>}
    {kind === "steps" && <><circle cx="6" cy="7" r="2" /><circle cx="6" cy="17" r="2" /><circle cx="18" cy="12" r="2" /><path d="M8 7h5a3 3 0 0 1 3 3M8 17h5a3 3 0 0 0 3-3" /></>}
    {kind === "web" && <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>}
  </svg>
);

// ── CommandCard — monospace command, optional flag highlight + annotation ────
export const CommandCard: React.FC<{ durationInFrames: number; eyebrow?: string; title?: string; cmd: string; hi?: string; annot?: string; annotAt?: number; second?: { label: string; cmd: string; at: number } }> = ({ eyebrow, title, cmd, hi, annot, annotAt = 40, second }) => {
  const frame = useCurrentFrame();
  const parts = hi ? cmd.split(hi) : [cmd];
  return (
    <DshStage push={false}>
      <DshHead eyebrow={eyebrow} title={title} center />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", ...rise(frame, 8, 14) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "34px 52px", borderRadius: 12, background: DSH.surface, border: `1px solid ${DSH.line}`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 44, color: DSH.dim }}>$</span>
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 44, color: DSH.text, letterSpacing: -0.5 }}>
              {parts.length === 2 ? (<>{parts[0]}<span style={{ color: DSH.accent, background: `${DSH.accent}22`, borderRadius: 5, padding: "0 4px" }}>{hi}</span>{parts[1]}</>) : cmd}
            </span>
          </div>
          {annot ? <div style={{ opacity: interpolate(frame, [annotAt, annotAt + 10], [0, 1], CLAMP) }}><span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: DSH.accent }}>{annot}</span></div> : null}
          {second ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8, opacity: interpolate(frame, [second.at, second.at + 12], [0, 1], CLAMP) }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 19, letterSpacing: 3, textTransform: "uppercase", color: DSH.dim }}>{second.label}</span>
              <div style={{ padding: "20px 40px", borderRadius: 10, background: DSH.surface2, border: `1px solid ${DSH.line}` }}>
                <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, color: DSH.text }}><span style={{ color: DSH.dim }}>$ </span>{second.cmd}</span>
              </div>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </DshStage>
  );
};

// ── ArchScene — HARNESS = LOCAL  ↔  MODEL = API ──────────────────────────────
export const ArchScene: React.FC<{ durationInFrames: number; lineAt: number }> = ({ lineAt }) => {
  const frame = useCurrentFrame();
  const flow = interpolate(frame, [lineAt, lineAt + 30], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <DshStage>
      <DshHead eyebrow="How it's split" title="Local runtime, API model" />
      {/* LOCAL box */}
      <div style={{ position: "absolute", left: 200, top: 400, width: 620, ...rise(frame, 12, 16) }}>
        <div style={{ padding: "34px 38px", borderRadius: 14, background: DSH.surface, border: `1px solid ${DSH.accent}55`, boxShadow: `0 0 40px ${DSH.accent}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <MiniIcon kind="code" size={26} />
            <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, color: DSH.text }}>Your machine</span>
          </div>
          {["Harness runtime", "Tools", "Your files"].map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", opacity: interpolate(frame, [24 + i * 8, 32 + i * 8], [0, 1], CLAMP) }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: DSH.accent }} />
              <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 26, color: DSH.text }}>{t}</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}><span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 19, letterSpacing: 3, textTransform: "uppercase", color: DSH.accent }}>Runs locally</span></div>
        </div>
      </div>
      {/* API box */}
      <div style={{ position: "absolute", right: 200, top: 430, width: 560, ...rise(frame, lineAt + 10, 16) }}>
        <div style={{ padding: "34px 38px", borderRadius: 14, background: DSH.surface2, border: `1px solid ${DSH.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <MiniIcon kind="web" size={26} color={DSH.dim} />
            <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 30, color: DSH.text }}>DeepSeek API</span>
          </div>
          <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 26, color: DSH.dim, lineHeight: 1.5 }}>The model that answers runs in the cloud.</span>
          <div style={{ marginTop: 20 }}><span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 19, letterSpacing: 3, textTransform: "uppercase", color: DSH.dim }}>API usage</span></div>
        </div>
      </div>
      {/* connecting flow line */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={820} y1={520} x2={1160} y2={520} stroke={DSH.line} strokeWidth={2} />
        <line x1={820} y1={520} x2={interpolate(flow, [0, 1], [820, 1160], CLAMP)} y2={520} stroke={DSH.accent} strokeWidth={3} />
        {[0.25, 0.55, 0.85].map((p) => { const x = 820 + ((frame * 4 + p * 340) % 340); return <circle key={p} cx={x} cy={520} r={3.5} fill={DSH.accent} opacity={flow} />; })}
      </svg>
    </DshStage>
  );
};

// ── PrereqScene — 01 Node.js / 02 DeepSeek API key ──────────────────────────
export const PrereqScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const cards = [
    { n: "01", t: "Node.js", s: "gives you npm + npx", logo: "assets/external/logos/dsh-nodejs-logo.png" },
    { n: "02", t: "DeepSeek API key", s: "platform.deepseek.com", logo: "assets/external/logos/dsh-deepseek-logo.png" },
  ];
  return (
    <DshStage>
      <DshHead eyebrow="Before we start" title="Only two prerequisites" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44, flexDirection: "row" }}>
        {cards.map((c, i) => (
          <div key={c.n} style={{ width: 560, height: 420, padding: "40px 44px", borderRadius: 16, background: DSH.surface, border: `1px solid ${DSH.line}`, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 22px 60px rgba(0,0,0,0.45)", ...rise(frame, ats[i], 22) }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: DSH.accent }}>{c.n}</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
              <Img src={staticFile(c.logo)} style={{ maxWidth: 320, maxHeight: 150, objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 38, color: DSH.text }}>{c.t}</span>
              <span style={{ fontFamily: MONO, fontWeight: 400, fontSize: 22, color: DSH.dim }}>{c.s}</span>
            </div>
          </div>
        ))}
      </AbsoluteFill>
    </DshStage>
  );
};

// ── ListScene — permissions / models / presets (typographic, active highlight)
export const ListScene: React.FC<{ durationInFrames: number; eyebrow: string; title: string; rows: { t: string; s: string }[]; ats: number[]; activeIdx?: number; activeAt?: number }> = ({ eyebrow, title, rows, ats, activeIdx = -1, activeAt = 99999 }) => {
  const frame = useCurrentFrame();
  return (
    <DshStage>
      <DshHead eyebrow={eyebrow} title={title} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 1040 }}>
          {rows.map((r, i) => {
            const active = i === activeIdx && frame >= activeAt;
            return (
              <div key={r.t} style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 30px", borderRadius: 12, background: active ? DSH.surface2 : DSH.surface, border: `1px solid ${active ? DSH.accent + "88" : DSH.line}`, boxShadow: active ? `0 0 30px ${DSH.accent}22` : "none", ...rise(frame, ats[i], 14) }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: active ? DSH.accent : DSH.dim, width: 34 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: DSH.text, minWidth: 340 }}>{r.t}</span>
                <span style={{ fontFamily: INTER, fontWeight: 400, fontSize: 26, color: DSH.dim, flex: 1 }}>{r.s}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </DshStage>
  );
};

// ── PtcFlow — TASK1/2/3 → TYPESCRIPT PROGRAM → EXECUTE ───────────────────────
export const PtcFlow: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  return (
    <DshStage>
      <DshHead eyebrow="PTC mode" title="Chain steps in one program" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30 }}>
        <div style={{ display: "flex", gap: 18 }}>
          {["Task 1", "Task 2", "Task 3"].map((t, i) => (
            <div key={t} style={{ padding: "16px 30px", borderRadius: 10, background: DSH.surface, border: `1px solid ${DSH.line}`, ...rise(frame, ats[0] + i * 6, 12) }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, color: DSH.text }}>{t}</span>
            </div>
          ))}
        </div>
        <svg width={40} height={44} style={{ opacity: interpolate(frame, [ats[1] - 6, ats[1]], [0, 0.7], CLAMP) }}><path d="M20 4 L20 34 M8 24 L20 40 L32 24" stroke={DSH.dim} strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
        <div style={{ padding: "22px 44px", borderRadius: 12, background: DSH.surface2, border: `1px solid ${DSH.accent}66`, ...rise(frame, ats[1], 14) }}>
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 38, color: DSH.accent }}>one TypeScript program</span>
        </div>
        <svg width={40} height={44} style={{ opacity: interpolate(frame, [ats[2] - 6, ats[2]], [0, 0.7], CLAMP) }}><path d="M20 4 L20 34 M8 24 L20 40 L32 24" stroke={DSH.dim} strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
        <div style={{ ...rise(frame, ats[2], 12) }}><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, letterSpacing: 4, textTransform: "uppercase", color: DSH.text }}>Execute</span></div>
      </AbsoluteFill>
    </DshStage>
  );
};

// ── PluginFan — modular architecture + 160+ ─────────────────────────────────
export const PluginFan: React.FC<{ durationInFrames: number; ats: number[]; countAt: number }> = ({ ats, countAt }) => {
  const frame = useCurrentFrame();
  const items = [
    { t: "Models", x: 380, y: 330 }, { t: "Tools", x: 380, y: 560 }, { t: "Sandbox", x: 520, y: 770 },
    { t: "Sessions", x: 1280, y: 330 }, { t: "Agent loop", x: 1400, y: 560 },
  ];
  return (
    <DshStage>
      <DshHead eyebrow="The architecture" title="Everything is a plugin" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {items.map((it, i) => <line key={it.t} x1={960} y1={545} x2={it.x + (it.x < 960 ? 90 : 20)} y2={it.y + 16} stroke="rgba(139,147,167,0.4)" strokeWidth={1.5} opacity={interpolate(frame, [ats[i], ats[i] + 12], [0, 1], CLAMP)} />)}
      </svg>
      <div style={{ position: "absolute", left: 810, top: 500, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...rise(frame, 6, 10) }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, letterSpacing: -0.5, color: DSH.text }}>Harness</span>
        <Underline at={14} w={130} />
      </div>
      {items.map((it, i) => (
        <div key={it.t} style={{ position: "absolute", left: it.x, top: it.y, display: "flex", alignItems: "center", gap: 10, ...rise(frame, ats[i], 10) }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: DSH.accent }} />
          <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 30, color: DSH.text }}>{it.t}</span>
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, alignItems: "baseline", ...rise(frame, countAt, 14) }}>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: DSH.accent }}>160+</span>
        <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, letterSpacing: 3, textTransform: "uppercase", color: DSH.text }}>plugins in this build</span>
      </div>
    </DshStage>
  );
};

// ── SummaryMontage — recap grid, cells light up in sequence ──────────────────
export const SummaryScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const items = ["Read files", "Understand a project", "Write real code", "Run that code", "Control permissions", "Configure the agent", "Search the live web"];
  return (
    <DshStage>
      <DshHead eyebrow="The whole loop" title="What it can do" center />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 500px)", gap: 20, justifyContent: "center" }}>
          {items.map((t, i) => {
            const on = frame >= ats[i];
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 30px", borderRadius: 12, background: on ? DSH.surface2 : DSH.surface, border: `1px solid ${on ? DSH.accent + "77" : DSH.line}`, gridColumn: i === 6 ? "2" : undefined, boxShadow: on ? `0 0 26px ${DSH.accent}22` : "none", opacity: interpolate(frame, [ats[i] - 4, ats[i] + 6], [0.35, 1], CLAMP) }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: on ? DSH.accent : "transparent", border: `2px solid ${on ? DSH.accent : DSH.dim}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on ? <svg width={14} height={14} viewBox="0 0 24 24"><path d="M5 13l4 4 10-11" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                </div>
                <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 28, color: DSH.text }}>{t}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </DshStage>
  );
};
