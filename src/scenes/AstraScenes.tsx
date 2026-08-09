import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NEWS, DISPLAY, HERO } from "./AiNews2Scenes";

// AstraScenes — native scenes for the Astra ten-proofs fact-check (Aug 2026).
// Bold-newsroom style; receipts + podcast film cards carry the footage beats
// (GemRoboticsScenes kit), these cover what screenshots can't show: the Lean
// gate, the ten-problem grid, 27-vs-80, the mis-hung headline, the two-signal
// split, the system-card fork and the closing rule. All anchors whisper-pinned.

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

const Stage: React.FC<{ tint?: string; children: React.ReactNode; header?: React.ReactNode }> = ({ tint = NEWS.brand, children, header }) => (
  <AbsoluteFill style={{ backgroundColor: NEWS.bg }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(20,18,16,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.7 }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 116%, ${tint}14, transparent 70%)` }} />
    {header}
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 120 }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

const Head: React.FC<{ kicker: string; title: string; size?: number }> = ({ kicker, title, size = 66 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  return (
    <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", zIndex: 5 }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: 5, textTransform: "uppercase", color: NEWS.brand, opacity: interpolate(frame, [0, 14], [0, 1], CLAMP) }}>{kicker}</span>
      <div style={{ fontFamily: HERO, fontWeight: 400, fontSize: size, letterSpacing: 1, color: NEWS.ink, lineHeight: 0.98, textTransform: "uppercase", whiteSpace: "nowrap", transform: `scale(${interpolate(slam, [0, 1], [1.16, 1])})`, opacity: interpolate(frame, [6, 20], [0, 1], CLAMP) }}>{title}</div>
      <div style={{ width: interpolate(slam, [0, 1], [40, 190], CLAMP), height: 6, background: NEWS.brand, borderRadius: 3 }} />
    </div>
  );
};

// ── LeanGateScene — proof cards pass the Lean gate and stack up CHECKED ─────
export const LeanGateScene: React.FC<{ durationInFrames: number; passAts: number[]; tagAt: number }> = ({ passAts, tagAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tag = spr(frame, fps, tagAt, 22);
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% 55%, ${NEWS.green}14, transparent 70%)` }} />
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", zIndex: 5 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: 5, textTransform: "uppercase", color: "#FF8A5C" }}>Machine-checked in Lean 4</span>
        <div style={{ fontFamily: HERO, fontWeight: 400, fontSize: 66, letterSpacing: 1, color: "#fff", textTransform: "uppercase" }}>THE STRICTEST INSPECTOR ON SITE</div>
        <div style={{ width: 190, height: 6, background: NEWS.brand, borderRadius: 3 }} />
      </div>
      {/* the gate */}
      <div style={{ position: "absolute", left: 960 - 190, top: 330, width: 380, height: 470, borderRadius: 22, background: "#1E1B18", border: `2px solid ${NEWS.green}66`, borderTop: `8px solid ${NEWS.green}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 80px ${NEWS.green}2E`, zIndex: 3 }}>
        <Img src={staticFile("assets/external/logos/lean.svg")} style={{ height: 120, filter: "brightness(0) invert(1)" }} />
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 52, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>Lean 4</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>re-derives every step</span>
      </div>
      {/* proof cards: fly in from the left, scan at the gate, STACK checked on the right */}
      {passAts.map((at, i) => {
        const t = interpolate(frame, [at, at + 52], [0, 1], CLAMP);
        const x = interpolate(t, [0, 0.4, 0.6, 1], [-360, 610, 1180, 1400]);
        const y = interpolate(t, [0.6, 1], [430 + i * 40, 390 + i * 128], CLAMP);
        const atGate = t >= 0.4 && t < 0.6;
        const checked = t >= 0.6;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: t < 0.6 ? 430 + i * 40 : y, display: "flex", alignItems: "center", gap: 14, opacity: interpolate(frame, [at, at + 6], [0, 1], CLAMP), zIndex: 2 }}>
            <div style={{ padding: "18px 30px", borderRadius: 12, background: checked ? "#FFFFFF" : "#26221E", border: atGate ? `3px solid ${NEWS.green}` : checked ? `2px solid ${NEWS.green}` : "1px solid rgba(255,255,255,0.18)", boxShadow: atGate ? `0 0 44px ${NEWS.green}66` : "0 12px 30px rgba(0,0,0,0.4)" }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 1, color: checked ? NEWS.ink : "#fff" }}>{["THEOREM " + (i + 1), "LEMMA " + (i + 1), "PROOF " + (i + 1)][i % 3]}</span>
            </div>
            {checked && (
              <svg width={42} height={42} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={NEWS.green} /><path d="M6.5 12.5l3.5 3.5 7-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></svg>
            )}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: "50%", bottom: 90, transform: `translateX(-50%) rotate(-1.5deg) scale(${interpolate(tag, [0, 1], [1.4, 1])})`, padding: "13px 30px", borderRadius: 10, background: NEWS.brand, opacity: interpolate(frame, [tagAt, tagAt + 8], [0, 1], CLAMP), boxShadow: "0 12px 34px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 38, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>It can't be talked into approving</span>
      </div>
    </AbsoluteFill>
  );
};

