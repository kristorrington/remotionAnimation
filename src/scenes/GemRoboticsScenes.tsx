import React from "react";
import { AbsoluteFill, interpolate, Loop, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NEWS, DISPLAY, HERO, NewsShell, NewsHeadline, LabTile } from "./AiNews2Scenes";

// GemRoboticsScenes — the FOOTAGE-FIRST kit for the Gemini Robotics 2 video
// (Kris: "use as much video footage as possible"). Official DeepMind demo
// clips ride play-framed film cards; annotations pop ON the whisper words;
// diagrams cover only what footage can't show (handoffs, missing proof).
// Bold-newsroom style shared with AiNews2 (NEWS palette, Anton/Oswald).

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const spr = (frame: number, fps: number, at: number, dur = 26) =>
  spring({ frame: frame - at, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: dur });

// film-card chrome (shared)
const FilmChrome: React.FC<{ source: string }> = ({ source }) => (
  <>
    <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", borderRadius: 8, background: "rgba(10,9,8,0.66)", border: `1px solid ${NEWS.brand}` }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: NEWS.red }} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>· Official footage</span>
    </div>
    <div style={{ position: "absolute", bottom: 12, right: 16, fontFamily: DISPLAY, fontWeight: 500, fontSize: 17, color: "rgba(255,255,255,0.7)" }}>{source}</div>
  </>
);

// ── MontageClipCard — one film card whose SOURCE switches at whisper anchors ──
// (hook: lightbulb → knot; tasks: packing → lightbulb → knot). Each sub-clip
// plays muted from its own start; a white flash marks the internal hard cut.
export type MontagePart = { src: string; at: number; label?: string; clipDur?: number };
export const MontageClipCard: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; parts: MontagePart[]; source: string;
  chips?: { at: number; label: string }[]; punchIn?: boolean;
}> = ({ durationInFrames, tint = NEWS.brand, kicker, title, parts, source, chips, punchIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { stiffness: 120, damping: 20, mass: 0.9 }, durationInFrames: 24 });
  const scale = punchIn ? interpolate(e, [0, 1], [0.62, 1]) : interpolate(e, [0, 1], [0.92, 1]);
  const op = punchIn ? interpolate(frame, [0, 6], [0.55, 1], CLAMP) : interpolate(frame, [2, 12], [0, 1], CLAMP);
  const cardW = 1240, cardH = 640;
  const active = parts.filter((p) => frame >= p.at);
  const cur = active.length ? active[active.length - 1] : parts[0];
  const cutT = frame - cur.at;
  const flash = cur.at > 0 ? interpolate(cutT, [0, 5], [0.7, 0], CLAMP) : 0;
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={64} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 14, overflow: "hidden", background: NEWS.dark, border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 22px 54px rgba(20,18,16,0.28)", transform: `scale(${scale})`, opacity: op }}>
          {parts.map((p) => {
            const isCur = p.src === cur.src && p.at === cur.at;
            if (!isCur) return null;
            const vid = <OffthreadVideo src={staticFile(p.src)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />;
            return (
              <Sequence key={`${p.src}-${p.at}`} from={p.at} layout="none">
                {p.clipDur ? <Loop durationInFrames={p.clipDur} layout="none">{vid}</Loop> : vid}
              </Sequence>
            );
          })}
          {cur.label ? (
            <div style={{ position: "absolute", bottom: 14, left: 16, padding: "7px 16px", borderRadius: 8, background: "rgba(10,9,8,0.7)" }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff" }}>{cur.label}</span>
            </div>
          ) : null}
          <FilmChrome source={source} />
          <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
        </div>
        {chips ? <ChipRail chips={chips} /> : null}
      </div>
    </NewsShell>
  );
};

