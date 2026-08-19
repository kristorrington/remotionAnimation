import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// WatermarkScenes — BRAND SYSTEM v2 (Kris, Aug 2026): premium tech-journalism
// dark editorial. Charcoal bg, cream type, ONE burnt-orange accent, typography
// over cards, thin lines, no bounce. Every element pins to a whisper `at`.
// Quality filter: journalism-not-Canva · belongs beside the dark studio ·
// remove half the elements.

const { fontFamily: INTER } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const BRAND = {
  bg: "#0B0B0A",
  surface: "#171714",
  text: "#F2EEE6",
  dim: "#8E8B84",
  accent: "#D97745",
  accentDeep: "#A94F2D",
  red: "#B3402F", // muted — real failure/danger only
  line: "rgba(242,238,230,0.14)",
  faint: "rgba(242,238,230,0.07)",
};

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.33, 0, 0.2, 1);
// understated entrance: fade + small rise, NO overshoot (brand §19/§39)
const rise = (frame: number, at: number, dist = 14, dur = 14) => ({
  opacity: interpolate(frame, [at, at + Math.min(8, dur)], [0, 1], CLAMP),
  transform: `translateY(${interpolate(frame, [at, at + dur], [dist, 0], { ...CLAMP, easing: EASE })}px)`,
});