// ── TenGridScene — ten problem tiles land in three field groups, checks sweep ─
export const TenGridScene: React.FC<{ durationInFrames: number; startAt: number; fieldAts: number[]; checkAt: number }> = ({ startAt, fieldAts, checkAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fields = [
    { name: "Mathematics", n: 4, color: NEWS.blue },
    { name: "Quantum complexity", n: 3, color: NEWS.amber },
    { name: "Theoretical CS", n: 3, color: NEWS.brand },
  ];
  let tile = 0;
  return (
    <Stage tint={NEWS.blue} header={<Head kicker="Not one lucky result" title="TEN PROBLEMS, THREE FIELDS" size={68} />}>
      <div style={{ display: "flex", gap: 46, alignItems: "flex-start" }}>
        {fields.map((f, fi) => (
          <div key={f.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: interpolate(frame, [fieldAts[fi], fieldAts[fi] + 10], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 2, textTransform: "uppercase", color: NEWS.ink }}>{f.name}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", width: f.n === 4 ? 320 : 320 }}>
              {Array.from({ length: f.n }).map((_, i) => {
                const idx = tile++;
                const at = Math.max(startAt + idx * 7, fieldAts[fi]);
                const e = spr(frame, fps, at, 22);
                const checked = frame >= checkAt + idx * 4;
                return (
                  <div key={i} style={{ width: 176, height: 132, borderRadius: 12, background: NEWS.dark, borderTop: `4px solid ${f.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 12px 28px rgba(20,18,16,0.18)", transform: `scale(${interpolate(e, [0, 1], [0.6, 1])})`, opacity: interpolate(frame, [at, at + 6], [0, 1], CLAMP) }}>
                    <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 48, color: "#fff" }}>{idx + 1}</span>
                    {checked ? (
                      <svg width={26} height={26} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={NEWS.green} /><path d="M6.5 12.5l3.5 3.5 7-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></svg>
                    ) : (
                      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, letterSpacing: 1.5, color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>open</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
};

// ── Counter27Scene — "80" crossed out, the real count slams in ───────────────
export const Counter27Scene: React.FC<{ durationInFrames: number; strikeAt: number; slamAt: number }> = ({ strikeAt, slamAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: frame - slamAt, fps, config: { stiffness: 200, damping: 16 }, durationInFrames: 22 });
  const strike = interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], CLAMP);
  return (
    <Stage tint={NEWS.red} header={<Head kicker="1999 → 2026 · do the math" title="THE HARDEST ONE IN THE BATCH" size={58} />}>
      <div style={{ display: "flex", alignItems: "center", gap: 110 }}>
        <div style={{ position: "relative" }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 330, color: "rgba(20,18,16,0.35)", lineHeight: 1 }}>80</span>
          <div style={{ position: "absolute", left: "-6%", top: "48%", width: `${strike * 112}%`, height: 20, background: NEWS.red, borderRadius: 10, transform: "rotate(-8deg)" }} />
          <span style={{ position: "absolute", left: 8, bottom: -34, fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "rgba(20,18,16,0.5)" }}>the headline</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(slam, [0, 1], [1.6, 1])})`, opacity: interpolate(frame, [slamAt, slamAt + 6], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 470, color: NEWS.ink, lineHeight: 0.95, textShadow: "0 6px 0 rgba(217,80,46,0.25)" }}>27</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, letterSpacing: 4, textTransform: "uppercase", color: NEWS.brand }}>years, actually</span>
        </div>
      </div>
    </Stage>
  );
};

// ── TwoChecksScene — both results real; the 80-YR sticker hops to the RIGHT post
export const TwoChecksScene: React.FC<{ durationInFrames: number; leftAt: number; rightAt: number; hopAt: number }> = ({ leftAt, rightAt, hopAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hop = spring({ frame: frame - hopAt, fps, config: { stiffness: 130, damping: 17 }, durationInFrames: 34 });
  const hx = interpolate(hop, [0, 1], [0, -640]);
  const hy = Math.sin(Math.min(Math.max(hop, 0), 1) * Math.PI) * -110;
  const Card: React.FC<{ at: number; title: string; sub: string; date: string }> = ({ at, title, sub, date }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 640, padding: "40px 36px", borderRadius: 14, background: NEWS.dark, borderTop: `5px solid ${NEWS.green}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: "0 16px 40px rgba(20,18,16,0.22)", transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 23, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>{date}</span>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 46, letterSpacing: 1, textTransform: "uppercase", color: "#fff", textAlign: "center", lineHeight: 1.05 }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width={26} height={26} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={NEWS.green} /><path d="M6.5 12.5l3.5 3.5 7-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></svg>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 23, color: "rgba(255,255,255,0.85)" }}>{sub}</span>
        </div>
      </div>
    );
  };
  return (
    <Stage tint={NEWS.green} header={<Head kicker="Both are real — one label moved" title="THE HEADLINE HUNG ON THE WRONG POST" size={54} />}>
      <div style={{ position: "relative", display: "flex", gap: 80 }}>
        <Card at={leftAt} date="MAY 20" title="1946 ERDŐS RESULT" sub="verified outside OpenAI" />
        <Card at={rightAt} date="AUG 1" title="TEN PROBLEMS" sub="verified outside OpenAI" />
        {/* the mis-hung sticker starts on the AUG card, hops to MAY */}
        <div style={{ position: "absolute", right: 150, top: -46, transform: `translate(${hx}px, ${hy}px) rotate(${interpolate(hop, [0, 1], [3, -3])}deg)`, padding: "10px 22px", borderRadius: 10, background: NEWS.red, boxShadow: "0 12px 30px rgba(216,57,43,0.4)", opacity: interpolate(frame, [rightAt + 10, rightAt + 18], [0, 1], CLAMP), zIndex: 4 }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 32, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>"80-YEAR-OLD"</span>
        </div>
      </div>
    </Stage>
  );
};

// ── TwoSignalsScene — public math vs closed-door briefing ────────────────────
export const TwoSignalsScene: React.FC<{ durationInFrames: number; leftAt: number; rightAt: number }> = ({ leftAt, rightAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eL = spr(frame, fps, leftAt, 26);
  const eR = spr(frame, fps, rightAt, 26);
  return (
    <Stage tint={NEWS.amber} header={<Head kicker="Sit with this gap" title="ONE STORY, TWO STANDARDS" size={66} />}>
      <div style={{ display: "flex", gap: 44 }}>
        <div style={{ width: 700, padding: "44px 40px", borderRadius: 14, background: NEWS.dark, borderTop: `6px solid ${NEWS.green}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, boxShadow: "0 16px 44px rgba(20,18,16,0.22)", transform: `translateY(${interpolate(eL, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [leftAt, leftAt + 8], [0, 1], CLAMP) }}>
          <Img src={staticFile("assets/external/logos/lean.svg")} style={{ height: 58, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 44, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>The math</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 25, textAlign: "center", color: "rgba(255,255,255,0.85)" }}>re-check it on your own laptop tonight</span>
        </div>
        <div style={{ width: 700, padding: "44px 40px", borderRadius: 14, background: NEWS.dark, borderTop: `6px solid ${NEWS.amber}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, boxShadow: "0 16px 44px rgba(20,18,16,0.22)", transform: `translateY(${interpolate(eR, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [rightAt, rightAt + 8], [0, 1], CLAMP) }}>
          <svg width={58} height={58} viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.4" fill="none" stroke="#fff" strokeWidth="1.8" /><path d="M8 10V7a4 4 0 018 0v3" fill="none" stroke="#fff" strokeWidth="1.8" /></svg>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 44, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>The briefing</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 25, textAlign: "center", color: "rgba(255,255,255,0.85)" }}>nobody outside the room can verify it</span>
        </div>
      </div>
    </Stage>
  );
};

// ── TwoPathScene — the system-card fork ──────────────────────────────────────
export const TwoPathScene: React.FC<{ durationInFrames: number; docAt: number; leftAt: number; rightAt: number }> = ({ docAt, leftAt, rightAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const doc = spr(frame, fps, docAt, 26);
  const Path: React.FC<{ at: number; color: string; title: string; sub: string; x: number }> = ({ at, color, title, sub, x }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ position: "absolute", left: x, top: 230, width: 700, padding: "40px 36px", borderRadius: 14, background: NEWS.dark, borderTop: `6px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 16px 40px rgba(20,18,16,0.22)", transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", color: "#fff", textAlign: "center", lineHeight: 1.05 }}>{title}</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 24, textAlign: "center", color: "rgba(255,255,255,0.85)" }}>{sub}</span>
      </div>
    );
  };
  return (
    <Stage tint={NEWS.blue} header={<Head kicker="The next flagship release" title="THE FORK THIS STORY SITS ON" size={62} />}>
      <div style={{ position: "relative", width: 1500, height: 480 }}>
        <svg width={1500} height={480} style={{ position: "absolute", inset: 0 }}>
          <line x1={750} y1={150} x2={440} y2={235} stroke={NEWS.green} strokeWidth={4} opacity={interpolate(frame, [leftAt, leftAt + 10], [0, 0.8], CLAMP)} />
          <line x1={750} y1={150} x2={1060} y2={235} stroke={NEWS.red} strokeWidth={4} opacity={interpolate(frame, [rightAt, rightAt + 10], [0, 0.8], CLAMP)} />
        </svg>
        <div style={{ position: "absolute", left: 750 - 130, top: 10, width: 260, padding: "20px 0", borderRadius: 14, background: "#FFFFFF", border: `2px dashed ${NEWS.inkDim}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: `scale(${interpolate(doc, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [docAt, docAt + 8], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 32, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink }}>System card</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: NEWS.brand }}>not published yet</span>
        </div>
        <Path at={leftAt} color={NEWS.green} title="Cites the ten proofs" sub="the naming held up" x={90} />
        <Path at={rightAt} color={NEWS.red} title="Zero mention" sub="never the same model" x={1130 - 320} />
      </div>
    </Stage>
  );
};

// ── RuleScene — the closing two-line rule with stamps ────────────────────────
export const RuleScene: React.FC<{ durationInFrames: number; mathAt: number; briefAt: number }> = ({ mathAt, briefAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Row: React.FC<{ at: number; color: string; icon: "check" | "wait"; text: string; stamp: string }> = ({ at, color, icon, text, stamp }) => {
    const e = spr(frame, fps, at, 24);
    const st = spring({ frame: frame - at - 16, fps, config: { stiffness: 200, damping: 15 }, durationInFrames: 20 });
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 34px", borderRadius: 14, background: NEWS.dark, borderTop: `5px solid ${color}`, boxShadow: "0 14px 34px rgba(20,18,16,0.2)", transform: `translateX(${interpolate(e, [0, 1], [-44, 0])}px)`, opacity: interpolate(frame, [44, 52], [0, 1], CLAMP), width: 1420 }}>
        {icon === "check" ? (
          <svg width={40} height={40} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={NEWS.green} /><path d="M6.5 12.5l3.5 3.5 7-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></svg>
        ) : (
          <svg width={40} height={40} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.4" fill="none" stroke={NEWS.amber} strokeWidth="2.2" /><path d="M12 6.5V12l3.6 2.4" fill="none" stroke={NEWS.amber} strokeWidth="2.2" strokeLinecap="round" /></svg>
        )}
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", flex: 1 }}>{text}</span>
        <div style={{ padding: "9px 20px", borderRadius: 9, background: color, transform: `rotate(-1.5deg) scale(${interpolate(st, [0, 1], [1.5, 1], CLAMP)})`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 27, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{stamp}</span>
        </div>
      </div>
    );
  };
  return (
    <Stage tint={NEWS.green} header={<Head kicker="Until the system card exists" title="RUN THIS RULE" size={72} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Row at={mathAt} color={NEWS.green} icon="check" text="The math claims" stamp="Backed by public proofs" />
        <Row at={briefAt} color={NEWS.amber} icon="wait" text="The jobs briefing" stamp="Still waiting on its footnote" />
      </div>
    </Stage>
  );
};