// timed sticker chips beneath a film card (pop on their whisper word)
const ChipRail: React.FC<{ chips: { at: number; label: string }[] }> = ({ chips }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", minHeight: 64 }}>
      {chips.map((c, i) => {
        const e = spr(frame, fps, c.at, 22);
        const tilt = [-2, 1.5, -1.5, 2][i % 4];
        return (
          <div key={c.label} style={{ padding: "12px 24px", borderRadius: 10, background: NEWS.dark, borderTop: `4px solid ${NEWS.brand}`, boxShadow: "0 10px 26px rgba(20,18,16,0.2)", transform: `translateY(${interpolate(e, [0, 1], [26, 0])}px) rotate(${interpolate(e, [0, 1], [tilt * 2, tilt], CLAMP)}deg)`, opacity: interpolate(frame, [c.at, c.at + 8], [0, 1], CLAMP) }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1, textTransform: "uppercase", color: "#fff", whiteSpace: "nowrap" }}>{c.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── AnnotatedClipCard — ONE long demo clip + a rail of timed annotations ─────
export const AnnotatedClipCard: React.FC<{
  durationInFrames: number; tint?: string; kicker: string; title: string; clip: string; source: string;
  chips: { at: number; label: string }[]; clipDur?: number;
}> = ({ durationInFrames, tint = NEWS.brand, kicker, title, clip, source, chips, clipDur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, 4, 26);
  const cardW = 1240, cardH = 620;
  const vid = <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker={kicker} title={title} titleSize={64} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 14, overflow: "hidden", background: NEWS.dark, border: "1px solid rgba(20,18,16,0.14)", boxShadow: "0 22px 54px rgba(20,18,16,0.28)", transform: `scale(${interpolate(e, [0, 1], [0.92, 1])})`, opacity: interpolate(frame, [4, 16], [0, 1], CLAMP) }}>
          {clipDur ? <Loop durationInFrames={clipDur} layout="none">{vid}</Loop> : vid}
          <FilmChrome source={source} />
        </div>
        <ChipRail chips={chips} />
      </div>
    </NewsShell>
  );
};

// ── OneBrainScene — robot body parts wiring into ONE core (the unified claim) ─
export const OneBrainScene: React.FC<{ durationInFrames: number; tint?: string; coreAt: number; partAts: number[]; tagAt: number }>
  = ({ durationInFrames, tint = NEWS.blue, coreAt, partAts, tagAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const parts = ["Arms", "Hands", "Movement", "Balance"];
  const core = spr(frame, fps, coreAt, 26);
  const tag = spr(frame, fps, tagAt, 22);
  const pos = [{ x: -430, y: -120 }, { x: 430, y: -120 }, { x: -430, y: 120 }, { x: 430, y: 120 }];
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="Google's claim" title="ONE MODEL RUNS THE WHOLE BODY" titleSize={66} accent={NEWS.brand} />}>
      <div style={{ position: "relative", width: 1300, height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* connection lines draw in with each part */}
        <svg width={1300} height={460} style={{ position: "absolute", inset: 0 }}>
          {pos.map((p, i) => {
            const at = partAts[i] ?? 0;
            const d = interpolate(frame, [at, at + 14], [0, 1], CLAMP);
            return <line key={i} x1={650 + p.x * 0.72 * d} y1={230 + p.y * 0.72 * d} x2={650 + p.x * 0.28} y2={230 + p.y * 0.28} stroke={NEWS.blue} strokeWidth={3} opacity={d * 0.7} />;
          })}
        </svg>
        {/* the core */}
        <div style={{ position: "absolute", left: 650 - 170, top: 230 - 78, width: 340, height: 156, borderRadius: 16, background: NEWS.dark, borderTop: `5px solid ${NEWS.blue}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 18px 44px rgba(20,18,16,0.25), 0 0 40px ${NEWS.blue}33`, transform: `scale(${interpolate(core, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [coreAt, coreAt + 8], [0, 1], CLAMP) }}>
          <LabTile logo="google" h={54} at={coreAt + 4} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 34, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>One model</span>
        </div>
        {/* the four body systems */}
        {parts.map((p, i) => {
          const at = partAts[i] ?? 0;
          const e = spr(frame, fps, at, 24);
          return (
            <div key={p} style={{ position: "absolute", left: 650 + pos[i].x - 130, top: 230 + pos[i].y - 40, width: 260, height: 80, borderRadius: 12, background: "#FFFFFF", border: "1.5px solid rgba(20,18,16,0.16)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(20,18,16,0.14)", transform: `scale(${interpolate(e, [0, 1], [0.7, 1])})`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1, textTransform: "uppercase", color: NEWS.ink }}>{p}</span>
            </div>
          );
        })}
        {/* payoff tag */}
        <div style={{ position: "absolute", left: "50%", bottom: -8, transform: `translateX(-50%) rotate(-1.5deg) scale(${interpolate(tag, [0, 1], [1.4, 1])})`, padding: "10px 26px", borderRadius: 10, background: NEWS.blue, opacity: interpolate(frame, [tagAt, tagAt + 8], [0, 1], CLAMP), boxShadow: `0 12px 30px ${NEWS.blue}44` }}>
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 34, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>One connected behaviour</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── HandoffsScene — three separate systems + sparking handoffs → unified bar ──
export const HandoffsScene: React.FC<{ durationInFrames: number; tint?: string; rowAts: number[]; sparkAt: number; unifyAt: number }>
  = ({ durationInFrames, tint = NEWS.amber, rowAts, sparkAt, unifyAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const systems = ["Movement system", "Arm system", "Hand system"];
  const uni = spr(frame, fps, unifyAt, 26);
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} impacts={[sparkAt]} header={<NewsHeadline kicker="Why robots get messy" title="EVERY HANDOFF CAN BREAK" titleSize={68} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {systems.map((s, i) => {
            const at = rowAts[i] ?? 0;
            const e = spr(frame, fps, at, 24);
            const sparkOn = frame >= sparkAt && i < systems.length - 1;
            const pulse = sparkOn ? 0.6 + 0.4 * Math.abs(Math.sin((frame - sparkAt) * 0.35)) : 0;
            return (
              <React.Fragment key={s}>
                <div style={{ width: 320, padding: "26px 18px", borderRadius: 12, background: NEWS.dark, borderTop: `4px solid ${NEWS.amber}`, textAlign: "center", boxShadow: "0 14px 30px rgba(20,18,16,0.18)", transform: `translateY(${interpolate(e, [0, 1], [34, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff" }}>{s}</span>
                </div>
                {i < systems.length - 1 && (
                  <div style={{ width: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: interpolate(frame, [(rowAts[i + 1] ?? 0), (rowAts[i + 1] ?? 0) + 8], [0, 1], CLAMP) }}>
                    <span style={{ fontFamily: HERO, fontSize: 38, color: NEWS.inkDim }}>→</span>
                    {sparkOn && <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, letterSpacing: 1, color: NEWS.red, textTransform: "uppercase", opacity: pulse }}>⚠ risk</span>}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* the unified replacement bar */}
        <div style={{ width: 1140, padding: "20px 0", borderRadius: 12, background: NEWS.dark, borderTop: `5px solid ${NEWS.green}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: `0 16px 40px rgba(20,18,16,0.22), 0 0 36px ${NEWS.green}33`, transform: `translateY(${interpolate(uni, [0, 1], [40, 0])}px) scale(${interpolate(uni, [0, 1], [0.94, 1])})`, opacity: interpolate(frame, [unifyAt, unifyAt + 8], [0, 1], CLAMP) }}>
          <LabTile logo="google" h={52} at={unifyAt + 4} />
          <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 38, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>Gemini Robotics 2 — one system, fewer handoffs</span>
        </div>
      </div>
    </NewsShell>
  );
};

// ── HardwareVsAI — the bodies are third-party; the brain is Google's ─────────
export const HardwareVsAI: React.FC<{ durationInFrames: number; tint?: string; leftAt: number; rightAt: number }>
  = ({ durationInFrames, tint = NEWS.blue, leftAt, rightAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Card: React.FC<{ at: number; accent: string; head: string; body: string; child?: React.ReactNode }> = ({ at, accent, head, body, child }) => {
    const e = spr(frame, fps, at, 26);
    return (
      <div style={{ width: 470, padding: "32px 30px", borderRadius: 12, background: NEWS.dark, borderTop: `5px solid ${accent}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, boxShadow: "0 16px 40px rgba(20,18,16,0.2)", transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 44, letterSpacing: 1, textTransform: "uppercase", color: "#fff" }}>{head}</span>
        {child}
        <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 25, textAlign: "center", color: "rgba(255,255,255,0.8)" }}>{body}</span>
      </div>
    );
  };
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="Worth separating" title="THE BODIES AREN'T THE STORY" titleSize={70} accent={NEWS.brand} />}>
      <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
        <Card at={leftAt} accent={NEWS.inkDim} head="The bodies" body="Apollo & Duo — third-party humanoid platforms" />
        <Card at={rightAt} accent={NEWS.brand} head="The brain" body="Google's contribution: the intelligence" child={<LabTile logo="google" h={64} at={rightAt + 6} />} />
      </div>
    </NewsShell>
  );
};

// ── MissingProofScene — what Google has NOT shown (red-cross checklist) ───────
export const MissingProofScene: React.FC<{ durationInFrames: number; tint?: string; items: { at: number; label: string; sub?: string }[] }>
  = ({ durationInFrames, tint = NEWS.red, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="What Google hasn't shown" title="THE MISSING PROOF" titleSize={72} accent={NEWS.brand} />}>
      <div style={{ width: 960, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it) => {
          const e = spr(frame, fps, it.at, 24);
          return (
            <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 28px", borderRadius: 12, background: NEWS.dark, borderTop: `4px solid ${NEWS.red}`, boxShadow: "0 12px 28px rgba(20,18,16,0.18)", transform: `translateX(${interpolate(e, [0, 1], [-42, 0])}px)`, opacity: interpolate(frame, [it.at, it.at + 8], [0, 1], CLAMP) }}>
              <svg width={34} height={34} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={NEWS.red} /><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 31, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", flex: 1 }}>{it.label}</span>
              {it.sub && <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 21, color: "rgba(255,255,255,0.65)" }}>{it.sub}</span>}
            </div>
          );
        })}
      </div>
    </NewsShell>
  );
};

// ── StatCard — one big cited number (the 22-joint hand reference) ─────────────
export const JointsStat: React.FC<{ durationInFrames: number; tint?: string; numAt: number }>
  = ({ durationInFrames, tint = NEWS.blue, numAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spr(frame, fps, numAt, 26);
  const count = Math.round(interpolate(frame, [numAt, numAt + 22], [0, 22], CLAMP));
  return (
    <NewsShell durationInFrames={durationInFrames} tint={tint} header={<NewsHeadline kicker="The benchmark is biology" title="THE HUMAN HAND" titleSize={72} accent={NEWS.brand} />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${interpolate(e, [0, 1], [0.8, 1])})`, opacity: interpolate(frame, [numAt - 4, numAt + 6], [0, 1], CLAMP) }}>
        <span style={{ fontFamily: HERO, fontWeight: 400, fontSize: 260, lineHeight: 0.9, color: NEWS.ink }}>{count}</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, letterSpacing: 4, textTransform: "uppercase", color: NEWS.brand }}>Articulated joints</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 23, color: NEWS.inkDim }}>the dexterity target Google is chasing</span>
      </div>
    </NewsShell>
  );
};