// dark stage: subtle warm vignette + barely-there dot matrix (§47)
export const Stage: React.FC<{ children: React.ReactNode; push?: boolean }> = ({ children, push = true }) => {
  const frame = useCurrentFrame();
  const drift = push ? interpolate(frame, [0, 240], [1, 1.035], CLAMP) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 38%, rgba(38,32,26,0.55), transparent 70%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(242,238,230,0.045) 1px, transparent 1px)", backgroundSize: "34px 34px", opacity: 0.5 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 62%, rgba(0,0,0,0.5) 100%)" }} />
      <AbsoluteFill style={{ transform: `scale(${drift})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// eyebrow + sentence-case headline (§15) — small, upper-left biased, never a title card
export const Head: React.FC<{ eyebrow?: string; title?: string; x?: number; y?: number; center?: boolean; at?: number }> = ({ eyebrow, title, x = 140, y = 96, center, at = 4 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: center ? 0 : x, right: center ? 0 : undefined, top: y, display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start", gap: 12, zIndex: 5, ...rise(frame, at, 10) }}>
      {eyebrow ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND.accent }} />
          <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 21, letterSpacing: 4.5, textTransform: "uppercase", color: BRAND.dim }}>{eyebrow}</span>
        </div>
      ) : null}
      {title ? <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 50, letterSpacing: -0.5, color: BRAND.text }}>{title}</span> : null}
    </div>
  );
};

// typographic emphasis line — cream with ONE orange word, no pill (§17/§68)
export const Emph: React.FC<{ at: number; pre?: string; hot: string; post?: string; size?: number; bottom?: number; left?: number; center?: boolean }> = ({ at, pre, hot, post, size = 40, bottom = 110, left = 140, center }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", bottom, left: center ? 0 : left, right: center ? 0 : undefined, display: "flex", justifyContent: center ? "center" : "flex-start", gap: "0.32em", ...rise(frame, at, 12) }}>
      {pre ? <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: size, letterSpacing: 0.5, color: BRAND.text, textTransform: "uppercase" }}>{pre}</span> : null}
      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: size, letterSpacing: 0.5, color: BRAND.accent, textTransform: "uppercase" }}>{hot}</span>
      {post ? <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: size, letterSpacing: 0.5, color: BRAND.text, textTransform: "uppercase" }}>{post}</span> : null}
    </div>
  );
};

// thin orange underline that draws on (§28)
const Underline: React.FC<{ at: number; w: number; style?: React.CSSProperties }> = ({ at, w, style }) => {
  const frame = useCurrentFrame();
  return <div style={{ height: 3, borderRadius: 2, background: BRAND.accent, width: interpolate(frame, [at, at + 16], [0, w], { ...CLAMP, easing: EASE }), ...style }} />;
};

const Fingerprint: React.FC<{ size?: number; color?: string; opacity?: number }> = ({ size = 40, color = BRAND.accent, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" style={{ opacity }}>
    <path d="M12 3a8 8 0 0 0-8 8c0 3.5 1 6 2.5 8.5" /><path d="M12 7a4 4 0 0 0-4 4c0 3 .8 5.4 2 7.6" /><path d="M12 11c0 3.2.9 5.9 2.2 8" /><path d="M16 11a4 4 0 0 0-1.2-2.9" /><path d="M20 11a8 8 0 0 0-3-6.2" /><path d="M16.5 15.5c.6 1.7 1.4 3 2.3 4.1" />
  </svg>
);

// ── EvidenceScene — the receipt system (§26-30): real screenshot, dark stage,
// small SOURCE label, pan/zoom through claims, orange underline/box notes ────
type Rect = { x: number; y: number; w: number; h: number };
type Note = { at: number; rect: Rect; kind?: "underline" | "box" | "wash" };
export const EvidenceScene: React.FC<{
  durationInFrames: number; src: string; imageW: number; imageH: number;
  source: string; // "ANTHROPIC" → renders SOURCE · ANTHROPIC
  title?: string; // optional short editorial line under the label
  from: Rect; to: Rect; zoomAt?: number; waypoints?: { rect: Rect; at: number }[];
  notes?: Note[]; viewW?: number; viewH?: number;
}> = ({ src, imageW, imageH, source, title, from, to, zoomAt = 10, waypoints, notes = [], viewW = 1600, viewH = 830 }) => {
  const frame = useCurrentFrame();
  const keys: { at: number; rect: Rect }[] = waypoints?.length
    ? waypoints.map((w, i) => (i === 0 ? { at: 0, rect: w.rect } : w))
    : [{ at: 0, rect: from }, { at: zoomAt + 26, rect: to }];
  const ats = keys.map((k) => k.at);
  const lerpField = (f: keyof Rect) =>
    keys.length === 1 ? keys[0].rect[f] : interpolate(frame, ats, keys.map((k) => k.rect[f]), { ...CLAMP, easing: EASE });
  const r: Rect = { x: lerpField("x"), y: lerpField("y"), w: lerpField("w"), h: lerpField("h") };
  const scale = Math.max(viewW / r.w, viewH / r.h);
  const tx = -(r.x + r.w / 2) * scale + viewW / 2;
  const ty = -(r.y + r.h / 2) * scale + viewH / 2;
  const vx = (1920 - viewW) / 2;
  const vy = (1080 - viewH) / 2 + 34;
  return (
    <Stage push={false}>
      <div style={{ position: "absolute", left: vx, top: vy - 58, display: "flex", alignItems: "center", gap: 10, ...rise(frame, 6, 8) }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND.accent }} />
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 21, letterSpacing: 4, textTransform: "uppercase", color: BRAND.dim }}>Source · {source}</span>
        {title ? <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 22, letterSpacing: 0.2, color: BRAND.text, marginLeft: 14 }}>{title}</span> : null}
      </div>
      <div style={{ position: "absolute", left: vx, top: vy, width: viewW, height: viewH, overflow: "hidden", borderRadius: 10, border: `1px solid ${BRAND.line}`, background: BRAND.surface, boxShadow: "0 14px 40px rgba(0,0,0,0.4)", opacity: interpolate(frame, [4, 14], [0, 1], CLAMP) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: imageW, height: imageH, transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: "0 0" }}>
          <Img src={staticFile(src)} style={{ width: imageW, height: imageH }} />
          {notes.map((n, i) => {
            const draw = interpolate(frame, [n.at, n.at + 18], [0, 1], { ...CLAMP, easing: EASE });
            if (frame < n.at) return null;
            if (n.kind === "underline") return <div key={i} style={{ position: "absolute", left: n.rect.x, top: n.rect.y + n.rect.h, width: n.rect.w * draw, height: Math.max(4, 6 / scale), background: BRAND.accent, borderRadius: 3 }} />;
            if (n.kind === "wash") return <div key={i} style={{ position: "absolute", left: n.rect.x, top: n.rect.y, width: n.rect.w, height: n.rect.h, background: BRAND.accent, opacity: 0.16 * draw, borderRadius: 4 }} />;
            return <div key={i} style={{ position: "absolute", left: n.rect.x - 10, top: n.rect.y - 8, width: n.rect.w + 20, height: n.rect.h + 16, border: `${Math.max(2, 3 / scale)}px solid ${BRAND.accent}`, borderRadius: 8, opacity: draw }} />;
          })}
        </div>
      </div>
    </Stage>
  );
};

// ── 1. DetectionCardScene — clearly-conceptual detector (hook) ───────────────
export const DetectionCardScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  return (
    <Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "30px 54px", borderRadius: 10, background: BRAND.surface, border: `1px solid ${BRAND.line}`, ...rise(frame, ats[0], 16) }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: BRAND.red, boxShadow: `0 0 18px ${BRAND.red}` }} />
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 46, letterSpacing: 0.3, color: BRAND.text }}>Claude watermark detected</span>
        </div>
        <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 34, letterSpacing: 1, color: BRAND.dim, textTransform: "uppercase", ...rise(frame, ats[1], 10) }}>
          Claude wrote this<span style={{ color: BRAND.accent }}>?</span>
        </span>
        {frame >= ats[2] && (
          <div style={{ transform: `rotate(-3deg)`, padding: "8px 26px", border: `2.5px solid ${BRAND.red}`, borderRadius: 8, opacity: interpolate(frame, [ats[2], ats[2] + 8], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: BRAND.red, textTransform: "uppercase" }}>Case closed</span>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 26, right: 34, padding: "5px 14px", borderRadius: 6, border: `1px solid rgba(142,139,132,0.4)` }}>
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: BRAND.dim }}>Illustration</span>
      </div>
    </Stage>
  );
};

// ── 2. LaunchVsBlogScene — §70: typography + strike, no cards, no ✓/✗ ────────
export const LaunchVsBlogScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [ats[0] + 26, ats[0] + 44], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <Stage>
      <Head eyebrow="How it arrived" />
      <div style={{ position: "absolute", left: 140, top: 380, display: "flex", flexDirection: "column", gap: 56 }}>
        <div style={{ position: "relative", ...rise(frame, ats[0], 14) }}>
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 66, letterSpacing: -0.5, color: BRAND.dim }}>Big product launch</span>
          <div style={{ position: "absolute", left: "-1%", top: "54%", width: `${strike * 102}%`, height: 4, background: BRAND.dim, borderRadius: 2 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, ...rise(frame, ats[1], 14) }}>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 78, letterSpacing: -1, color: BRAND.text }}>Technical blog post.</span>
          <Underline at={ats[1] + 8} w={330} />
        </div>
      </div>
    </Stage>
  );
};

// ── 3. InspectParagraphScene — document surface on dark; nothing hidden ──────
const PARA = "The weather shifted overnight. By morning the sky looked overcast, and the streets were quiet. Most people stayed inside, waiting for the cold to pass before heading out again.";
const DocCard: React.FC<{ w?: number; label?: string; labelAt?: number }> = ({ w = 960, label, labelAt = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, display: "flex", flexDirection: "column", gap: 14 }}>
      {label ? <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 20, letterSpacing: 3.5, textTransform: "uppercase", color: BRAND.dim, ...rise(frame, labelAt, 8) }}>{label}</span> : null}
      <div style={{ padding: "38px 44px", borderRadius: 10, background: BRAND.surface, border: `1px solid ${BRAND.line}` }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 29, lineHeight: 1.7, color: BRAND.text, opacity: 0.92 }}>{PARA}</span>
      </div>
    </div>
  );
};
export const InspectParagraphScene: React.FC<{ durationInFrames: number; mode: "single" | "pair" | "scan"; ats: number[] }> = ({ mode, ats }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [ats[0], ats[0] + 90], [0.06, 0.9], { ...CLAMP, easing: EASE });
  return (
    <Stage>
      <Head eyebrow={mode === "pair" ? "Human-eye view" : "Look closer"} title={mode === "pair" ? "Can you tell?" : mode === "scan" ? "Just normal writing" : "Nothing hidden"} />
      {mode === "pair" ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 44 }}>
          <div style={{ ...rise(frame, 10, 12) }}><DocCard w={780} label="Original" labelAt={10} /></div>
          <div style={{ ...rise(frame, 22, 12) }}><DocCard w={780} label="Watermarked" labelAt={22} /></div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", ...rise(frame, 8, 14) }}>
          <div style={{ position: "relative" }}>
            <DocCard />
            <div style={{ position: "absolute", top: -26, left: `${sweep * 84}%`, width: 130, height: 130, borderRadius: "50%", border: `2px solid ${BRAND.dim}`, opacity: interpolate(frame, [ats[0], ats[0] + 8, ats[0] + 150, ats[0] + 168], [0, 0.9, 0.9, 0], CLAMP) }}>
              <div style={{ position: "absolute", bottom: -36, right: -12, width: 8, height: 50, borderRadius: 4, background: BRAND.dim, transform: "rotate(-40deg)" }} />
            </div>
          </div>
        </div>
      )}
      <Emph at={ats[1] ?? 60} center bottom={96} size={38}
        pre={mode === "pair" ? "You" : mode === "scan" ? "No word looks" : "No hidden"}
        hot={mode === "pair" ? "can't see it" : mode === "scan" ? "nudged" : "tag"} />
    </Stage>
  );
};

// ── 4. WordForkScene — bare words, thin branches, orange winner ──────────────
export const WordForkScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const Fork: React.FC<{ x: number; y: number; base: string; a: string; b: string; at: number; s?: number }> = ({ x, y, base, a, b, at, s = 1 }) => (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 * s, ...rise(frame, at, 12) }}>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 42 * s, color: BRAND.text, opacity: 0.9 }}>{base}</span>
      <svg width={320 * s} height={64 * s}>
        <path d={`M ${160 * s} 4 Q ${160 * s} ${30 * s} ${56 * s} ${58 * s}`} stroke={BRAND.dim} strokeWidth={2} fill="none" opacity={interpolate(frame, [at + 10, at + 24], [0, 0.7], CLAMP)} />
        <path d={`M ${160 * s} 4 Q ${160 * s} ${30 * s} ${264 * s} ${58 * s}`} stroke={BRAND.accent} strokeWidth={2.5} fill="none" opacity={interpolate(frame, [at + 16, at + 30], [0, 1], CLAMP)} />
      </svg>
      <div style={{ display: "flex", gap: 90 * s }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 44 * s, color: BRAND.dim, opacity: interpolate(frame, [at + 20, at + 30], [0, 0.85], CLAMP) }}>{a}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", opacity: interpolate(frame, [at + 26, at + 36], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 44 * s, color: BRAND.text }}>{b}</span>
          <Underline at={at + 30} w={110 * s} />
        </div>
      </div>
    </div>
  );
  return (
    <Stage>
      <Head eyebrow="Where the watermark lives" title="The words Claude chooses" />
      <Fork x={480} y={330} base="…the sky looked" a="grey" b="overcast" at={ats[0]} />
      <Fork x={1160} y={620} base="…the air felt" a="cold" b="wintry" at={ats[1]} s={0.72} />
      <Emph at={ats[2]} pre="Both work —" hot="that's the point" size={34} bottom={96} left={480} />
    </Stage>
  );
};

// ── 5. KeyBarsScene — probability bars, no numbers (ILLUSTRATION) ────────────
export const KeyBarsScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const nudge = interpolate(frame, [ats[1], ats[1] + 34], [0, 1], { ...CLAMP, easing: EASE });
  const wGrey = interpolate(nudge, [0, 1], [0.5, 0.38]);
  const wOver = interpolate(nudge, [0, 1], [0.5, 0.62]);
  const barIn = interpolate(frame, [ats[0], ats[0] + 18], [0, 1], CLAMP);
  return (
    <Stage>
      <Head eyebrow="A secret key, not a stamp" title="A gentle nudge" />
      <div style={{ position: "absolute", left: 300, top: 430, display: "flex", flexDirection: "column", gap: 46, width: 1140 }}>
        {[{ label: "grey", w: wGrey, hot: false }, { label: "overcast", w: wOver, hot: true }].map((b) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 34, opacity: barIn }}>
            <span style={{ width: 200, textAlign: "right", fontFamily: "Georgia, serif", fontSize: 42, color: b.hot ? BRAND.text : BRAND.dim }}>{b.label}</span>
            <div style={{ flex: 1, height: 42, borderRadius: 6, background: BRAND.faint, overflow: "hidden" }}>
              <div style={{ width: `${b.w * 100}%`, height: "100%", borderRadius: 6, background: b.hot ? BRAND.accent : "rgba(142,139,132,0.5)", opacity: b.hot ? 0.92 : 1 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 300, top: 392, opacity: interpolate(frame, [ats[1] - 14, ats[1] - 4], [0, 1], CLAMP), transform: `translateY(${interpolate(nudge, [0, 1], [-20, 8], CLAMP)}px) rotate(-22deg)` }}>
        <svg width={92} height={92} viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="4.5" stroke={BRAND.accent} strokeWidth="1.6" /><path d="M11.4 11.4 L20 20 M17 17l2.4-2.4M14.6 14.6l2.2-2.2" stroke={BRAND.accent} strokeWidth="1.6" strokeLinecap="round" /></svg>
      </div>
      <Emph at={ats[2]} pre="Nothing" hot="added" post="to the text" size={34} bottom={110} left={300} />
      <div style={{ position: "absolute", bottom: 26, right: 34, padding: "5px 14px", borderRadius: 6, border: `1px solid rgba(142,139,132,0.4)` }}>
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: BRAND.dim }}>Illustration</span>
      </div>
    </Stage>
  );
};

// ── 6. ParisScene — no fork, nothing to nudge ────────────────────────────────
export const ParisScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const typed = "Paris is the capital of";
  const shown = typed.slice(0, Math.round(interpolate(frame, [ats[0], ats[0] + 40], [0, typed.length], CLAMP)));
  const collapse = interpolate(frame, [ats[3], ats[3] + 30], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <Stage>
      <Head eyebrow="Where there's no choice" title="No fork, no watermark" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ width: 1060, padding: "44px 52px", borderRadius: 10, background: BRAND.surface, border: `1px solid ${BRAND.line}`, ...rise(frame, ats[0] - 6, 12) }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 50, color: BRAND.text }}>
            {shown}<span style={{ opacity: frame % 20 < 10 ? 0.8 : 0 }}>|</span>{" "}
            <span style={{ display: "inline-block", minWidth: 210, borderBottom: `3px solid ${BRAND.accent}`, textAlign: "center", color: BRAND.accent, fontFamily: INTER, fontWeight: 600, fontSize: 48, opacity: interpolate(frame, [ats[1], ats[1] + 8], [0, 1], CLAMP) }}>France</span>
          </span>
          <svg width={940} height={96} style={{ opacity: interpolate(frame, [ats[2], ats[2] + 10], [0, 1], CLAMP), marginTop: 18 }}>
            <path d={`M 470 4 Q 470 34 ${interpolate(collapse, [0, 1], [310, 462], CLAMP)} 88`} stroke={BRAND.dim} strokeWidth={2} fill="none" opacity={interpolate(collapse, [0, 1], [0.6, 0.1], CLAMP)} />
            <path d={`M 470 4 Q 470 34 ${interpolate(collapse, [0, 1], [630, 478], CLAMP)} 88`} stroke={BRAND.dim} strokeWidth={2} fill="none" opacity={interpolate(collapse, [0, 1], [0.6, 0.1], CLAMP)} />
            <path d="M 470 4 L 470 88" stroke={BRAND.accent} strokeWidth={3.5} strokeLinecap="round" opacity={collapse} />
            <circle cx={470} cy={88} r={5.5} fill={BRAND.accent} opacity={collapse} />
          </svg>
        </div>
      </div>
      <Emph at={ats[2]} pre="One right answer —" hot="nothing to nudge" size={34} bottom={100} center />
    </Stage>
  );
};

// ── 7. EcosystemScene — §69: thin-line architecture diagram, no cards ────────
export const EcosystemScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const items = [
    { label: "API", x: 430, y: 340 }, { label: "App", x: 400, y: 560 }, { label: "Claude Code", x: 520, y: 770 },
    { label: "Cowork", x: 1280, y: 770 }, { label: "AWS", x: 1450, y: 340 }, { label: "Google Cloud", x: 1480, y: 560 },
    { label: "Microsoft Foundry", x: 1120, y: 268 },
  ];
  const hub = rise(frame, 8, 10);
  return (
    <Stage>
      <Head eyebrow="Where it runs" title="Every surface, by default" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {items.map((it, i) => (
          <line key={it.label} x1={960} y1={545} x2={it.x + (it.x < 960 ? 120 : 30)} y2={it.y + 16} stroke="rgba(142,139,132,0.4)" strokeWidth={1.5} opacity={interpolate(frame, [ats[i], ats[i] + 12], [0, 1], CLAMP)} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 810, top: 500, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...hub }}>
        <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 64, letterSpacing: -1, color: BRAND.text }}>Claude</span>
        <Underline at={16} w={150} />
      </div>
      {items.map((it, i) => (
        <div key={it.label} style={{ position: "absolute", left: it.x, top: it.y, display: "flex", alignItems: "center", gap: 10, ...rise(frame, ats[i], 10) }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.dim }} />
          <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 28, letterSpacing: 2.5, textTransform: "uppercase", color: BRAND.text, opacity: 0.92 }}>{it.label}</span>
        </div>
      ))}
    </Stage>
  );
};

// ── 8. WorldwideScene — dark map band, orange pins, typographic close ────────
export const WorldwideScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const pins = [{ x: 520, y: 430, label: "US" }, { x: 940, y: 370, label: "EU" }, { x: 1400, y: 500, label: "APAC" }];
  return (
    <Stage>
      <Head eyebrow="Aug 2 onwards, by default" title="Worldwide" />
      <div style={{ position: "absolute", left: 260, right: 260, top: 320, bottom: 330, borderRadius: 14, border: `1px solid ${BRAND.line}`, background: "radial-gradient(rgba(242,238,230,0.055) 1.2px, transparent 1.2px)", backgroundSize: "26px 26px", opacity: interpolate(frame, [6, 18], [0, 1], CLAMP) }} />
      {pins.map((p, i) => (
        <div key={p.label} style={{ position: "absolute", left: p.x, top: p.y, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, ...rise(frame, ats[0] + i * 12, 12) }}>
          <svg width={40} height={50} viewBox="0 0 24 30" fill="none"><path d="M12 1C6 1 2 5.5 2 11c0 7 10 17 10 17s10-10 10-17c0-5.5-4-10-10-10z" stroke={BRAND.accent} strokeWidth={1.8} /><circle cx="12" cy="11" r="3.6" fill={BRAND.accent} /></svg>
          <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 22, letterSpacing: 2.5, textTransform: "uppercase", color: BRAND.dim }}>{p.label}</span>
        </div>
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M 560 440 Q 740 340 950 405" stroke={BRAND.accent} strokeWidth={1.8} fill="none" strokeDasharray="7 8" opacity={interpolate(frame, [ats[1], ats[1] + 16], [0, 0.75], CLAMP)} />
        <path d="M 980 405 Q 1210 360 1420 528" stroke={BRAND.accent} strokeWidth={1.8} fill="none" strokeDasharray="7 8" opacity={interpolate(frame, [ats[1] + 8, ats[1] + 24], [0, 0.75], CLAMP)} />
      </svg>
      <Emph at={ats[1]} pre="Same mark," hot="same reply" size={34} bottom={116} left={300} />
      <Emph at={ats[2]} pre="No" hot="off switch" size={34} bottom={116} left={1150} />
    </Stage>
  );
};

// ── 9. SplitLayerScene — real footage + real doc, editorial labels ───────────
export const SplitLayerScene: React.FC<{ durationInFrames: number; clip: string; shot: string; slamAt: number }> = ({ clip, shot, slamAt }) => {
  const frame = useCurrentFrame();
  const Panel: React.FC<{ x: number; label: string; hotWord: string; children: React.ReactNode; at: number }> = ({ x, label, hotWord, children, at }) => (
    <div style={{ position: "absolute", left: x, top: 280, width: 790, display: "flex", flexDirection: "column", gap: 14, ...rise(frame, at, 12) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND.accent }} />
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 21, letterSpacing: 3.5, textTransform: "uppercase", color: BRAND.dim }}>{label} <span style={{ color: BRAND.text }}>{hotWord}</span></span>
      </div>
      <div style={{ width: 790, height: 450, borderRadius: 10, overflow: "hidden", border: `1px solid ${BRAND.line}`, background: BRAND.surface, boxShadow: "0 12px 34px rgba(0,0,0,0.4)" }}>{children}</div>
    </div>
  );
  return (
    <Stage push={false}>
      <Head eyebrow="Don't mix these up" title="Two different layers" />
      <Panel x={130} label="Text watermark ·" hotWord="in the words" at={8}>
        <OffthreadVideo src={staticFile(clip)} muted playbackRate={1.05} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Panel>
      <Panel x={1000} label="C2PA ·" hotWord="file metadata" at={26}>
        <Img src={staticFile(shot)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "0 0" }} />
      </Panel>
      <div style={{ position: "absolute", bottom: 92, left: 0, right: 0, display: "flex", justifyContent: "center", gap: "0.34em", ...rise(frame, slamAt, 14) }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 48, letterSpacing: 0.5, color: BRAND.text, textTransform: "uppercase" }}>Not the</span>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 48, letterSpacing: 0.5, color: BRAND.accent, textTransform: "uppercase" }}>same thing</span>
      </div>
    </Stage>
  );
};

// ── 10. SixLabsScene — §71: typographic grid, subtle EU gold, no cards ───────
export const SixLabsScene: React.FC<{ durationInFrames: number; labAts: number[]; globalAt: number }> = ({ labAts, globalAt }) => {
  const frame = useCurrentFrame();
  const labs = ["Anthropic", "OpenAI", "Google", "Meta", "Microsoft", "Mistral"];
  const shift = interpolate(frame, [globalAt, globalAt + 28], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <Stage>
      <div style={{ position: "absolute", left: 140, top: 96, display: "flex", flexDirection: "column", gap: 12, ...rise(frame, 4, 10) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A227" }} />
          <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 21, letterSpacing: 4.5, textTransform: "uppercase", color: BRAND.dim }}>EU Code of Practice · Transparency</span>
        </div>
        <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 50, letterSpacing: -0.5, color: BRAND.text }}>Six labs. One framework.</span>
      </div>
      <div style={{ position: "absolute", left: 140, top: 400, transform: `translateX(${shift * -30}px)`, opacity: 1 - shift * 0.45 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 340px)", rowGap: 64, columnGap: 30 }}>
          {labs.map((l, i) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", gap: 10, ...rise(frame, labAts[i] ?? 0, 12) }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 44, letterSpacing: -0.5, color: BRAND.text }}>{l}</span>
              <div style={{ width: 44, height: 2, background: "rgba(142,139,132,0.4)" }} />
            </div>
          ))}
        </div>
      </div>
      {frame >= globalAt && (
        <div style={{ position: "absolute", right: 150, top: 460, display: "flex", flexDirection: "column", gap: 24, ...rise(frame, globalAt + 4, 14) }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 32, color: BRAND.dim }}>EU build + global build</span>
            <div style={{ position: "absolute", left: 0, top: "52%", width: `${interpolate(frame, [globalAt + 14, globalAt + 30], [0, 100], CLAMP)}%`, height: 3, background: BRAND.dim, borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 52, letterSpacing: -0.5, color: BRAND.accent, opacity: interpolate(frame, [globalAt + 26, globalAt + 38], [0, 1], CLAMP) }}>One global system</span>
            <Underline at={globalAt + 30} w={240} />
          </div>
        </div>
      )}
    </Stage>
  );
};

// ── 11. ContactFlowScene — flow + verbs (the key graphic) ────────────────────
export const ContactFlowScene: React.FC<{ durationInFrames: number; mode: "flow" | "verbs"; ats: number[] }> = ({ mode, ats }) => {
  const frame = useCurrentFrame();
  if (mode === "flow") {
    const nodes = [
      { label: "Text", at: ats[0], x: 350, hot: false },
      { label: "Claude", at: ats[0] + 14, x: 810, hot: true },
      { label: "Text", at: ats[1], x: 1290, hot: false, mark: true },
    ];
    return (
      <Stage>
        <Head eyebrow="What a positive hit shows" title="Claude touched it" />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={600} y1={520} x2={790} y2={520} stroke="rgba(142,139,132,0.5)" strokeWidth={1.5} opacity={interpolate(frame, [ats[0] + 18, ats[0] + 30], [0, 1], CLAMP)} />
          <line x1={1090} y1={520} x2={1275} y2={520} stroke="rgba(142,139,132,0.5)" strokeWidth={1.5} opacity={interpolate(frame, [ats[1] - 8, ats[1] + 4], [0, 1], CLAMP)} />
        </svg>
        {nodes.map((n, i) => (
          <div key={i} style={{ position: "absolute", left: n.x, top: 478, display: "flex", alignItems: "center", gap: 16, ...rise(frame, n.at, 12) }}>
            <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 54, letterSpacing: -0.5, color: n.hot ? BRAND.accent : BRAND.text }}>{n.label}</span>
            {n.mark && <div style={{ opacity: interpolate(frame, [ats[1] + 12, ats[1] + 24], [0, 1], CLAMP) }}><Fingerprint size={42} /></div>}
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 104, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: "0.4em", ...rise(frame, ats[2], 12) }}>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 42, textTransform: "uppercase", color: BRAND.text }}>Contact</span>
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 44, color: BRAND.accent }}>≠</span>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 42, textTransform: "uppercase", color: BRAND.dim }}>wrote all of it</span>
        </div>
      </Stage>
    );
  }
  const verbs = ["Write", "Proofread", "Translate", "Summarise / edit"];
  return (
    <Stage>
      <Head eyebrow="Four different uses" title="One identical flag" />
      <div style={{ position: "absolute", left: 170, top: 400, display: "grid", gridTemplateColumns: "repeat(2, 330px)", rowGap: 60, columnGap: 40 }}>
        {verbs.map((v, i) => (
          <div key={v} style={{ display: "flex", flexDirection: "column", gap: 8, ...rise(frame, ats[i], 12) }}>
            <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 42, letterSpacing: -0.5, color: BRAND.text }}>{v}</span>
            <div style={{ width: 40, height: 2, background: "rgba(142,139,132,0.4)" }} />
          </div>
        ))}
      </div>
      <svg width={200} height={70} style={{ position: "absolute", left: 900, top: 520, opacity: interpolate(frame, [ats[4] - 12, ats[4]], [0, 0.8], CLAMP) }}>
        <path d="M 10 35 L 168 35 M 146 16 L 172 35 L 146 54" stroke={BRAND.dim} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 1150, top: 470, display: "flex", flexDirection: "column", gap: 12, ...rise(frame, ats[4], 14) }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 56, letterSpacing: -0.5, color: BRAND.text, lineHeight: 1.12 }}>
          <span style={{ color: BRAND.accent }}>Same</span> detection<br />signal.
        </span>
        <Underline at={ats[4] + 8} w={200} />
      </div>
    </Stage>
  );
};

// ── 12. EssayScene — student essay chain, typographic ────────────────────────
export const EssayScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const steps = [
    { label: "Student writes essay", at: ats[0] },
    { label: "Claude fixes grammar", at: ats[1], hot: true },
    { label: "Watermark detected", at: ats[2], mark: true },
  ];
  return (
    <Stage>
      <Head eyebrow="The scenario that matters" title="The student essay" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center", alignItems: "center", gap: 38 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, ...rise(frame, s.at, 12) }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 38, letterSpacing: -0.3, color: s.hot ? BRAND.accent : BRAND.text }}>{s.label}</span>
              <div style={{ width: 38, height: 2, background: s.mark ? BRAND.accent : "rgba(142,139,132,0.4)" }} />
            </div>
            {i < 2 && (
              <svg width={54} height={40} style={{ opacity: interpolate(frame, [steps[i + 1].at - 8, steps[i + 1].at + 2], [0, 0.75], CLAMP) }}>
                <path d="M 4 20 L 40 20 M 26 8 L 44 20 L 26 32" stroke={BRAND.dim} strokeWidth={2.2} fill="none" strokeLinecap="round" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 108, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26 }}>
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 32, color: BRAND.dim, ...rise(frame, ats[3], 10) }}>Does that mean Claude wrote it?</span>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 52, letterSpacing: 1, color: BRAND.accent, textTransform: "uppercase", ...rise(frame, ats[3] + 14, 12) }}>No.</span>
      </div>
    </Stage>
  );
};

// ── 13. RewriteBreakScene — the chain that kills the signal ──────────────────
export const RewriteBreakScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const rows = [
    { label: "Claude output", mark: "on", at: ats[0] },
    { label: "Second model rewrites", mark: "none", at: ats[1] },
    { label: "Rewritten text", mark: "broken", at: ats[2] },
  ];
  return (
    <Stage>
      <Head eyebrow="The easy break" title="Rewrite = signal gone" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {rows.map((r, i) => (
          <React.Fragment key={r.label}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 860, padding: "22px 34px", borderRadius: 10, background: BRAND.surface, border: `1px solid ${BRAND.line}`, ...rise(frame, r.at, 12) }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 38, letterSpacing: -0.3, color: BRAND.text }}>{r.label}</span>
              {r.mark === "on" && <Fingerprint size={40} />}
              {r.mark === "broken" && (
                <div style={{ position: "relative" }}>
                  <Fingerprint size={40} color="rgba(242,238,230,0.3)" />
                  <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [ats[3], ats[3] + 10], [0, 1], CLAMP) }}><path d="M5 5l14 14M19 5L5 19" stroke={BRAND.red} strokeWidth={2.6} strokeLinecap="round" /></svg>
                </div>
              )}
            </div>
            {i < 2 && <svg width={30} height={34} style={{ opacity: interpolate(frame, [rows[i + 1].at - 8, rows[i + 1].at + 2], [0, 0.7], CLAMP) }}><path d="M15 2 L15 24 M6 17 L15 28 L24 17" stroke={BRAND.dim} strokeWidth={2.2} fill="none" strokeLinecap="round" /></svg>}
          </React.Fragment>
        ))}
      </div>
    </Stage>
  );
};

// ── 14. LifecycleFadeScene — signal fades downstream ─────────────────────────
export const LifecycleFadeScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const stages = ["Generated", "Edited", "Rewritten", "Translated", "Another model"];
  return (
    <Stage>
      <Head eyebrow="What Article 50(2) actually asks" title="Detectable when produced" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 30 }}>
        {stages.map((s, i) => {
          const sig = Math.max(1 - i * 0.24, 0.08);
          return (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 250, ...rise(frame, ats[i], 12) }}>
                <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 30, letterSpacing: -0.3, color: i === 0 ? BRAND.text : BRAND.dim, whiteSpace: "nowrap" }}>{s}</span>
                <Fingerprint size={36} color={i === 0 ? BRAND.accent : BRAND.dim} opacity={sig} />
                {i === 0 && <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 19, letterSpacing: 2.5, color: BRAND.accent, textTransform: "uppercase" }}>✓ detectable</span>}
              </div>
              {i < 4 && <svg width={30} height={30} style={{ marginTop: 8, opacity: interpolate(frame, [ats[i + 1] - 6, ats[i + 1] + 4], [0, 0.6], CLAMP) }}><path d="M4 15 L22 15 M14 6 L24 15 L14 24" stroke={BRAND.dim} strokeWidth={2} fill="none" strokeLinecap="round" /></svg>}
            </React.Fragment>
          );
        })}
      </div>
      <Emph at={ats[4] + 14} pre="Durability ≠" hot="the requirement" size={36} bottom={120} center />
    </Stage>
  );
};

// ── 15. ComplianceScene — cleared vs created, typographic (§31/§32) ──────────
export const ComplianceScene: React.FC<{ durationInFrames: number; leftAt: number; rightAt: number }> = ({ leftAt, rightAt }) => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [rightAt + 22, rightAt + 40], [0, 1], { ...CLAMP, easing: EASE });
  return (
    <Stage>
      <Head eyebrow="What was actually achieved" title="Cleared vs created" />
      <div style={{ position: "absolute", left: 200, top: 420, display: "flex", flexDirection: "column", gap: 16, ...rise(frame, leftAt, 14) }}>
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 22, letterSpacing: 3.5, textTransform: "uppercase", color: BRAND.dim }}>Cleared</span>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 64, letterSpacing: -1, color: BRAND.text }}>A compliance<br />requirement.</span>
        <Underline at={leftAt + 10} w={230} />
      </div>
      <div style={{ position: "absolute", left: 1060, top: 420, display: "flex", flexDirection: "column", gap: 16, ...rise(frame, rightAt, 14) }}>
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 22, letterSpacing: 3.5, textTransform: "uppercase", color: BRAND.dim }}>Not created</span>
        <div style={{ position: "relative" }}>
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 52, letterSpacing: -0.5, color: BRAND.dim, lineHeight: 1.2 }}>A tamper-proof<br />authorship detector.</span>
          <div style={{ position: "absolute", left: 0, top: "50%", width: `${strike * 100}%`, height: 3.5, background: "rgba(142,139,132,0.8)", borderRadius: 2 }} />
        </div>
      </div>
      <svg width={3} height={260} style={{ position: "absolute", left: 985, top: 430, opacity: interpolate(frame, [rightAt, rightAt + 12], [0, 0.35], CLAMP) }}><line x1={1.5} y1={0} x2={1.5} y2={260} stroke={BRAND.dim} strokeWidth={1.5} /></svg>
    </Stage>
  );
};

// ── 16. ContextTripleScene — grade / job / legal (minimal doc surfaces) ──────
export const ContextTripleScene: React.FC<{ durationInFrames: number; ats: number[] }> = ({ ats }) => {
  const frame = useCurrentFrame();
  const docs = [
    { title: "Essay", tag: "Grade", lines: 7, at: ats[0] },
    { title: "CV", tag: "Job", lines: 6, at: ats[1] },
    { title: "Contract", tag: "Legal", lines: 8, at: ats[2] },
  ];
  return (
    <Stage>
      <Head eyebrow="Where the stakes get real" title="A grade. A job. A legal claim." />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", gap: 48 }}>
        {docs.map((d) => (
          <div key={d.title} style={{ width: 360, padding: "28px 32px", borderRadius: 10, background: BRAND.surface, border: `1px solid ${BRAND.line}`, display: "flex", flexDirection: "column", gap: 12, ...rise(frame, d.at, 16) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 32, color: BRAND.text }}>{d.title}</span>
              <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 19, letterSpacing: 2.5, textTransform: "uppercase", color: BRAND.accent }}>{d.tag}</span>
            </div>
            {Array.from({ length: d.lines }).map((_, i) => (
              <div key={i} style={{ height: 9, borderRadius: 4, background: "rgba(242,238,230,0.1)", width: `${88 - (i % 3) * 14}%` }} />
            ))}
          </div>
        ))}
      </div>
    </Stage>
  );
};

// ── 17. EvidenceStackScene — §72: one signal vs the corroborated case ────────
export const EvidenceStackScene: React.FC<{ durationInFrames: number; ats: number[]; compareAt: number }> = ({ ats, compareAt }) => {
  const frame = useCurrentFrame();
  const extras = ["Draft history", "Account records", "Independent source"];
  return (
    <Stage>
      <Head eyebrow="How to actually use it" title="One signal, not the case" />
      {/* lone hit — small, muted */}
      <div style={{ position: "absolute", left: 300, top: 480, display: "flex", flexDirection: "column", gap: 12, ...rise(frame, compareAt, 12) }}>
        <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 40, letterSpacing: -0.5, color: BRAND.dim }}>Watermark hit</span>
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: BRAND.red, opacity: 0.85 }}>weak alone</span>
      </div>
      {/* corroborated stack */}
      <div style={{ position: "absolute", left: 1010, top: 330, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, ...rise(frame, ats[0], 10) }}>
          <Fingerprint size={34} />
          <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 44, letterSpacing: -0.5, color: BRAND.text }}>Watermark hit</span>
        </div>
        {extras.map((c, i) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 16, ...rise(frame, ats[i + 1], 10) }}>
            <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 34, color: BRAND.accent }}>+</span>
            <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 36, letterSpacing: -0.3, color: BRAND.text, opacity: 0.92 }}>{c}</span>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10, ...rise(frame, compareAt + 12, 12) }}>
          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, letterSpacing: 0.5, color: BRAND.accent, textTransform: "uppercase" }}>Stronger evidence</span>
          <Underline at={compareAt + 16} w={220} />
        </div>
      </div>
      {/* connective line strengthens as the stack builds */}
      <svg width={4} height={330} style={{ position: "absolute", left: 985, top: 340 }}>
        <line x1={2} y1={0} x2={2} y2={330} stroke={BRAND.line} strokeWidth={1.5} opacity={interpolate(frame, [ats[1], compareAt], [0.2, 0.7], CLAMP)} />
      </svg>
    </Stage>
  );
};

// ── 18. FinalFlowScene — tiny closing visual ─────────────────────────────────
export const FinalFlowScene: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  return (
    <Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "center", gap: 34, ...rise(frame, 6, 14) }}>
        {["Human text", "Claude", "Text"].map((l, i) => (
          <React.Fragment key={l}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 54, letterSpacing: -0.5, color: i === 1 ? BRAND.accent : BRAND.text }}>{l}</span>
              {i === 2 && <div style={{ opacity: interpolate(frame, [36, 48], [0, 1], CLAMP) }}><Fingerprint size={42} /></div>}
            </div>
            {i < 2 && <svg width={54} height={40}><path d="M 4 20 L 40 20 M 26 8 L 44 20 L 26 32" stroke={BRAND.dim} strokeWidth={2.2} fill="none" strokeLinecap="round" /></svg>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 130, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: "0.4em", ...rise(frame, 42, 12) }}>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, textTransform: "uppercase", color: BRAND.text }}>Touched</span>
        <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 46, color: BRAND.accent }}>≠</span>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, textTransform: "uppercase", color: BRAND.text }}>wrote</span>
      </div>
    </Stage>
  );
};
